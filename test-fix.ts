import { convertCircuitJsonToReadableNetlist } from './lib/index.js'
import { Circuit } from '@tscircuit/core'

const circuit = new Circuit()
circuit.add(
  <board width="10mm" height="10mm">
    <chip name="U1" footprint="sot23" pinLabels={{1: 'GND', 2: 'VCC', 3: 'GPIO14', 4: 'SDA', 5: 'SCL', 6: 'TX', 7: 'RX', 8: 'MISO'}} />
    <resistor name="R1" resistance="10k" footprint="0402" />
    <trace from=".U1 .GPIO14" to=".R1 .pin1" />
  </board>
)
circuit.render()
const json = circuit.getCircuitJson()

// Show what ports look like
const ports = json.filter((e: any) => e.type === 'source_port')
console.log('=== Ports sample ===')
ports.slice(0, 4).forEach((p: any) => console.log(JSON.stringify(p, null, 2)))

console.log('\n=== NETLIST ===')
console.log(convertCircuitJsonToReadableNetlist(json))
