## Checklist

### Init
- [x] Repo-Grundgerüst (module.json, LICENSE-Autor auf Pseudonym anpassen, docs/-Struktur)
- [x] module.json Grunddaten (id, title, description, compatibility, relationships)

### Backend
- n/a – reines Client-seitiges Foundry-Modul, kein Backend

### Frontend
- [ ] Gauge-HUD Grundgerüst (ApplicationV2)
- [ ] Steampunk-Röhrchen-CSS/Optik
- [ ] Alarm-Lämpchen (Blink bei ≤20%)

### Framework
- [x] Actor-Flags Schema (`flags.dkg.*`) definieren
- [x] Hook-Anbindung Simple Timekeeping & Calendar (Core-Hook `updateWorldTime`, GM-only)

### Features

#### feat: Items
- [x] Laublub Roh (4h, 4 Charges)
- [x] Laublub Simple gefiltert (12h, 12 Charges)
- [x] Laublub Gefiltert (48h, 48 Charges)
- [x] Laublub Destilliert (60h, 60 Charges)
- [x] Stoff (Loot, Rohmaterial)
- [x] Stofffilter (Consumable, Quantity)
- [x] Filter (Tool, unbegrenzt nutzbar)
- [x] Filtermaterial (Consumable, 5 Charges)
- [x] Autarchen-Katalysator (Consumable, 5 Charges, Loot)
- [x] Smelters Edge (Tool, Heil-/Schadenswerkzeug)

#### feat: Consumption
- [ ] Consume-Activity + Consumption Scaling je Laublub-Item (Drink, aktuell nur Beschreibungstext)
- [ ] Gauge-Update-Hook Implementierung (`updateWorldTime`, additiv, Cap 48h, Auto-Verschwendung)
- [ ] Douse-Activity Automatisierung (Terrain-Template, Save, Brand-Trigger)
- [ ] Throw-Activity Automatisierung (Angriffswurf, Öl-Status, Entzünden-Trigger)

#### feat: Gauge
- [x] Gauge-Zustand Schema (`flags.dkg.gaugeValue`, `flags.dkg.lastUpdate`)
- [ ] Gauge-Update-Hook Implementierung
- [ ] Gauge-HUD Rendering + Live-Update
- [ ] HUD-Toggle-Macro (Compendium, `flags.dkg.hudVisible`, GM-only ausführbar)
- [ ] DM-Tool: manuelles Setzen des Füllstands

#### feat: Autarchen-Rasse
- [x] Rasse als Foundry-Content (Delta Kilo Modell (A), komplett neu geschrieben, kein Import)
- [ ] Race-Zuweisung-Hook (setzt `flags.dkg.race` + `flags.dkg.hudVisible` automatisch)
- [x] Heilitem für die Rasse (Smelters Edge, Construct-Mending-Activity)
- [ ] Heilitem-Ziel-Unterscheidung Autarch/Nicht-Autarch (Heilung vs. Schaden)
- n/a Heilspell – entfällt, durch Smelters Edge (Tool) abgedeckt

#### feat: Crafting
- [ ] Mastercrafted-Rezept: Stoff → Stofffilter (1:5)
- [ ] Mastercrafted-Rezept: Stoff + 2 freie Komponenten → Filtermaterial
- [ ] Mastercrafted-Rezept: Roh → Simple (3 Varianten: Stofffilter / Stofffilter+Filter / Filtermaterial+Filter)
- [ ] Mastercrafted-Rezept: Simple → Gefiltert (3 Varianten analog)
- [ ] Mastercrafted-Rezept: Gefiltert → Destilliert (2 Filter + 3 Filtermaterial-Charges + 1 Katalysator-Charge + 4 Coal)

### Fix
- (wird während Entwicklung ergänzt)

### Install
- [ ] Abhängigkeiten geprüft: mastercrafted, simple-timekeeping installiert & aktiv im Test-Foundry

### Test / Review
- [ ] Funktionstest: kompletter Konsum-Zyklus (Kauf → Trinken → Gauge-Update → Alarm)
- [ ] Funktionstest: Crafting-Kette Ende-zu-Ende
- [ ] Funktionstest: Douse (Terrain, Save, Entzünden, Brand-Schaden)
- [ ] Funktionstest: Throw (Angriff, Öl-Status, Abwischen, Entzünden-Bonus)
- [ ] Funktionstest: Smelters Edge (Heilung Autarch, Schaden Nicht-Autarch, Charge-Recovery)
- [ ] Foundry Review Workflow grün (required-files, referenced-files, version-check, version-consistency, secrets-scan)

### Deployment
- [ ] Erster Release (0.1.0) über foundry-release.yml
- [ ] Manifest-Installation im Test-Server (foundry-dev, Port 30001) geprüft