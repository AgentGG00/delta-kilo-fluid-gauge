## Checklist

### Init
- [ ] Repo-Grundgerüst (module.json, LICENSE-Autor auf Pseudonym anpassen, docs/-Struktur)
- [ ] module.json Grunddaten (id, title, description, compatibility, relationships)

### Backend
- n/a – reines Client-seitiges Foundry-Modul, kein Backend

### Frontend
- [ ] Gauge-HUD Grundgerüst (ApplicationV2)
- [ ] Steampunk-Röhrchen-CSS/Optik
- [ ] Alarm-Lämpchen (Blink bei ≤20%)

### Framework
- [ ] Actor-Flags Schema (`flags.dkg.*`) definieren
- [ ] Hook-Anbindung Simple Timekeeping & Calendar

### Features

#### feat: Items
- [ ] Laublub Roh (4h, 4 Charges)
- [ ] Laublub Simple gefiltert (12h, 12 Charges)
- [ ] Laublub Gefiltert (48h, 48 Charges)
- [ ] Laublub Destilliert (60h, 60 Charges)
- [ ] Stofffilter
- [ ] Filter
- [ ] Filtermaterial
- [ ] Autarchen-Katalysator

#### feat: Consumption
- [ ] Consume-Activity + Consumption Scaling je Laublub-Item
- [ ] Gauge-Update-Hook (additiv, Cap 48h, Auto-Verschwendung)
- [ ] Verschmieren-Activity (1 Charge)
- [ ] Ausschütten-Activity (1 Charge, Fallen-Mechanik)

#### feat: Gauge
- [ ] Gauge-Zustand (Actor-Flag)
- [ ] Gauge-HUD Rendering + Live-Update
- [ ] DM-Tool: manuelles Setzen des Füllstands

#### feat: Autarchen-Rasse
- [ ] Rasse als Foundry-Content (Legacy/Warforged-Basis)
- [ ] Rassenfeature-Button (Gauge ein-/ausblenden)
- [ ] Heilitem für die Rasse
- [ ] Heilspell für die Rasse

#### feat: Crafting
- [ ] Mastercrafted-Rezept: Stofffilter
- [ ] Mastercrafted-Rezept: Filter
- [ ] Mastercrafted-Rezept: Filtermaterial
- [ ] Mastercrafted-Rezept: Simple gefiltert (aus Roh + Stofffilter)
- [ ] Mastercrafted-Rezept: Gefiltert (aus Simple gefiltert + Filter/Filtermaterial + Katalysator)
- [ ] Mastercrafted-Rezept: Destilliert (aus Gefiltert + Katalysator)

### Fix
- (wird während Entwicklung ergänzt)

### Install
- [ ] Abhängigkeiten geprüft: mastercrafted, simple-timekeeping, simple-calendar installiert & aktiv im Test-Foundry

### Test / Review
- [ ] Funktionstest: kompletter Konsum-Zyklus (Kauf → Trinken → Gauge-Update → Alarm)
- [ ] Funktionstest: Crafting-Kette Ende-zu-Ende
- [ ] Foundry Review Workflow grün (required-files, referenced-files, version-check, version-consistency, secrets-scan)

### Deployment
- [ ] Erster Release (0.1.0) über foundry-release.yml
- [ ] Manifest-Installation im Test-Server (foundry-dev, Port 30001) geprüft## Checklist

### Init
- [ ] Repo-Grundgerüst (module.json, LICENSE-Autor auf Pseudonym anpassen, docs/-Struktur)
- [ ] module.json Grunddaten (id, title, description, compatibility, relationships)

### Backend
- n/a – reines Client-seitiges Foundry-Modul, kein Backend

### Frontend
- [ ] Gauge-HUD Grundgerüst (ApplicationV2)
- [ ] Steampunk-Röhrchen-CSS/Optik
- [ ] Alarm-Lämpchen (Blink bei ≤20%)

### Framework
- [ ] Actor-Flags Schema (`flags.dkg.*`) definieren
- [ ] Hook-Anbindung Simple Timekeeping & Calendar

### Features

#### feat: Items
- [ ] Laublub Roh (4h, 4 Charges)
- [ ] Laublub Simple gefiltert (12h, 12 Charges)
- [ ] Laublub Gefiltert (48h, 48 Charges)
- [ ] Laublub Destilliert (60h, 60 Charges)
- [ ] Stofffilter
- [ ] Filter
- [ ] Filtermaterial
- [ ] Autarchen-Katalysator

#### feat: Consumption
- [ ] Consume-Activity + Consumption Scaling je Laublub-Item
- [ ] Gauge-Update-Hook (additiv, Cap 48h, Auto-Verschwendung)
- [ ] Verschmieren-Activity (1 Charge)
- [ ] Ausschütten-Activity (1 Charge, Fallen-Mechanik)

#### feat: Gauge
- [ ] Gauge-Zustand (Actor-Flag)
- [ ] Gauge-HUD Rendering + Live-Update
- [ ] DM-Tool: manuelles Setzen des Füllstands

#### feat: Autarchen-Rasse
- [ ] Rasse als Foundry-Content (Legacy/Warforged-Basis)
- [ ] Rassenfeature-Button (Gauge ein-/ausblenden)
- [ ] Heilitem für die Rasse
- [ ] Heilspell für die Rasse

#### feat: Crafting
- [ ] Mastercrafted-Rezept: Stofffilter
- [ ] Mastercrafted-Rezept: Filter
- [ ] Mastercrafted-Rezept: Filtermaterial
- [ ] Mastercrafted-Rezept: Simple gefiltert (aus Roh + Stofffilter)
- [ ] Mastercrafted-Rezept: Gefiltert (aus Simple gefiltert + Filter/Filtermaterial + Katalysator)
- [ ] Mastercrafted-Rezept: Destilliert (aus Gefiltert + Katalysator)

### Fix
- (wird während Entwicklung ergänzt)

### Install
- [ ] Abhängigkeiten geprüft: mastercrafted, simple-timekeeping, simple-calendar installiert & aktiv im Test-Foundry

### Test / Review
- [ ] Funktionstest: kompletter Konsum-Zyklus (Kauf → Trinken → Gauge-Update → Alarm)
- [ ] Funktionstest: Crafting-Kette Ende-zu-Ende
- [ ] Foundry Review Workflow grün (required-files, referenced-files, version-check, version-consistency, secrets-scan)

### Deployment
- [ ] Erster Release (0.1.0) über foundry-release.yml
- [ ] Manifest-Installation im Test-Server (foundry-dev, Port 30001) geprüft