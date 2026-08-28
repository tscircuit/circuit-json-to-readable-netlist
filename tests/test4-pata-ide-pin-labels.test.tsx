import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("uses legacy PATA and IDE labels as readable net names", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="PATA_IDE_HEADER"
        pinLabels={{
          pin1: ["IDE_CS0"],
          pin2: ["IDE_CS1"],
          pin3: ["ATA_DIOW1"],
          pin4: ["ATA_DIOR1"],
          pin5: ["ATA_IORDY1"],
          pin6: ["ATAPI_DMARQ1"],
        }}
      />
      <resistor name="R1" resistance="1k" footprint="0402" />
      <resistor name="R2" resistance="1k" footprint="0402" />
      <resistor name="R3" resistance="1k" footprint="0402" />
      <resistor name="R4" resistance="1k" footprint="0402" />
      <resistor name="R5" resistance="1k" footprint="0402" />
      <resistor name="R6" resistance="1k" footprint="0402" />

      <trace from=".U1 .IDE_CS0" to=".R1 .pin1" />
      <trace from=".U1 .IDE_CS1" to=".R2 .pin1" />
      <trace from=".U1 .ATA_DIOW1" to=".R3 .pin1" />
      <trace from=".U1 .ATA_DIOR1" to=".R4 .pin1" />
      <trace from=".U1 .ATA_IORDY1" to=".R5 .pin1" />
      <trace from=".U1 .ATAPI_DMARQ1" to=".R6 .pin1" />
    </board>,
  )

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_IDE_CS0")
  expect(netlist).toContain("NET: U1_IDE_CS1")
  expect(netlist).toContain("NET: U1_ATA_DIOW1")
  expect(netlist).toContain("NET: U1_ATA_DIOR1")
  expect(netlist).toContain("NET: U1_ATA_IORDY1")
  expect(netlist).toContain("NET: U1_ATAPI_DMARQ1")
  expect(netlist).toContain("- pin1(IDE_CS0): NETS(U1_IDE_CS0)")
  expect(netlist).toContain("- pin6(ATAPI_DMARQ1): NETS(U1_ATAPI_DMARQ1)")
})
