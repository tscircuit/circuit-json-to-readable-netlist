import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

const renderNamedNetCircuit = () =>
  renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <resistor resistance="1k" footprint="0402" name="R1" />
      <capacitor capacitance="1nF" footprint="0402" name="C1" />
      <trace from=".R1 > .pin1" to="net.VBUS" />
      <trace from=".C1 > .pin1" to="net.VBUS" />
    </board>,
  )

it("trims source net names before rendering readable netlists", () => {
  const circuitJson = renderNamedNetCircuit()
  const sourceNet = circuitJson.find((element) => element.type === "source_net")
  if (!sourceNet || sourceNet.type !== "source_net") {
    throw new Error("expected source_net fixture element")
  }
  sourceNet.name = "  VBUS  "

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - R1: 1kΩ 0402 resistor
     - C1: 1nF 0402 capacitor

    NET: VBUS
      - C1 pin1 (+)
      - R1 pin1


    COMPONENT_PINS:
    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(VBUS)
    - pin2(cathode, neg, right): NOT_CONNECTED

    C1 (1nF 0402)
    - pin1(pos, anode, left): NETS(VBUS)
    - pin2(neg, cathode, right): NOT_CONNECTED
    "
  `)
})

it("ignores blank source net names when generating fallback names", () => {
  const circuitJson = renderNamedNetCircuit()
  const sourceNet = circuitJson.find((element) => element.type === "source_net")
  if (!sourceNet || sourceNet.type !== "source_net") {
    throw new Error("expected source_net fixture element")
  }
  sourceNet.name = "   "

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: C1_pos")
  expect(netlist).toContain("NETS(C1_pos)")
  expect(netlist).not.toContain("NET:    ")
  expect(netlist).not.toContain("NETS(   )")
})
