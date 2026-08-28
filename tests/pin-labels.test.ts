import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("uses full source port labels in component pin listings", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "U1",
      manufacturer_part_number: "RP2040",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      pin_number: 14,
      name: "D13_GPIO4_BOOT_RESET",
      port_hints: ["D13_GPIO4_BOOT_RESET", "BOOT_RESET", "14"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      pin_number: 15,
      name: "D14_GPIO5_STATUS_LED",
      port_hints: ["D14_GPIO5_STATUS_LED", "STATUS_LED", "15"],
    },
    {
      type: "cad_component",
      cad_component_id: "cad_component_1",
      pcb_component_id: "pcb_component_1",
      source_component_id: "source_component_1",
      footprinter_string: "soic16",
      position: { x: 0, y: 0, z: 0 },
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_2"],
      connected_source_net_ids: [],
    },
  ]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: RP2040, soic16

    NET: U1_BOOT_RESET
      - U1 D13_GPIO4_BOOT_RESET
      - U1 D14_GPIO5_STATUS_LED


    COMPONENT_PINS:
    U1 (RP2040)
    - D13_GPIO4_BOOT_RESET(pin14, BOOT_RESET): NETS(U1_BOOT_RESET)
    - D14_GPIO5_STATUS_LED(pin15, STATUS_LED): NETS(U1_BOOT_RESET)
    "
  `)
})
