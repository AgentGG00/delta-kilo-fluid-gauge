# Delta Kilo Fluid Gauge – Projekt-Plan

## Projektname & Kurzbeschreibung
Foundry-VTT-Modul für die Horizon-Kampagne (D&D 5e '24 Homebrew, Foundry v14, dnd5e 5.3.3).
Bildet die Laublub-Abhängigkeit der Autarchen-Rasse ab: Steampunk-Wasserstandsröhrchen-HUD
mit zeitbasiertem Verbrauch, Crafting-Kette über Mastercrafted, sowie die Autarchen-Rasse
selbst als eigener Foundry-Content statt D&D-Beyond-Import.

## Ziele & Anforderungen

### Core Features
- Gauge-HUD (Wasserstandsröhrchen-Optik), Füllstand sinkt mit Ingame-Zeit
- Cap 48h, additiv mit Auto-Verschwendung bei Überlauf
- Alarm-Lämpchen bei ≤20% Füllstand, rein optisch
- DM-Tool zum manuellen Setzen des Füllstands
- Laublub-Items in 4 Reinheitsstufen (Roh 4h / Simple gefiltert 12h / Gefiltert 48h / Destilliert 60h)
- Consumption Scaling für Teilverbrauch pro Trinkvorgang
- Delta-Kilo-Konsum-Restriktion (nur Simple gefiltert + Gefiltert)
- Filter-Items: Stofffilter, Filter, Filtermaterial
- Autarchen-Katalysator (nur kaufbar, 200–400 Platin)
- Crafting-Rezepte über Mastercrafted für alle Filter-/Laublub-Stufen
- Activities: Konsumieren, Verschmieren, Ausschütten
- Autarchen-Rasse als Foundry-Content (Legacy-Variante, Warforged-Basis)
- Rassenfeature-Button (Gauge ein-/ausblenden)
- Heilitem + Heilspell speziell für diese Rasse

### Nice-to-have (Phase 4)
- Mechanischer Alarm-Impact (Debuff/Bewegungseinschränkung bei niedrigem Stand)
- Weiterer Autarchen-Content (Nebelpirscher etc.) – eigenes späteres Modul

## Tech-Stack
| Bereich | Wahl |
|---|---|
| Sprache | Vanilla JS (ESModules) |
| UI | Foundry ApplicationV2 + eigenes CSS |
| Datenhaltung | Actor-Flags (`flags.dkg.*`) |
| Compendium | `.pack-sources/` + `foundryvtt-cli` |
| Abhängigkeiten | mastercrafted, simple-timekeeping, simple-calendar (theripper93, Premium) |
| CI/CD | GitHub Actions (Reusable Workflows aus `AgentGG00/workflows`) |

## Grobe Projektstruktur
```
delta-kilo-fluid-gauge/
├── .github/workflows/       (release.yml, review.yml, version-bump.yml – Caller)
├── .pack-sources/           (Compendium-Rohdaten)
├── assets/
├── data/
├── docs/
├── scripts/
├── module.json
├── .gitignore
├── LICENSE
└── README.md
```

## Rahmenbedingungen
- Hosting: eigener VPS (Contabo), Repo-Pfad Server: `/foundry/vtt-dev/docs/Data/modules/delta-kilo-fluid-gauge`
- Foundry: v14, System dnd5e 5.3.3
- Entwicklung: Devcontainer via VS Code Remote-SSH (nicht GitHub Codespaces Cloud)
- Repo-Sichtbarkeit: öffentlich, GitHub Org `AgentGG00`
- Branch-Strategie: `main` (Release) + `dev` (Version-Bump)

## Secrets-Übersicht
Keine projektspezifischen Secrets. Nutzt Org-weite GitHub Actions Secrets via `secrets: inherit`
(PAT für Release-Workflow bereits auf Org-Ebene hinterlegt).