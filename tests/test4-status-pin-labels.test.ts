import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"

it("shows interrupt and status aliases on generic chip pins", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "chip1",
      name: "U1",
      manufacturer_part_number: "STATUS-MCU",
    } as any,
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "io1",
      name: "J1",
      manufacturer_part_number: "STATUS-HEADER",
    } as any,
    {
      type: "source_port",
      source_port_id: "source_port_chip1_irq",
      source_component_id: "chip1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["IRQ", "ALERT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_chip1_ready",
      source_component_id: "chip1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["READY", "BUSY"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_io1_pin1",
      source_component_id: "io1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["IO1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_io1_pin2",
      source_component_id: "io1",
      name: "pin2",
      pin_number: 2,
      port_hints: ["IO2"],
    },
    {
      type: "source_trace",
      source_trace_id: "trace1",
      connected_source_port_ids: [
        "source_port_chip1_irq",
        "source_port_io1_pin1",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "trace2",
      connected_source_port_ids: [
        "source_port_chip1_ready",
        "source_port_io1_pin2",
      ],
      connected_source_net_ids: [],
    },
  ]

  expect(scorePhrase("IRQ")).toBeGreaterThan(1)
  expect(scorePhrase("READY")).toBeGreaterThan(1)
  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: STATUS-MCU
     - J1: STATUS-HEADER

    NET: U1_IRQ
      - U1 pin14 (IRQ,ALERT)
      - J1 pin1

    NET: U1_READY
      - U1 pin15 (READY,BUSY)
      - J1 pin2


    COMPONENT_PINS:
    U1 (STATUS-MCU)
    - pin14(IRQ, ALERT): NETS(U1_IRQ)
    - pin15(READY, BUSY): NETS(U1_READY)

    J1 (STATUS-HEADER)
    - pin1(IO1): NETS(U1_IRQ)
    - pin2(IO2): NETS(U1_READY)
    "
  `)
})
