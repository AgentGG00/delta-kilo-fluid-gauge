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
- Gauge-Logik: additiv mit Cap 48h + Auto-Verschwendung bei Überlauf, kein harter Kauf-Stopp
- Konsum-Menge pro Trinkvorgang: native dnd5e Consumption Scaling (kein Custom-Dialog)
- Delta-Kilo (SC) kann nur Simple gefiltert + Gefiltert trinken – Roh zu unrein, Destilliert zu rein
- Preise sind final festgelegt (siehe projekt-plan.md), Ankauf = halber Verkaufspreis (Hausregel)
- Autarchen-Katalysator: nur kaufbar, keine Loot-Anbindung in diesem Modul – Nebelpirscher-Loot
  kommt erst in einem separaten, späteren Autarchen-Modul
- Autarchen-Rasse wird Teil dieses Moduls, nicht separat ausgelagert
- Kein Alpha/Beta-Status – Modul bleibt durchgängig 0.x.x bis Full Release (1.0.0)

## Nächste Schritte
Siehe `projekt-stand.md`, kritischer Pfad: Items → Consumption → Gauge-Zustand → HUD