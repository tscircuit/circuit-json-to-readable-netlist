import { expect, it } from "bun:test"
import { getReadableMainPinName } from "lib/getReadableNameForPin"

it("prefers useful pin hints over generic pin names", () => {
  expect(
    getReadableMainPinName(
      {
        type: "source_port",
        source_port_id: "source_port_1",
        source_component_id: "source_component_1",
        name: "pin14",
        pin_number: 14,
        port_hints: ["14", "GPIO16", "UART_RX"],
      },
      { preferPortHints: true },
    ),
  ).toBe("GPIO16")
})
