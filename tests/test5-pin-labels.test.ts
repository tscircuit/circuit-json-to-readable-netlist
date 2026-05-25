import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { getReadableNameForPin } from "lib/getReadableNameForPin"

it("promotes descriptive hint over generic pin<N> name in getReadableNameForPin", () => {
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
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_0",
      name: "pin6",
      pin_number: 6,
      port_hints: ["GPIO1_RX", "pin6"],
    },
  ] as any[]

  // When port.name is "pin14" and best hint is "GP14" (score 0.5 after fix — digit),
  // the descriptive hint is still better than a generic pin number placeholder
  expect(
    getReadableNameForPin({
      circuitJson,
      source_port_id: "source_port_0",
    }),
  ).toBe("U1 GP14")

  // GPIO3 scores 1.1 (GPIO match) — clearly better
  expect(
    getReadableNameForPin({
      circuitJson,
      source_port_id: "source_port_1",
    }),
  ).toBe("U1 GPIO3")

  // UART_RX0 scores 1.15 (RX match after scorePhrase fix) — clearly better
  expect(
    getReadableNameForPin({
      circuitJson,
      source_port_id: "source_port_2",
    }),
  ).toBe("U1 UART_RX0")

  // GPIO1_RX: scores 1.15 (RX match) after scorePhrase fix — promoted
  expect(
    getReadableNameForPin({
      circuitJson,
      source_port_id: "source_port_3",
    }),
  ).toBe("U1 GPIO1_RX")
})
