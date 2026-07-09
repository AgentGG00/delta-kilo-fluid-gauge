/**
 * Delta Kilo Fluid Gauge - gauge.js
 * Gauge-Update-Hook (updateWorldTime, GM-only), Gauge-HUD (ApplicationV2),
 * HUD-Toggle-Macro-Funktion, DM-Set-Macro-Funktion.
 */

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

/* -------------------------------------------- */
/*  Gauge-Update-Hook (GM-only)                  */
/* -------------------------------------------- */

Hooks.on("updateWorldTime", (worldTime, dt) => {
  console.log("[DKG:gauge] updateWorldTime hook fired", { worldTime, dt, isGM: game.user.isGM });

  if (!game.user.isGM) {
    console.log("[DKG:gauge] updateWorldTime: not GM client, skipping gauge update");
    return;
  }

  const { GAUGE_CAP_HOURS } = globalThis.DKG_CONSTANTS ?? { GAUGE_CAP_HOURS: 48 };
  const dtHours = dt / 3600;

  const autarchActors = game.actors.filter((a) => a.getFlag("delta-kilo-fluid-gauge", "race") === true);
  console.log("[DKG:gauge] found autarch actors for gauge update", { count: autarchActors.length });

  for (const actor of autarchActors) {
    const currentValue = actor.getFlag("delta-kilo-fluid-gauge", "gaugeValue") ?? 0;
    let newValue = currentValue + dtHours;

    newValue = Math.min(GAUGE_CAP_HOURS, Math.max(0, newValue));

    console.log("[DKG:gauge] updating gauge for actor", {
      actorName: actor.name,
      currentValue,
      dtHours,
      newValue
    });

    actor.update({
      "flags.delta-kilo-fluid-gauge.gaugeValue": newValue,
      "flags.delta-kilo-fluid-gauge.lastUpdate": worldTime
    }).catch((err) => {
      console.error("[DKG:gauge] failed to update gauge for actor", actor.id, err);
    });
  }
});

/* -------------------------------------------- */
/*  Gauge-HUD (ApplicationV2)                    */
/* -------------------------------------------- */

class DKGGaugeHud extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "dkg-gauge-hud",
    window: {
      frame: false,
      positioned: true
    },
    position: {
      left: 20,
      top: 200,
      width: 220,
      height: 480
    }
  };

  static PARTS = {
    hud: {
      template: `modules/${globalThis.DKG_CONSTANTS?.MODULE_ID ?? "delta-kilo-fluid-gauge"}/assets/templates/gauge-hud.hbs`
    }
  };

  static getOwnedAutarchActor() {
    const actor = game.actors.find((a) => a.getFlag("delta-kilo-fluid-gauge", "race") === true && a.isOwner);
    console.log("[DKG:gauge] getOwnedAutarchActor result", { found: !!actor, actorName: actor?.name });
    return actor;
  }

  async _prepareContext(options) {
    console.log("[DKG:gauge] DKGGaugeHud._prepareContext called");

    const actor = DKGGaugeHud.getOwnedAutarchActor();
    const { GAUGE_CAP_HOURS } = globalThis.DKG_CONSTANTS ?? { GAUGE_CAP_HOURS: 48 };

    if (!actor) {
      console.log("[DKG:gauge] _prepareContext: no owned autarch actor found");
      return { hasActor: false };
    }

    const gaugeValue = actor.getFlag("delta-kilo-fluid-gauge", "gaugeValue") ?? 0;
    const fillPercent = Math.round((gaugeValue / GAUGE_CAP_HOURS) * 100);
    const isAlarm = fillPercent <= 20;

    console.log("[DKG:gauge] _prepareContext computed values", { gaugeValue, fillPercent, isAlarm });

    return {
      hasActor: true,
      actorName: actor.name,
      gaugeValue,
      fillPercent,
      isAlarm
    };
  }

  async _onRender(context, options) {
    await super._onRender(context, options);
    console.log("[DKG:gauge] DKGGaugeHud._onRender called", { hasActor: context.hasActor });

    if (!context.hasActor) return;

    const fillEl = this.element.querySelector(".dkg-gauge-fill");
    if (fillEl) {
      fillEl.style.height = `${context.fillPercent}%`;
    }

    const lampGreen = this.element.querySelector(".dkg-lamp-green");
    const lampRed = this.element.querySelector(".dkg-lamp-red");
    if (lampGreen && lampRed) {
      lampGreen.classList.toggle("dkg-lamp-on", !context.isAlarm);
      lampRed.classList.toggle("dkg-lamp-on", context.isAlarm);
    }
  }
}

let dkgHudInstance = null;

function refreshGaugeHud() {
  console.log("[DKG:gauge] refreshGaugeHud called");

  const { MODULE_ID } = globalThis.DKG_CONSTANTS ?? { MODULE_ID: "delta-kilo-fluid-gauge" };
  const hudVisible = game.settings.get(MODULE_ID, "hudVisible");
  const ownedActor = DKGGaugeHud.getOwnedAutarchActor();

  const shouldShow = hudVisible && !!ownedActor;
  console.log("[DKG:gauge] refreshGaugeHud conditions", { hudVisible, hasOwnedActor: !!ownedActor, shouldShow });

  if (shouldShow) {
    if (!dkgHudInstance) {
      console.log("[DKG:gauge] creating new DKGGaugeHud instance");
      dkgHudInstance = new DKGGaugeHud();
    }
    dkgHudInstance.render(true);
  } else if (dkgHudInstance) {
    console.log("[DKG:gauge] closing DKGGaugeHud instance");
    dkgHudInstance.close();
  }
}

Hooks.once("ready", () => {
  console.log("[DKG:gauge] ready hook fired, initial HUD refresh");
  refreshGaugeHud();
});

Hooks.on("updateActor", (actor, changes, options, userId) => {
  if (actor.getFlag("delta-kilo-fluid-gauge", "race") !== true) return;
  console.log("[DKG:gauge] updateActor hook fired for autarch actor, refreshing HUD", { actorId: actor.id });
  refreshGaugeHud();
});

/* -------------------------------------------- */
/*  HUD-Toggle-Macro-Funktion                    */
/* -------------------------------------------- */

async function dkgToggleHudVisibility() {
  console.log("[DKG:gauge] dkgToggleHudVisibility called");

  const { MODULE_ID } = globalThis.DKG_CONSTANTS ?? { MODULE_ID: "delta-kilo-fluid-gauge" };
  const current = game.settings.get(MODULE_ID, "hudVisible");
  const next = !current;

  console.log("[DKG:gauge] toggling hudVisible", { current, next });

  await game.settings.set(MODULE_ID, "hudVisible", next);
  refreshGaugeHud();

  ui.notifications.info(`Delta Kilo Gauge HUD ${next ? "eingeblendet" : "ausgeblendet"}.`);
}

/* -------------------------------------------- */
/*  DM-Set-Macro-Funktion                        */
/* -------------------------------------------- */

async function dkgSetGaugeByPercent(targetPercent) {
  console.log("[DKG:gauge] dkgSetGaugeByPercent called", { targetPercent });

  const { GAUGE_CAP_HOURS } = globalThis.DKG_CONSTANTS ?? { GAUGE_CAP_HOURS: 48 };

  const token = canvas.tokens.controlled[0];
  if (!token) {
    console.warn("[DKG:gauge] dkgSetGaugeByPercent: no token controlled");
    ui.notifications.warn("Kein Token ausgewählt.");
    return;
  }

  const actor = token.actor;
  if (!actor) {
    console.warn("[DKG:gauge] dkgSetGaugeByPercent: controlled token has no actor");
    ui.notifications.warn("Ausgewählter Token hat keinen Actor.");
    return;
  }

  const newValue = GAUGE_CAP_HOURS * (targetPercent / 100);

  console.log("[DKG:gauge] setting gauge value directly", { actorName: actor.name, newValue });

  await actor.update({
    "flags.delta-kilo-fluid-gauge.gaugeValue": newValue,
    "flags.delta-kilo-fluid-gauge.lastUpdate": game.time.worldTime
  });

  ui.notifications.info(`Gauge von ${actor.name} auf ${targetPercent}% (${newValue.toFixed(1)}h) gesetzt.`);
}

/* -------------------------------------------- */
/*  Global verfügbar machen für Macros           */
/* -------------------------------------------- */

globalThis.DKG_GAUGE = {
  toggleHudVisibility: dkgToggleHudVisibility,
  setGaugeByPercent: dkgSetGaugeByPercent,
  refreshGaugeHud
};

console.log("[DKG:gauge] gauge.js loaded");
