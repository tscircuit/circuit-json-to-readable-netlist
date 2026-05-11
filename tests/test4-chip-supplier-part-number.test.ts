import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("uses supplier part number when chip manufacturer part number is missing", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_0",
      name: "U1",
      supplier_part_numbers: {
        jlcpcb: ["C12345"],
      },
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_0",
      source_component_id: "source_component_0",
      footprinter_string: "soic8",
    },
  ] as any

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain(" - U1: jlcpcb: C12345, soic8")
  expect(netlist).toContain("U1 (jlcpcb: C12345)")
  expect(netlist).not.toContain("undefined")
})
