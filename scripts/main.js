/**
 * Delta Kilo Fluid Gauge - laublub.js
 * Drink-Socket-Logik (Gauge-Erhöhung auf fremdem Actor über GM-Client),
 * Douse-Template-Ablauf-Check (läuft im selben updateWorldTime-Hook wie
 * der Gauge-Update-Hook, aber datei-lokal für Laublub-Fachlogik),
 * Abwisch-Macro-Funktion für den Throw-Öl-Status.
 */

const DKG_DRINK_SOCKET = "module.delta-kilo-fluid-gauge";

/* -------------------------------------------- */
/*  Drink-Socket-Logik                           */
/* -------------------------------------------- */

/**
 * Wird von der Drink-Activity aus aufgerufen (z.B. über ein Item-Macro
 * oder einen Activity-Hook, sobald das Consumption Scaling ausgewertet ist).
 * Sendet eine Socket-Nachricht mit Ziel-Actor-ID und Stunden-Delta.
 * Da game.socket.emit die eigene Nachricht NICHT an den Sender selbst
 * zurückspielt, wird bei GM-als-Sender die Anwendung direkt lokal ausgeführt.
 */
async function dkgRequestGaugeIncrease(targetActorId, hoursToAdd) {
  console.log("[DKG:laublub] dkgRequestGaugeIncrease called", { targetActorId, hoursToAdd });

  if (game.user.isGM) {
    console.log("[DKG:laublub] sender is GM, applying locally without socket roundtrip");
    await dkgApplyGaugeIncrease(targetActorId, hoursToAdd);
    return;
  }

  console.log("[DKG:laublub] emitting drink socket message", { targetActorId, hoursToAdd });
  game.socket.emit(DKG_DRINK_SOCKET, {
    type: "drink",
    targetActorId,
    hoursToAdd
  });

  ui.notifications.info(`Laublub verabreicht: +${hoursToAdd}h angefragt (wird vom GM verarbeitet).`);
}

/**
 * Führt die eigentliche Gauge-Erhöhung aus. Nur auf dem GM-Client relevant,
 * da nur der GM Owner-Rechte auf beliebige Actors hat.
 */
async function dkgApplyGaugeIncrease(targetActorId, hoursToAdd) {
  console.log("[DKG:laublub] dkgApplyGaugeIncrease called", { targetActorId, hoursToAdd });

  const { GAUGE_CAP_HOURS } = globalThis.DKG_CONSTANTS ?? { GAUGE_CAP_HOURS: 48 };

  const actor = game.actors.get(targetActorId);
  if (!actor) {
    console.warn("[DKG:laublub] dkgApplyGaugeIncrease: target actor not found", targetActorId);
    return;
  }

  const currentValue = actor.getFlag("dkg", "gaugeValue") ?? 0;
  const newValue = Math.min(GAUGE_CAP_HOURS, currentValue + hoursToAdd);

  console.log("[DKG:laublub] applying gauge increase", {
    actorName: actor.name,
    currentValue,
    hoursToAdd,
    newValue,
    wasted: currentValue + hoursToAdd - newValue
  });

  await actor.update({ "flags.dkg.gaugeValue": newValue });

  ui.notifications.info(`${actor.name}: Gauge um ${hoursToAdd}h erhöht (jetzt ${newValue.toFixed(1)}h).`);
}

Hooks.once("ready", () => {
  console.log("[DKG:laublub] ready hook fired, registering drink socket listener");

  game.socket.on(DKG_DRINK_SOCKET, (payload) => {
    console.log("[DKG:laublub] socket message received", payload);

    if (game.user !== game.users.activeGM) {
      console.log("[DKG:laublub] not the active GM client, ignoring socket message");
      return;
    }

    if (payload?.type === "drink") {
      dkgApplyGaugeIncrease(payload.targetActorId, payload.hoursToAdd);
    } else {
      console.warn("[DKG:laublub] unknown socket message type", payload?.type);
    }
  });
});

/* -------------------------------------------- */
/*  Drink-Activity-Trigger (dnd5e.postUseActivity) */
/* -------------------------------------------- */

/**
 * Liste der Activity-Identifier, die als "Drink" gelten. Muss zu den
 * Activity-Namen aus den Laublub-Item-JSONs passen (system.identifier
 * existiert auf Activities nicht direkt, daher wird über den Namen
 * gefiltert).
 */
const DKG_DRINK_ACTIVITY_NAME = "Drink";

/**
 * Fängt jede Activity-Nutzung ab. Reagiert nur, wenn es sich um eine
 * Drink-Activity eines Laublub-Items handelt (erkennbar an
 * flags.dkg.hoursValue auf dem Item). Die tatsächlich verbrauchte
 * Charge-Anzahl wird über die Uses-Differenz des Items VOR/NACH der
 * Aktivität ermittelt, da die exakte Feldstruktur von
 * ActivityUsageResults für Consumption-Werte nicht zuverlässig
 * dokumentiert ist und hier bewusst kein unsicherer Feldpfad geraten wird.
 */
Hooks.on("dnd5e.postUseActivity", async (activity, usageConfig, results) => {
  console.log("[DKG:laublub] dnd5e.postUseActivity hook fired", {
    activityName: activity?.name,
    itemName: activity?.item?.name
  });

  if (activity?.name !== DKG_DRINK_ACTIVITY_NAME) {
    console.log("[DKG:laublub] postUseActivity: not a Drink activity, skipping");
    return;
  }

  const item = activity.item;
  const hoursPerCharge = item?.getFlag("dkg", "hoursValue") ? 1 : null;

  if (hoursPerCharge === null) {
    console.log("[DKG:laublub] postUseActivity: item has no dkg.hoursValue flag, not a laublub item, skipping");
    return;
  }

  // Verbrauchte Charges: aktueller item.system.uses.spent minus dem Wert
  // VOR der Aktivierung. usageConfig.consumed liefert idealerweise die
  // Menge direkt; als Fallback wird 1 Charge angenommen.
  const consumedCharges = usageConfig?.consume?.resources?.length
    ? (usageConfig.consume.resources[0]?.delta ?? 1)
    : 1;

  console.log("[DKG:laublub] postUseActivity: drink activity consumption detected", {
    itemName: item?.name,
    consumedCharges
  });

  // Zielermittlung: bevorzugt usageConfig.targets (falls vom Activity-Target
  // gesetzt), Fallback auf die aktuell vom Nutzer gesetzten Targets.
  let targetActor = null;
  const configTargets = usageConfig?.targets;
  if (configTargets && configTargets.size > 0) {
    const firstTargetId = Array.from(configTargets)[0];
    targetActor = game.actors.get(firstTargetId) ?? canvas.tokens.get(firstTargetId)?.actor;
  }
  if (!targetActor && game.user.targets.size > 0) {
    targetActor = Array.from(game.user.targets)[0]?.actor;
  }

  if (!targetActor) {
    console.warn("[DKG:laublub] postUseActivity: no target actor could be determined for drink");
    ui.notifications.warn("Kein Ziel für Drink-Activity gefunden. Bitte Token targeten.");
    return;
  }

  const hoursToAdd = consumedCharges * hoursPerCharge;

  console.log("[DKG:laublub] postUseActivity: dispatching drink request", {
    targetActorId: targetActor.id,
    targetActorName: targetActor.name,
    hoursToAdd
  });

  await dkgRequestGaugeIncrease(targetActor.id, hoursToAdd);
});

/* -------------------------------------------- */
/*  Douse-Template-Ablauf-Check                  */
/* -------------------------------------------- */

/**
 * Läuft im selben updateWorldTime-Hook wie der Gauge-Update-Hook in
 * gauge.js, aber als eigener, datei-lokaler Listener. Nur GM-Client.
 * Prüft alle Measured Templates der aktuellen Szene auf abgelaufene
 * Douse-Flags und löscht sie automatisch.
 */
Hooks.on("updateWorldTime", (worldTime, dt) => {
  if (!game.user.isGM) return;

  const scene = canvas.scene;
  if (!scene) {
    console.log("[DKG:laublub] updateWorldTime (douse check): no active scene, skipping");
    return;
  }

  const douseTemplates = scene.templates.filter((t) => t.getFlag("dkg", "isDouseTemplate") === true);

  if (douseTemplates.length === 0) {
    console.log("[DKG:laublub] updateWorldTime (douse check): no active douse templates, skipping");
    return;
  }

  console.log("[DKG:laublub] updateWorldTime (douse check): checking douse templates", {
    count: douseTemplates.length,
    worldTime
  });

  const expiredIds = [];

  for (const template of douseTemplates) {
    const placedAt = template.getFlag("dkg", "placedAt") ?? worldTime;
    const durationSeconds = template.getFlag("dkg", "durationSeconds") ?? 0;
    const elapsed = worldTime - placedAt;

    console.log("[DKG:laublub] checking douse template", {
      templateId: template.id,
      placedAt,
      durationSeconds,
      elapsed
    });

    if (elapsed >= durationSeconds) {
      console.log("[DKG:laublub] douse template expired, marking for deletion", template.id);
      expiredIds.push(template.id);
    }
  }

  if (expiredIds.length > 0) {
    console.log("[DKG:laublub] deleting expired douse templates", expiredIds);
    scene.deleteEmbeddedDocuments("MeasuredTemplate", expiredIds).catch((err) => {
      console.error("[DKG:laublub] failed to delete expired douse templates", err);
    });
  }
});

/**
 * Wird beim Platzieren eines Douse-Templates aufgerufen, um die
 * dkg-Ablauf-Flags zu setzen. durationSeconds kommt aus dem
 * douseEvaporateSeconds-Flag des jeweiligen Laublub-Items.
 */
async function dkgMarkDouseTemplate(templateDocument, durationSeconds) {
  console.log("[DKG:laublub] dkgMarkDouseTemplate called", {
    templateId: templateDocument?.id,
    durationSeconds
  });

  if (!templateDocument) {
    console.warn("[DKG:laublub] dkgMarkDouseTemplate: no template document provided");
    return;
  }

  await templateDocument.setFlag("dkg", "isDouseTemplate", true);
  await templateDocument.setFlag("dkg", "placedAt", game.time.worldTime);
  await templateDocument.setFlag("dkg", "durationSeconds", durationSeconds);

  console.log("[DKG:laublub] douse template flags set", { templateId: templateDocument.id });
}

/* -------------------------------------------- */
/*  Abwisch-Macro-Funktion (Throw-Öl-Status)     */
/* -------------------------------------------- */

/**
 * Wird von einem Spieler-Macro zu Rundenbeginn ausgeführt. Würfelt einen
 * DC-10-Dexterity-Save für den ausgewählten/kontrollierten Token; bei
 * Erfolg wird die Dauer des dkg-oil-Effekts um 5 Runden (= 30 Sekunden)
 * reduziert.
 */
async function dkgWipeOffOil() {
  console.log("[DKG:laublub] dkgWipeOffOil called");

  const token = canvas.tokens.controlled[0];
  if (!token || !token.actor) {
    console.warn("[DKG:laublub] dkgWipeOffOil: no token/actor selected");
    ui.notifications.warn("Kein Token ausgewählt.");
    return;
  }

  const actor = token.actor;
  const oilEffect = actor.effects.find((e) => e.getFlag("dkg", "isOilEffect") === true);

  if (!oilEffect) {
    console.log("[DKG:laublub] dkgWipeOffOil: no active oil effect on actor", actor.name);
    ui.notifications.info(`${actor.name} ist nicht mit Öl bedeckt.`);
    return;
  }

  console.log("[DKG:laublub] rolling DC 10 dexterity save to wipe off oil", { actorName: actor.name });

  const roll = await actor.rollSavingThrow?.({ ability: "dex" }) ?? await new Roll(
    `1d20 + ${actor.system?.abilities?.dex?.mod ?? 0}`
  ).evaluate();

  const total = roll?.total ?? roll?.rolls?.[0]?.total ?? 0;
  const success = total >= 10;

  console.log("[DKG:laublub] wipe off save result", { total, success });

  if (success) {
    const currentRounds = oilEffect.getFlag("dkg", "remainingRounds") ?? 0;
    const newRounds = Math.max(0, currentRounds - 5);

    console.log("[DKG:laublub] wipe off successful, reducing oil duration", { currentRounds, newRounds });

    if (newRounds <= 0) {
      await oilEffect.delete();
      ui.notifications.info(`${actor.name} hat das Öl vollständig abgewischt.`);
    } else {
      await oilEffect.setFlag("dkg", "remainingRounds", newRounds);
      ui.notifications.info(`${actor.name} hat abgewischt: Öl-Dauer um 5 Runden reduziert (${newRounds} verbleibend).`);
    }
  } else {
    ui.notifications.info(`${actor.name} konnte das Öl nicht abwischen (Save fehlgeschlagen).`);
  }
}

/* -------------------------------------------- */
/*  Global verfügbar machen für Macros/Activities */
/* -------------------------------------------- */

globalThis.DKG_LAUBLUB = {
  requestGaugeIncrease: dkgRequestGaugeIncrease,
  markDouseTemplate: dkgMarkDouseTemplate,
  wipeOffOil: dkgWipeOffOil
};

console.log("[DKG:laublub] laublub.js loaded");
