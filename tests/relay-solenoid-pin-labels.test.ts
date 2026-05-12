import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves relay and solenoid labels for generic driver pins", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_driver",
      name: "U1",
      manufacturer_part_number: "ULN2003A",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_relay_header",
      name: "J1",
      manufacturer_part_number: "RELAY_HEADER",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_valve_header",
      name: "J2",
      manufacturer_part_number: "VALVE_HEADER",
    },
    {
      type: "source_port",
      source_port_id: "source_port_driver_14",
      source_component_id: "source_component_driver",
      name: "pin14",
      pin_number: 14,
      port_hints: ["RELAY1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_driver_15",
      source_component_id: "source_component_driver",
      name: "pin15",
      pin_number: 15,
      port_hints: ["SOLENOID_A"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_relay_header_1",
      source_component_id: "source_component_relay_header",
      name: "pin1",
      pin_number: 1,
    },
    {
      type: "source_port",
      source_port_id: "source_port_valve_header_1",
      source_component_id: "source_component_valve_header",
      name: "pin1",
      pin_number: 1,
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_relay",
      connected_source_port_ids: [
        "source_port_driver_14",
        "source_port_relay_header_1",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_solenoid",
      connected_source_port_ids: [
        "source_port_driver_15",
        "source_port_valve_header_1",
      ],
      connected_source_net_ids: [],
    },
  ]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: ULN2003A
     - J1: RELAY_HEADER
     - J2: VALVE_HEADER

    NET: U1_RELAY1
      - U1 pin14 (RELAY1)
      - J1 pin1

    NET: U1_SOLENOID_A
      - U1 pin15 (SOLENOID_A)
      - J2 pin1


    COMPONENT_PINS:
    U1 (ULN2003A)
    - pin14(RELAY1): NETS(U1_RELAY1)
    - pin15(SOLENOID_A): NETS(U1_SOLENOID_A)

    J1 (RELAY_HEADER)
    - pin1: NETS(U1_RELAY1)

    J2 (VALVE_HEADER)
    - pin1: NETS(U1_SOLENOID_A)
    "
  `)
})
