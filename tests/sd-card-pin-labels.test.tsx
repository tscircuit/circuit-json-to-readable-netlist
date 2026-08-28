import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("keeps digit-bearing SD card aliases for generic data pins", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="RP2040"
        pinLabels={{
          pin14: ["D0", "SDIO_D0"],
          pin15: ["CLK", "SDMMC_CK"],
        }}
      />
      <chip
        name="J1"
        footprint="soic8"
        manufacturerPartNumber="MICROSD_SOCKET"
        pinLabels={{
          pin1: ["pin1", "DAT0"],
          pin3: ["pin3", "CLK"],
        }}
      />
      <resistor resistance="10k" footprint="0402" name="R1" />

      <trace from=".U1 .D0" to=".J1 .DAT0" />
      <trace from=".U1 .CLK" to=".J1 .CLK" />
      <trace from=".J1 .pin1" to=".R1 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_SDIO_D0")
  expect(netlist).toContain("NET: U1_SDMMC_CK")
  expect(netlist).toContain("U1 D0 (SDIO_D0)")
  expect(netlist).toContain("U1 CLK (SDMMC_CK)")
  expect(netlist).toContain("J1 pin1 (DAT0)")
})
