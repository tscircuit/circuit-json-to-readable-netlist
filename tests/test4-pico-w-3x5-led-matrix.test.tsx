import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"
import { Circuit } from "@tscircuit/core"
import { writeFileSync, mkdirSync } from "fs"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("should handle chip with GP pins and no footprint", async () => {
  const circuit = new Circuit()
  circuit.add(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        manufacturerPartNumber="RP2040"
        schX={0}
        pcbX={0}
        pinLabels={{
          pin1: ["GP0"],
          pin2: ["GP1"],
          pin3: ["GND"],
          pin4: ["RUN"],
        }}
      />
    </board>,
  )

  circuit.render()
  const circuitJson = circuit.getCircuitJson()

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)
  expect(netlist).not.toContain("undefined")
  expect(netlist).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: RP2040


    COMPONENT_PINS:
    U1 (RP2040)
    - pin1(GP0): NOT_CONNECTED
    - pin2(GP1): NOT_CONNECTED
    - pin3(GND): NOT_CONNECTED
    - pin4(RUN): NOT_CONNECTED
    "
  `)

  // Generate SVG snapshots for visual proof
  mkdirSync("tests/__snapshots__", { recursive: true })

  try {
    console.log("Generating PCB SVG...")
    const pcbSvg = await circuit.getSvg({ view: "pcb" })
    console.log("PCB SVG generated, length:", pcbSvg.length)
    writeFileSync("tests/__snapshots__/pico-w-chip-pcb.svg", pcbSvg)
    console.log("PCB SVG snapshot saved successfully")
  } catch (e: any) {
    console.warn("Could not generate PCB SVG:", e.message)
  }

  try {
    console.log("Generating schematic SVG...")
    const schematicSvg = await circuit.getSvg({ view: "schematic" as any })
    console.log("Schematic SVG generated, length:", schematicSvg.length)
    writeFileSync("tests/__snapshots__/pico-w-chip-schematic.svg", schematicSvg)
    console.log("Schematic SVG snapshot saved successfully")
  } catch (e: any) {
    console.warn("Could not generate schematic SVG:", e.message)
  }
})
