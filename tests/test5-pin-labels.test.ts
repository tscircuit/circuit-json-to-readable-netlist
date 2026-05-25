import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { getReadableNameForPin } from "lib/getReadableNameForPin"

it("correctly preserves descriptive pin labels containing digits in getReadableNameForPin", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      name: "U1",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["GP14", "pin14"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_0",
      name: "pin3",
      pin_number: 3,
      port_hints: ["GPIO3", "pin3"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_0",
      name: "pin4",
      pin_number: 4,
      port_hints: ["UART_RX0", "pin4"],
    },
  ]

  expect(
    getReadableNameForPin({
      circuitJson,
      source_port_id: "source_port_0",
    }),
  ).toBe("U1 pin14 (GP14)")

  expect(
    getReadableNameForPin({
      circuitJson,
      source_port_id: "source_port_1",
    }),
  ).toBe("U1 pin3 (GPIO3)")

  expect(
    getReadableNameForPin({
      circuitJson,
      source_port_id: "source_port_2",
    }),
  ).toBe("U1 pin4 (UART_RX0)")
})
