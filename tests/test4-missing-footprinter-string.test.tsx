import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

const board = (
  <board width="10mm" height="10mm" routingDisabled>
    <resistor resistance="1k" footprint="0402" name="R1" />
    <capacitor capacitance="1nF" footprint="0402" name="C1" />
    <resistor
      resistance="10k"
      name="R2"
      footprint={
        <footprint>
          <smtpad
            portHints={["pin1"]}
            pcbX={-0.5}
            pcbY={0}
            width={0.6}
            height={0.6}
            shape="rect"
          />
          <smtpad
            portHints={["pin2"]}
            pcbX={0.5}
            pcbY={0}
            width={0.6}
            height={0.6}
            shape="rect"
          />
        </footprint>
      }
    />
  </board>
)

it("component pins headers omit a missing footprinter string", () => {
  // `tsci check netlist` renders without a PCB, so there are no cad_components
  const netlistWithoutPcb = convertCircuitJsonToReadableNetlist(
    renderCircuit(board, { pcbDisabled: true }),
  )
  expect(netlistWithoutPcb).not.toContain("undefined")
  expect(netlistWithoutPcb).toMatchInlineSnapshot(`
    "COMPONENTS:
     - R1: 1kΩ resistor
     - C1: 1nF capacitor
     - R2: 10kΩ resistor


    COMPONENT_PINS:
    R1 (1kΩ)
    - pin1(pos, left): NOT_CONNECTED
    - pin2(neg, right): NOT_CONNECTED

    C1 (1nF)
    - pin1(pos, left): NOT_CONNECTED
    - pin2(neg, right): NOT_CONNECTED

    R2 (10kΩ)
    - pin1(pos, left): NOT_CONNECTED
    - pin2(neg, right): NOT_CONNECTED
    "
  `)

  // A custom <footprint> has a cad_component without a footprinter_string
  const netlist = convertCircuitJsonToReadableNetlist(renderCircuit(board))
  expect(netlist).not.toContain("undefined")
  expect(netlist).toMatchInlineSnapshot(`
    "COMPONENTS:
     - R1: 1kΩ 0402 resistor
     - C1: 1nF 0402 capacitor
     - R2: 10kΩ resistor


    COMPONENT_PINS:
    R1 (1kΩ 0402)
    - pin1(pos, left): NOT_CONNECTED
    - pin2(neg, right): NOT_CONNECTED

    C1 (1nF 0402)
    - pin1(pos, left): NOT_CONNECTED
    - pin2(neg, right): NOT_CONNECTED

    R2 (10kΩ)
    - pin1(pos, left): NOT_CONNECTED
    - pin2(neg, right): NOT_CONNECTED
    "
  `)
})
