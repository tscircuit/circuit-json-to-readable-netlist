import { expect, it } from "bun:test"
import type { SourcePort } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

const addPortHint = (
  circuitJson: ReturnType<typeof renderCircuit>,
  componentId: string,
  pinNumber: number,
  hint: string,
) => {
  const port = circuitJson.find(
    (element): element is SourcePort =>
      element.type === "source_port" &&
      element.source_component_id === componentId &&
      element.pin_number === pinNumber,
  )
  if (!port) throw new Error(`Missing ${componentId} pin ${pinNumber}`)
  port.port_hints = [...(port.port_hints ?? []), hint]
}

it("preserves LVDS and eDP panel-link aliases in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="PANEL_BRIDGE"
      />
      <chip
        name="J1"
        footprint="pinrow5"
        manufacturerPartNumber="DISPLAY_CONN"
      />

      <trace from=".U1 .pin1" to=".J1 .pin1" />
      <trace from=".U1 .pin2" to=".J1 .pin2" />
      <trace from=".U1 .pin3" to=".J1 .pin3" />
      <trace from=".U1 .pin4" to=".J1 .pin4" />
      <trace from=".U1 .pin5" to=".J1 .pin5" />
    </board>,
  )

  addPortHint(circuitJson, "source_component_0", 1, "LVDS0_P")
  addPortHint(circuitJson, "source_component_0", 2, "LVDS0_N")
  addPortHint(circuitJson, "source_component_0", 3, "LVDS_CLK_P")
  addPortHint(circuitJson, "source_component_0", 4, "EDP_AUX_P")
  addPortHint(circuitJson, "source_component_0", 5, "EDP_HPD")
  addPortHint(circuitJson, "source_component_1", 1, "CONN_LVDS0_P")
  addPortHint(circuitJson, "source_component_1", 2, "CONN_LVDS0_N")
  addPortHint(circuitJson, "source_component_1", 3, "CONN_LVDS_CLK_P")
  addPortHint(circuitJson, "source_component_1", 4, "CONN_EDP_AUX_P")
  addPortHint(circuitJson, "source_component_1", 5, "CONN_EDP_HPD")

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_LVDS0_P")
  expect(readableNetlist).toContain("  - U1 pin1 (LVDS0_P)")
  expect(readableNetlist).toContain("NET: U1_LVDS_CLK_P")
  expect(readableNetlist).toContain("  - U1 pin3 (LVDS_CLK_P)")
  expect(readableNetlist).toContain("NET: U1_EDP_AUX_P")
  expect(readableNetlist).toContain("  - U1 pin4 (EDP_AUX_P)")
  expect(readableNetlist).toContain("NET: U1_EDP_HPD")
  expect(readableNetlist).toContain("  - U1 pin5 (EDP_HPD)")
})
