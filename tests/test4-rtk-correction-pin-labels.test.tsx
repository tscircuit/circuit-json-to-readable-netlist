import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("preserves RTK correction stream pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="NEO-F9P"
        pinLabels={{
          pin1: ["RTCM_IN1"],
          pin2: ["NTRIP_STATUS1"],
          pin3: ["RTK_FIX1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />
      <resistor resistance="1k" footprint="0402" name="R3" />

      <trace from=".U1 .RTCM_IN1" to=".R1 .pin1" />
      <trace from=".U1 .NTRIP_STATUS1" to=".R2 .pin1" />
      <trace from=".U1 .RTK_FIX1" to=".R3 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_RTCM_IN1")
  expect(netlist).toContain("NET: U1_NTRIP_STATUS1")
  expect(netlist).toContain("NET: U1_RTK_FIX1")
  expect(netlist).toContain("- pin1(RTCM_IN1): NETS(U1_RTCM_IN1)")
  expect(netlist).toContain("- pin2(NTRIP_STATUS1): NETS(U1_NTRIP_STATUS1)")
  expect(netlist).toContain("- pin3(RTK_FIX1): NETS(U1_RTK_FIX1)")
})
