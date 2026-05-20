import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("test4 should preserve SATCOM modem labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn40"
        manufacturerPartNumber="IRIDIUM9603N"
        pinLabels={{
          pin1: ["IRIDIUM_TX1"],
          pin2: ["IRIDIUM_RX1"],
          pin3: ["ROCKBLOCK_NET1"],
          pin4: ["SWARM_VHF1"],
          pin5: ["ORBCOMM_TX1"],
          pin6: ["SATCOM_WAKE1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />
      <resistor resistance="1k" footprint="0402" name="R4" />
      <resistor resistance="1k" footprint="0402" name="R5" />
      <resistor resistance="1k" footprint="0402" name="R6" />

      <trace from=".U1 .IRIDIUM_TX1" to=".R1 > .pin1" />
      <trace from=".U1 .IRIDIUM_RX1" to=".R2 > .pin1" />
      <trace from=".U1 .ROCKBLOCK_NET1" to=".R3 > .pin1" />
      <trace from=".U1 .SWARM_VHF1" to=".R4 > .pin1" />
      <trace from=".U1 .ORBCOMM_TX1" to=".R5 > .pin1" />
      <trace from=".U1 .SATCOM_WAKE1" to=".R6 > .pin1" />
    </board>,
  )

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  for (const label of [
    "IRIDIUM_TX1",
    "IRIDIUM_RX1",
    "ROCKBLOCK_NET1",
    "SWARM_VHF1",
    "ORBCOMM_TX1",
    "SATCOM_WAKE1",
  ]) {
    expect(readableNetlist).toContain(`NET: U1_${label}`)
    expect(readableNetlist).toContain(`NETS(U1_${label})`)
  }

  expect(readableNetlist).not.toContain("NET: U1_pin")
})
