# Delta Kilo – Fluid Gauge

[![Build Status](https://img.shields.io/github/actions/workflow/status/AgentGG00/delta-kilo-fluid-gauge/release.yml?label=release)](https://github.com/AgentGG00/delta-kilo-fluid-gauge/actions)
[![Version](https://img.shields.io/github/v/release/AgentGG00/delta-kilo-fluid-gauge)](https://github.com/AgentGG00/delta-kilo-fluid-gauge/releases)
[![Status](https://img.shields.io/badge/status-WIP-yellow)]()
[![License](https://img.shields.io/github/license/AgentGG00/delta-kilo-fluid-gauge)](https://github.com/AgentGG00/delta-kilo-fluid-gauge/blob/main/LICENSE)
[![Foundry Version](https://img.shields.io/badge/Foundry-v14-informational)](https://foundryvtt.com)
[![System](https://img.shields.io/badge/D%26D%205e-2024-red)](https://foundryvtt.com/packages/dnd5e)

A species-specific Foundry VTT module providing a custom fluid gauge HUD for the Delta Kilo Autarchs, with time-based consumption and Mastercrafted-driven crafting integration.

## Features
- Steampunk-style fluid gauge HUD with live time-based drain
- Four oil purity tiers (Roh, Simple gefiltert, Gefiltert, Destilliert) with individual consumption scaling
- Additive gauge with 48h cap and automatic overflow waste
- Low-fill alarm indicator (≤20%)
- Full crafting chain via Mastercrafted (filters, filter material, catalyst)
- Delta Kilo Autarch race as native Foundry content

## Installation
Manifest URL im Foundry-Setup-Screen eintragen:

https://raw.githubusercontent.com/AgentGG00/delta-kilo-fluid-gauge/main/module.json

Benötigt: [Mastercrafted - Crafting Manager](https://foundryvtt.com/packages/mastercrafted/) und [Simple Timekeeping & Calendar](https://foundryvtt.com/packages/simple-timekeeping/)

## License
[MIT](LICENSE)