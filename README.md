# circuit-json-to-readable-netlist

Convert Circuit JSON into a readable netlist suitable for input to AI

[![npm version](https://badge.fury.io/js/circuit-json-to-readable-netlist.svg)](https://badge.fury.io/js/circuit-json-to-readable-netlist) [![GitHub](https://img.shields.io/github/stars/tscircuit/circuit-json-to-readable-netlist?style=social)](https://github.com/tscircuit/circuit-json-to-readable-netlist) ⋅ [tscircuit](https://github.com/tscircuit/tscircuit) ⋅ [discord](https://tscircuit.com/join) ⋅ [use tscircuit online](https://tscircuit.com)

## Installation

```bash
bun add circuit-json-to-readable-netlist
```

## Usage

### TypeScript

```typescript
import { convertCircuitJsonToReadableNetlist } from 'circuit-json-to-readable-netlist'
import type { CircuitJson } from 'circuit-json'

const circuitJson: CircuitJson = // ... your circuit JSON
const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)
console.log(readableNetlist)
```

## Example Readable Netlist

```txt
NET: +3V3
  - U1 Pin8            (ESP-12F VDD3.3)
  - R1 Pin1            (Pull-up for RST)
  - R2 Pin1            (Pull-up for EN)
  - R3 Pin1            (Pull-up for GPIO0)
  - R4 Pin1            (Pull-up for GPIO2)
  - C1 Pin1            (Decoupling 10 µF)
  - C2 Pin1            (Decoupling 0.1 µF)

NET: GND
  - U1 Pin9            (ESP-12F GND)
  - C1 Pin2            (Decoupling return)
  - C2 Pin2            (Decoupling return)
  - S1 Pin2            (Reset switch to ground)
  - R5 Pin2            (Pull-down for GPIO15)
  - J1 Pin1            (UART header ground, if applicable)

NET: RST
  - U1 Pin1            (ESP-12F RST)
  - R1 Pin2            (10 kΩ to +3V3)
  - S1 Pin1            (Momentary switch to GND)

NET: EN
  - U1 Pin3            (ESP-12F EN / CH_PD)
  - R2 Pin2            (10 kΩ to +3V3)

NET: GPIO0
  - U1 Pin12           (GPIO0 / boot mode select)
  - R3 Pin2            (10 kΩ to +3V3)
  - S2 Pin1            (Optional switch/jumper to GND for flashing)
```
