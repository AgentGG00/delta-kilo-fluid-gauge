# Übergabe – Delta Kilo Fluid Gauge

## Zweck & Kontext
Foundry-Modul für die Horizon-Kampagne. Details siehe `projekt-plan.md`, laufender
Fortschritt siehe `projekt-stand.md`. Diese Datei hält Kontext fest, der sich nicht
aus den anderen beiden Dateien ergibt – Server-Details, Entscheidungen, Fallstricke.

## Server & Infrastruktur
- VPS: Contabo, Repo-Pfad: `/foundry/vtt-dev/docs/Data/modules/delta-kilo-fluid-gauge`
- Branches: `main` (Release), `dev` (Version-Bump)
- Devcontainer läuft über `devcontainer` CLI (nicht Cloud-Codespace), Workspace
  `/workspaces/delta-kilo-fluid-gauge`, Container-Name wechselt bei jedem Neustart
  (Docker vergibt zufällige Namen) – vor Arbeit immer `docker ps` prüfen
- Alter CAO-Devcontainer ist gestoppt (nicht entfernt) für Fall der Rückkehr
- Foundry-Server: Live Port 30000 (`foundryvtt`), Test/Dev Port 30001 (`foundryvtt-dev`)

## Wichtige Entscheidungen (nicht neu diskutieren)

### Gauge & Zeitsystem
- Gauge-Logik: additiv mit Cap 48h + Auto-Verschwendung bei Überlauf, kein harter Kauf-Stopp
- Zeit-Anbindung läuft über den Core-Foundry-Hook `updateWorldTime`, nicht über eine
  Simple-Timekeeping-eigene API – Simple Timekeeping nutzt intern die Core Calendar API
  und hat keinen eigenen Hook-Namen. Simple Timekeeping bleibt trotzdem Dependency (liefert
  UI/UX für Zeitfortschritt in der Kampagne)
- Kein eigener Throttle im Modul – Simple Timekeepings "Update Frequency"-Einstellung
  (aktuell 60 Sekunden bei Niklas' Setup) regelt die Hook-Taktung bereits ausreichend
- Negatives `dt` (Zeit zurückgedreht) → Gauge wird proportional zurückgerechnet
- Schreiblogik (Gauge-Update) läuft ausschließlich auf dem GM-Client (`game.user.isGM`-Check),
  iteriert dort über alle Actors mit `flags.dkg.race === true`. HUD-Rendering (Lesen/Anzeigen)
  läuft dagegen lokal auf jedem Client, nur für den jeweils sichtbaren/eigenen Actor

### Actor-Flags Schema (`flags.dkg.*`)
- `flags.dkg.race` – Boolean, Zugehörigkeit zur Autarch-Race
- `flags.dkg.gaugeValue` – Number, Stunden (0–48), additiver Füllstand
- `flags.dkg.lastUpdate` – Number, Game-Time-Timestamp des letzten Hook-Ticks
- `flags.dkg.hudVisible` – Boolean, individueller Anzeige-Toggle, unabhängig von `race`
  (Spieler kann HUD z.B. im Kampf ausblenden, ohne Rassenzugehörigkeit zu verlieren)
- Alarm-Zustand (≤20%) wird NICHT als Flag gespeichert, sondern live beim HUD-Rendering
  berechnet (`fillPercent <= 20` → CSS-Klasse `alarm` mit `@keyframes`-Blinken).
  Kein `while`-Loop für die Blink-Logik – blockiert den JS-Main-Thread

### HUD-Toggle
- Kein Sheet-Button (zu wartungsintensiv bei dnd5e-Sheet-Updates), sondern ein
  eigenständiges Macro im Compendium, das der Spieler selbst in seine Hotbar zieht.
  Macro toggelt `flags.dkg.hudVisible` per `actor.setFlag()`/`unsetFlag()` – Core-API,
  stabil über Sheet-Updates hinweg
- Kein eigener Berechtigungs-Check im Macro nötig – Foundry-native Owner-Permission auf
  Actor-Ebene regelt das. Niklas verteilt Spieler-Rechte manuell in der Welt

### Autarchen-Rasse "Delta Kilo Modell (A)"
- Komplett neu niedergeschrieben, KEIN Import/Export aus DDB (alte Exportdateien fehlerhaft)
- Warforged-Basis war nur thematische Inspiration, keine 1:1-Übernahme der offiziellen
  Warforged-Werte
- Natural Armor: reiner +3 AC-Bonus (Active Effect), keine eigene AC-Formel, keine Rüstung
  tragbar (Lore-Grund: keine Rüstung passt der Rasse)
- Size/Height: nur Beschreibungstext "80–160cm", kein Rolltable, keine Automatisierung
- Water Susceptibility (DEX-Save-Disadvantage bei Untertauchen, 24h Nachwirkung) ist bewusst
  hart und OHNE Ausnahme fürs Durchqueren von Gewässern – mit der Spielerin abgesprochen
- "Lubricants"-Bedarf aus Constructed Resilience verweist auf das Gauge-System des Moduls
- Heilitem + Heilspell aus altem DDB-Konzept sind durch EIN Item (Smelters Edge, Tool)
  abgedeckt – kein separater Spell geplant

### Laublub – Reinheitsstufen & Activities
- Delta-Kilo-Autarchen können nur Simple gefiltert + Gefiltert trinken (Drink-Activity),
  Roh ist zu unrein, Destilliert zu rein – Drink ist race-gebunden (`flags.dkg.race`)
- Douse und Throw sind NICHT race-gebunden, jeder Actor kann sie nutzen (normale Oil-Flask-Mechanik)
- Throw folgt der PHB-2024-Oil-Flask-Regel (Attack-Action-Replacement, DEX/STR-Angriffswurf
  wie Finesse, kein Basisschaden – aller Schaden kommt aus dem Entzünden-Event)
- Douse erzeugt ein Terrain-Feld (5x5ft pro Charge), schwieriges Terrain + Sturz-Save bis
  zum Verdampfen, danach entzündbar mit Brand-Schaden pro Runde
- Reinheitsstufe skaliert bei beiden: Terrain-/Öl-Haltbarkeit UND Brand-Schaden/Bonus steigen
  mit der Reinheit (siehe Item-Beschreibungstexte für exakte Werte pro Stufe)
- Entzünden selbst ist NICHT Teil des Laublub-Items (keine eigene "Ignite"-Activity) –
  kommt von außen (Feuerzauber, andere Feuerquelle). Modul muss nur auf Fire-Damage-Trigger
  reagieren, wenn Öl-Status aktiv ist
- Douse-Öl-Effekt und Throw-Öl-Effekt sind zwei technisch komplett getrennte Statuseffekte
  (kein gemeinsamer Unterbau)

### Ressourcen & Crafting-Kette
- Autarchen-Katalysator ist Loot-fähig (Korrektur gegenüber altem Stand: vorher "nur
  kaufbar, keine Loot-Anbindung" – das gilt nicht mehr)
- Item-Typen: Stoff = Loot/Quantity, Stofffilter = Consumable/Quantity (KEIN Charge),
  Filtermaterial = Consumable/5 Charges, Filter = Tool (unbegrenzt), Katalysator =
  Consumable/5 Charges
- Rarity-Mapping (Niklas' Umgangssprache → dnd5e-Feld): "Epic" = Rare, "Mythic" = Artifact
- Preise sind bewusst hoch angesetzt als "Kaufpreis für den Not-/Faulweg" – der eigentliche
  Anreiz ist, dass Spieler die selbst craften/looten (Nebelrufer jagen für Katalysatoren,
  Filter potenziell aus Eisen/Ancient Steel craften) deutlich günstiger wegkommen als beim
  Vollpreis-Kauf. Fertiges Destilliertes Laublub vom Händler (Apotheker mit Fließband-Anlage)
  ist güntiger als Solo-Herstellung durch Spieler – das ist gewollter Skaleneffekt, kein
  Balancing-Fehler
- Ankauf = halber Verkaufspreis (Hausregel, unverändert)
- Vollständige Crafting-Rezepte siehe `projekt-stand.md` und Item-Beschreibungstexte

### Smelters Edge (Heilwerkzeug)
- Charges: `Charakterlevel + 2`, Recovery Short Rest `floor(Level/3)`, Long Rest voller Reset
- Spieler wählt bei jeder Nutzung frei zwischen 3 Skalierungsstufen (1/2/3 Charges),
  Formel wechselt Würfelgröße (2d6/2d8/2d10 + Spellcasting-Mod + Prof-Bonus) – kein
  lineares Add-on-Scaling wie bei normalen Spells
- Fällt der Nutzer keine Spellcasting-Klasse hat: Spellcasting-Mod wird als +0 behandelt,
  kein Ausschluss der Nutzung
- Ziel-Unterscheidung: Autarch (`flags.dkg.race`) → Heilung, Nicht-Autarch → exakt gleiche
  Formel, aber als Fire-Schaden statt Heilung
- Kein Verkaufspreis (individuelles Story-Item eines Heilers, nicht händlerfähig)

### Sonstiges
- Repo-Sichtbarkeit: öffentlich, GitHub Org `AgentGG00` (NICHT `AgentGGNik007` – das ist
  nur der Pseudonym-Name für LICENSE-Copyright, nicht die Org)
- Foundry-Autor in `module.json`: `AgentGG` (drittes, wieder anderes Pseudonym – nur für
  Foundry-Package-Metadaten, nicht LICENSE, nicht GitHub-Org)
- Kein Alpha/Beta-Status – Modul bleibt durchgängig 0.x.x bis Full Release (1.0.0)

## Nächste Schritte
Siehe `projekt-stand.md`. Kritischer Pfad jetzt: Gauge-Update-Hook (`updateWorldTime`)
→ Race-Zuweisung-Hook → Gauge-HUD (ApplicationV2 + CSS) → HUD-Toggle-Macro → Consume/
Douse/Throw-Automatisierung → Smelters-Edge-Ziel-Unterscheidung → Crafting-Rezepte in
Mastercrafted.