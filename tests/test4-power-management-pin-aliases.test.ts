import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

it("shows power-management aliases on generic numbered pins", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_pmic",
      name: "U1",
      manufacturer_part_number: "TPS62840",
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_mcu",
      name: "U2",
      manufacturer_part_number: "RP2040",
    },
    {
      type: "source_port",
      source_port_id: "source_port_pmic_pgood",
      source_component_id: "source_component_pmic",
      name: "pin14",
      pin_number: 14,
      port_hints: ["pin14", "PGOOD", "PWR_OK"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_enable",
      source_component_id: "source_component_mcu",
      name: "pin2",
      pin_number: 2,
      port_hints: ["pin2", "EN", "WAKE"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_pgood",
      connected_source_port_ids: [
        "source_port_pmic_pgood",
        "source_port_mcu_enable",
      ],
      connected_source_net_ids: [],
    },
  ]

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: TPS62840
     - U2: RP2040

    NET: U1_PGOOD
      - U1 pin14 (PGOOD,PWR_OK)
      - U2 pin2 (EN,WAKE)


    COMPONENT_PINS:
    U1 (TPS62840)
    - pin14(PGOOD, PWR_OK): NETS(U1_PGOOD)

    U2 (RP2040)
    - pin2(EN, WAKE): NETS(U1_PGOOD)
    "
  `)
})
