/**
 * Delta Kilo Fluid Gauge - main.js
 * Modul-Einstiegspunkt: Settings-Registrierung, Race-Zuweisung-Hook.
 * Fachlogik zu Gauge/HUD liegt in gauge.js, zu Laublub in laublub.js.
 */

const MODULE_ID = "delta-kilo-fluid-gauge";
const RACE_IDENTIFIER = "delta-kilo-modell-a";
const GAUGE_CAP_HOURS = 48;

/* -------------------------------------------- */
/*  Settings                                     */
/* -------------------------------------------- */

Hooks.once("init", () => {
  console.log("[DKG:main] init hook fired, registering settings");

  game.settings.register(MODULE_ID, "hudVisible", {
    name: "Delta Kilo Fluid Gauge HUD Visibility",
    hint: "Client-seitige Sichtbarkeit des Gauge-HUD. Wird über das Toggle-Macro gesteuert.",
    scope: "client",
    config: false,
    type: Boolean,
    default: true
  });

  console.log("[DKG:main] settings registered");
});

/* -------------------------------------------- */
/*  Race-Zuweisung-Hook                          */
/* -------------------------------------------- */

/**
 * Feuert bei jedem Item, das einem Actor hinzugefügt wird.
 * Prüft, ob es sich um das Delta-Kilo-Race-Item handelt, und setzt
 * bei Zutreffen die initialen flags.dkg.* Werte auf dem Actor.
 */
Hooks.on("createItem", (item, options, userId) => {
  console.log("[DKG:main] createItem hook fired", {
    itemName: item?.name,
    itemType: item?.type,
    parentActor: item?.parent?.name,
    userId
  });

  // Nur reagieren, wenn das Item tatsächlich auf einem Actor liegt
  if (!item.parent || item.parent.documentName !== "Actor") {
    console.log("[DKG:main] createItem: item has no actor parent, skipping");
    return;
  }

  // Nur reagieren, wenn es sich um das Delta-Kilo-Race-Item handelt
  const identifier = item.system?.identifier;
  if (item.type !== "race" || identifier !== RACE_IDENTIFIER) {
    console.log("[DKG:main] createItem: not the Delta Kilo race item, skipping", {
      type: item.type,
      identifier
    });
    return;
  }

  const actor = item.parent;

  console.log("[DKG:main] Delta Kilo race item detected on actor, initializing dkg flags", {
    actorName: actor.name,
    actorId: actor.id
  });

  actor.update({
    "flags.delta-kilo-fluid-gauge.race": true,
    "flags.delta-kilo-fluid-gauge.gaugeValue": 0,
    "flags.delta-kilo-fluid-gauge.lastUpdate": game.time.worldTime
  }).then(() => {
    console.log("[DKG:main] actor flags initialized successfully", { actorId: actor.id });
  }).catch((err) => {
    console.error("[DKG:main] failed to initialize actor flags", err);
  });
});

/* -------------------------------------------- */
/*  Exportierte Konstanten für andere Dateien    */
/* -------------------------------------------- */

// Global verfügbar machen, damit gauge.js / laublub.js nicht doppelt definieren müssen
globalThis.DKG_CONSTANTS = {
  MODULE_ID,
  RACE_IDENTIFIER,
  GAUGE_CAP_HOURS
};

console.log("[DKG:main] main.js loaded");
