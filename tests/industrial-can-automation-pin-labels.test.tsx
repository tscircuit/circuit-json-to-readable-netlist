import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores CANopen DeviceNet and ControlNet pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="qfn32"
        manufacturerPartNumber="INDUSTRIAL-CAN-CTRL"
        pinLabels={{
          pin1: ["pin14", "CANOPEN_SYNC1"],
          pin2: ["pin15", "DEVICENET_CANH1"],
          pin3: ["pin16", "CONTROLNET_A1"],
          pin4: ["pin17", "CIP_SYNC1"],
        }}
      />
      <resistor resistance="120" footprint="0402" name="R1" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .CANOPEN_SYNC1" to=".R1 > .pin1" />
      <trace from=".U1 .DEVICENET_CANH1" to=".R1 > .pin2" />
      <trace from=".U1 .CONTROLNET_A1" to=".C1 > .pin1" />
      <trace from=".U1 .CIP_SYNC1" to=".C1 > .pin2" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_CANOPEN_SYNC1")
  expect(netlist).toContain("  - U1 pin14 (CANOPEN_SYNC1)")
  expect(netlist).toContain(
    "- pin1(pin14, CANOPEN_SYNC1): NETS(U1_CANOPEN_SYNC1)",
  )

  expect(netlist).toContain("NET: U1_DEVICENET_CANH1")
  expect(netlist).toContain("  - U1 pin15 (DEVICENET_CANH1)")

  expect(netlist).toContain("NET: U1_CONTROLNET_A1")
  expect(netlist).toContain("  - U1 pin16 (CONTROLNET_A1)")

  expect(netlist).toContain("NET: U1_CIP_SYNC1")
  expect(netlist).toContain("  - U1 pin17 (CIP_SYNC1)")
  expect(netlist).toContain("- pin4(pin17, CIP_SYNC1): NETS(U1_CIP_SYNC1)")
})
