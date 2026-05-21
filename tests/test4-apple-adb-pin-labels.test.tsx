import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("uses Apple Desktop Bus labels as readable net names", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="MAC_ADB_CONTROLLER"
        pinLabels={{
          pin1: ["ADB_DATA1"],
          pin2: ["ADB_PWR1"],
          pin3: ["ADB_RESET1"],
          pin4: ["ADB_ATTENTION1"],
          pin5: ["MAC_ADB_DATA1"],
          pin6: ["APPLE_DESKTOP_BUS1"],
        }}
      />
      <resistor name="R1" resistance="1k" footprint="0402" />
      <resistor name="R2" resistance="1k" footprint="0402" />
      <resistor name="R3" resistance="1k" footprint="0402" />
      <resistor name="R4" resistance="1k" footprint="0402" />
      <resistor name="R5" resistance="1k" footprint="0402" />
      <resistor name="R6" resistance="1k" footprint="0402" />

      <trace from=".U1 .ADB_DATA1" to=".R1 .pin1" />
      <trace from=".U1 .ADB_PWR1" to=".R2 .pin1" />
      <trace from=".U1 .ADB_RESET1" to=".R3 .pin1" />
      <trace from=".U1 .ADB_ATTENTION1" to=".R4 .pin1" />
      <trace from=".U1 .MAC_ADB_DATA1" to=".R5 .pin1" />
      <trace from=".U1 .APPLE_DESKTOP_BUS1" to=".R6 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_ADB_DATA1")
  expect(netlist).toContain("NET: U1_ADB_PWR1")
  expect(netlist).toContain("NET: U1_ADB_RESET1")
  expect(netlist).toContain("NET: U1_ADB_ATTENTION1")
  expect(netlist).toContain("NET: U1_MAC_ADB_DATA1")
  expect(netlist).toContain("NET: U1_APPLE_DESKTOP_BUS1")
  expect(netlist).toContain("- pin1(ADB_DATA1): NETS(U1_ADB_DATA1)")
  expect(netlist).toContain(
    "- pin6(APPLE_DESKTOP_BUS1): NETS(U1_APPLE_DESKTOP_BUS1)",
  )
})
