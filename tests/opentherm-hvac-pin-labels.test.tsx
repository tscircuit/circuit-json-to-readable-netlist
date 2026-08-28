import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores OpenTherm and HVAC thermostat pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="HVAC-CTRL"
        pinLabels={{
          pin1: ["pin14", "OPENTHERM_BUS1"],
          pin2: ["pin15", "THERMOSTAT_W1"],
          pin3: ["pin16", "BOILER_CALL1"],
        }}
      />
      <resistor resistance="4.7k" footprint="0402" name="R1" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .OPENTHERM_BUS1" to=".R1 > .pin1" />
      <trace from=".U1 .THERMOSTAT_W1" to=".R1 > .pin2" />
      <trace from=".U1 .BOILER_CALL1" to=".C1 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_OPENTHERM_BUS1")
  expect(netlist).toContain("  - U1 pin14 (OPENTHERM_BUS1)")
  expect(netlist).toContain(
    "- pin1(pin14, OPENTHERM_BUS1): NETS(U1_OPENTHERM_BUS1)",
  )

  expect(netlist).toContain("NET: U1_THERMOSTAT_W1")
  expect(netlist).toContain("  - U1 pin15 (THERMOSTAT_W1)")

  expect(netlist).toContain("NET: U1_BOILER_CALL1")
  expect(netlist).toContain("  - U1 pin16 (BOILER_CALL1)")
  expect(netlist).toContain(
    "- pin3(pin16, BOILER_CALL1): NETS(U1_BOILER_CALL1)",
  )
})
