import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores numbered QSPI flash and PSRAM pin labels", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="W25Q128"
        pinLabels={{
          pin1: ["QSPI_IO0"],
          pin2: ["QSPI_IO1"],
          pin3: ["FLASH_WP2"],
          pin4: ["PSRAM_DQ3"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />
      <capacitor capacitance="100nF" footprint="0402" name="C1" />

      <trace from=".U1 .QSPI_IO0" to=".R1 > .pin1" />
      <trace from=".U1 .QSPI_IO1" to=".R1 > .pin2" />
      <trace from=".U1 .PSRAM_DQ3" to=".C1 > .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_QSPI_IO0")
  expect(netlist).toContain("NET: U1_QSPI_IO1")
  expect(netlist).toContain("NET: U1_PSRAM_DQ3")
  expect(netlist).toContain("- pin1(QSPI_IO0): NETS(U1_QSPI_IO0)")
  expect(netlist).toContain("- pin2(QSPI_IO1): NETS(U1_QSPI_IO1)")
  expect(netlist).toContain("- pin4(PSRAM_DQ3): NETS(U1_PSRAM_DQ3)")
})
