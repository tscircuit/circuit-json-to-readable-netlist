import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("keeps MIPI CSI and DSI lane hints for generic chip pin labels", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_0",
      name: "U1",
      manufacturer_part_number: "CAM_IFACE",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["CSI_D0P"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_0",
      name: "pin15",
      pin_number: 15,
      port_hints: ["DSI_CLKP"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_0",
      name: "pin16",
      pin_number: 16,
      port_hints: ["CSI_D1N"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_0",
      name: "pin17",
      pin_number: 17,
      port_hints: ["DSI_CLKN"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_8",
      source_component_id: "source_component_0",
      name: "pin18",
      pin_number: 18,
      port_hints: ["MIPI_CSI0_D0_P"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_9",
      source_component_id: "source_component_0",
      name: "pin19",
      pin_number: 19,
      port_hints: ["MIPI_DSI0_CLK_N"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_12",
      source_component_id: "source_component_0",
      name: "pin20",
      pin_number: 20,
      port_hints: ["MIPI-CSI1-D2-P"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_13",
      source_component_id: "source_component_0",
      name: "pin21",
      pin_number: 21,
      port_hints: ["MIPI-DSI1-CLK-P"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_16",
      source_component_id: "source_component_0",
      name: "pin22",
      pin_number: 22,
      port_hints: ["CSI_CKP"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_17",
      source_component_id: "source_component_0",
      name: "pin23",
      pin_number: 23,
      port_hints: ["MIPI_DSI2_CK_N"],
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_4",
      name: "J1",
      manufacturer_part_number: "FPC_CAMERA_DISPLAY",
    },
    {
      type: "source_port",
      source_port_id: "source_port_4",
      source_component_id: "source_component_4",
      name: "pin1",
      pin_number: 1,
      port_hints: ["CSI_D0P"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_5",
      source_component_id: "source_component_4",
      name: "pin2",
      pin_number: 2,
      port_hints: ["DSI_CLKP"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_6",
      source_component_id: "source_component_4",
      name: "pin3",
      pin_number: 3,
      port_hints: ["CSI_D1N"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_7",
      source_component_id: "source_component_4",
      name: "pin4",
      pin_number: 4,
      port_hints: ["DSI_CLKN"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_10",
      source_component_id: "source_component_4",
      name: "pin5",
      pin_number: 5,
      port_hints: ["MIPI_CSI0_D0_P"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_11",
      source_component_id: "source_component_4",
      name: "pin6",
      pin_number: 6,
      port_hints: ["MIPI_DSI0_CLK_N"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_14",
      source_component_id: "source_component_4",
      name: "pin7",
      pin_number: 7,
      port_hints: ["MIPI-CSI1-D2-P"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_15",
      source_component_id: "source_component_4",
      name: "pin8",
      pin_number: 8,
      port_hints: ["MIPI-DSI1-CLK-P"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_18",
      source_component_id: "source_component_4",
      name: "pin9",
      pin_number: 9,
      port_hints: ["CSI_CKP"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_19",
      source_component_id: "source_component_4",
      name: "pin10",
      pin_number: 10,
      port_hints: ["MIPI_DSI2_CK_N"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_0", "source_port_4"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_5"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_2",
      connected_source_port_ids: ["source_port_2", "source_port_6"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_3",
      connected_source_port_ids: ["source_port_3", "source_port_7"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_4",
      connected_source_port_ids: ["source_port_8", "source_port_10"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_5",
      connected_source_port_ids: ["source_port_9", "source_port_11"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_6",
      connected_source_port_ids: ["source_port_12", "source_port_14"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_7",
      connected_source_port_ids: ["source_port_13", "source_port_15"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_8",
      connected_source_port_ids: ["source_port_16", "source_port_18"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_9",
      connected_source_port_ids: ["source_port_17", "source_port_19"],
      connected_source_net_ids: [],
    },
  ] as any

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: CAM_IFACE
     - J1: FPC_CAMERA_DISPLAY

    NET: U1_CSI_D0P
      - U1 pin14 (CSI_D0P)
      - J1 pin1 (CSI_D0P)

    NET: U1_DSI_CLKP
      - U1 pin15 (DSI_CLKP)
      - J1 pin2 (DSI_CLKP)

    NET: U1_CSI_D1N
      - U1 pin16 (CSI_D1N)
      - J1 pin3 (CSI_D1N)

    NET: U1_DSI_CLKN
      - U1 pin17 (DSI_CLKN)
      - J1 pin4 (DSI_CLKN)

    NET: U1_MIPI_CSI0_D0_P
      - U1 pin18 (MIPI_CSI0_D0_P)
      - J1 pin5 (MIPI_CSI0_D0_P)

    NET: U1_MIPI_DSI0_CLK_N
      - U1 pin19 (MIPI_DSI0_CLK_N)
      - J1 pin6 (MIPI_DSI0_CLK_N)

    NET: U1_MIPI-CSI1-D2-P
      - U1 pin20 (MIPI-CSI1-D2-P)
      - J1 pin7 (MIPI-CSI1-D2-P)

    NET: U1_MIPI-DSI1-CLK-P
      - U1 pin21 (MIPI-DSI1-CLK-P)
      - J1 pin8 (MIPI-DSI1-CLK-P)

    NET: U1_CSI_CKP
      - U1 pin22 (CSI_CKP)
      - J1 pin9 (CSI_CKP)

    NET: U1_MIPI_DSI2_CK_N
      - U1 pin23 (MIPI_DSI2_CK_N)
      - J1 pin10 (MIPI_DSI2_CK_N)


    COMPONENT_PINS:
    U1 (CAM_IFACE)
    - pin14(CSI_D0P): NETS(U1_CSI_D0P)
    - pin15(DSI_CLKP): NETS(U1_DSI_CLKP)
    - pin16(CSI_D1N): NETS(U1_CSI_D1N)
    - pin17(DSI_CLKN): NETS(U1_DSI_CLKN)
    - pin18(MIPI_CSI0_D0_P): NETS(U1_MIPI_CSI0_D0_P)
    - pin19(MIPI_DSI0_CLK_N): NETS(U1_MIPI_DSI0_CLK_N)
    - pin20(MIPI-CSI1-D2-P): NETS(U1_MIPI-CSI1-D2-P)
    - pin21(MIPI-DSI1-CLK-P): NETS(U1_MIPI-DSI1-CLK-P)
    - pin22(CSI_CKP): NETS(U1_CSI_CKP)
    - pin23(MIPI_DSI2_CK_N): NETS(U1_MIPI_DSI2_CK_N)

    J1 (FPC_CAMERA_DISPLAY)
    - pin1(CSI_D0P): NETS(U1_CSI_D0P)
    - pin2(DSI_CLKP): NETS(U1_DSI_CLKP)
    - pin3(CSI_D1N): NETS(U1_CSI_D1N)
    - pin4(DSI_CLKN): NETS(U1_DSI_CLKN)
    - pin5(MIPI_CSI0_D0_P): NETS(U1_MIPI_CSI0_D0_P)
    - pin6(MIPI_DSI0_CLK_N): NETS(U1_MIPI_DSI0_CLK_N)
    - pin7(MIPI-CSI1-D2-P): NETS(U1_MIPI-CSI1-D2-P)
    - pin8(MIPI-DSI1-CLK-P): NETS(U1_MIPI-DSI1-CLK-P)
    - pin9(CSI_CKP): NETS(U1_CSI_CKP)
    - pin10(MIPI_DSI2_CK_N): NETS(U1_MIPI_DSI2_CK_N)
    "
  `)
})
