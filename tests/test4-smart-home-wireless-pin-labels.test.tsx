import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores smart-home wireless module pin labels over passive aliases", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn32"
        manufacturerPartNumber="SMART-HOME-MOD"
        pinLabels={{
          pin1: ["GPIO1", "ZWAVE_DIO0"],
          pin2: ["GPIO2", "Z_WAVE_IRQ1"],
          pin3: ["GPIO3", "THREAD_MESH_RX0"],
          pin4: ["GPIO4", "MATTER_COMMISSION_TX1"],
          pin5: ["GPIO5", "ENOCEAN_WAKE0"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <resistor resistance="10k" footprint="0402" name="R2" />
      <resistor resistance="10k" footprint="0402" name="R3" />
      <resistor resistance="10k" footprint="0402" name="R4" />
      <resistor resistance="10k" footprint="0402" name="R5" />

      <trace from=".U1 .GPIO1" to=".R1 .pin1" />
      <trace from=".U1 .GPIO2" to=".R2 .pin1" />
      <trace from=".U1 .GPIO3" to=".R3 .pin1" />
      <trace from=".U1 .GPIO4" to=".R4 .pin1" />
      <trace from=".U1 .GPIO5" to=".R5 .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_ZWAVE_DIO0")
  expect(readableNetlist).toContain("NET: U1_Z_WAVE_IRQ1")
  expect(readableNetlist).toContain("NET: U1_THREAD_MESH_RX0")
  expect(readableNetlist).toContain("NET: U1_MATTER_COMMISSION_TX1")
  expect(readableNetlist).toContain("NET: U1_ENOCEAN_WAKE0")
  expect(readableNetlist).toContain("U1 GPIO1 (ZWAVE_DIO0)")
  expect(readableNetlist).toContain("U1 GPIO5 (ENOCEAN_WAKE0)")
})
