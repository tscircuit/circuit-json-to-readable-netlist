import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("keeps data-line hints for generic chip pin labels", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_0",
      name: "U1",
      manufacturer_part_number: "WS2812B",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["DOUT"],
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "U2",
      manufacturer_part_number: "WS2812B",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["DIN"],
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_2",
      name: "U3",
      manufacturer_part_number: "SERIAL_FLASH",
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_2",
      name: "pin5",
      pin_number: 5,
      port_hints: ["DATA0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_2",
      name: "pin6",
      pin_number: 6,
      port_hints: ["CLK0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_4",
      source_component_id: "source_component_2",
      name: "pin7",
      pin_number: 7,
      port_hints: ["CS0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_8",
      source_component_id: "source_component_2",
      name: "pin8",
      pin_number: 8,
      port_hints: ["DQ1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_9",
      source_component_id: "source_component_2",
      name: "pin9",
      pin_number: 9,
      port_hints: ["DAT3"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_12",
      source_component_id: "source_component_2",
      name: "pin10",
      pin_number: 10,
      port_hints: ["DATA_1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_13",
      source_component_id: "source_component_2",
      name: "pin11",
      pin_number: 11,
      port_hints: ["DQ_2"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_16",
      source_component_id: "source_component_2",
      name: "pin12",
      pin_number: 12,
      port_hints: ["SIO0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_18",
      source_component_id: "source_component_2",
      name: "pin13",
      pin_number: 13,
      port_hints: ["DQS0_P"],
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_3",
      name: "J1",
      manufacturer_part_number: "GENERIC_HEADER",
    },
    {
      type: "source_port",
      source_port_id: "source_port_5",
      source_component_id: "source_component_3",
      name: "pin1",
      pin_number: 1,
      port_hints: ["DATA0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_6",
      source_component_id: "source_component_3",
      name: "pin2",
      pin_number: 2,
      port_hints: ["CLK0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_7",
      source_component_id: "source_component_3",
      name: "pin3",
      pin_number: 3,
      port_hints: ["CS0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_10",
      source_component_id: "source_component_3",
      name: "pin4",
      pin_number: 4,
      port_hints: ["DQ1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_11",
      source_component_id: "source_component_3",
      name: "pin5",
      pin_number: 5,
      port_hints: ["DAT3"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_14",
      source_component_id: "source_component_3",
      name: "pin6",
      pin_number: 6,
      port_hints: ["DATA_1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_15",
      source_component_id: "source_component_3",
      name: "pin7",
      pin_number: 7,
      port_hints: ["DQ_2"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_17",
      source_component_id: "source_component_3",
      name: "pin8",
      pin_number: 8,
      port_hints: ["SIO0"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_19",
      source_component_id: "source_component_3",
      name: "pin9",
      pin_number: 9,
      port_hints: ["DQS0_P"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_0", "source_port_1"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_2", "source_port_5"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_2",
      connected_source_port_ids: ["source_port_3", "source_port_6"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_3",
      connected_source_port_ids: ["source_port_4", "source_port_7"],
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
      connected_source_port_ids: ["source_port_16", "source_port_17"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_9",
      connected_source_port_ids: ["source_port_18", "source_port_19"],
      connected_source_net_ids: [],
    },
  ] as any

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: WS2812B
     - U2: WS2812B
     - U3: SERIAL_FLASH
     - J1: GENERIC_HEADER

    NET: U1_DOUT
      - U1 pin14 (DOUT)
      - U2 pin1 (DIN)

    NET: U3_DATA0
      - U3 pin5 (DATA0)
      - J1 pin1 (DATA0)

    NET: U3_CLK0
      - U3 pin6 (CLK0)
      - J1 pin2 (CLK0)

    NET: U3_CS0
      - U3 pin7 (CS0)
      - J1 pin3 (CS0)

    NET: U3_DQ1
      - U3 pin8 (DQ1)
      - J1 pin4 (DQ1)

    NET: U3_DAT3
      - U3 pin9 (DAT3)
      - J1 pin5 (DAT3)

    NET: U3_DATA_1
      - U3 pin10 (DATA_1)
      - J1 pin6 (DATA_1)

    NET: U3_DQ_2
      - U3 pin11 (DQ_2)
      - J1 pin7 (DQ_2)

    NET: U3_SIO0
      - U3 pin12 (SIO0)
      - J1 pin8 (SIO0)

    NET: U3_DQS0_P
      - U3 pin13 (DQS0_P)
      - J1 pin9 (DQS0_P)


    COMPONENT_PINS:
    U1 (WS2812B)
    - pin14(DOUT): NETS(U1_DOUT)

    U2 (WS2812B)
    - pin1(DIN): NETS(U1_DOUT)

    U3 (SERIAL_FLASH)
    - pin5(DATA0): NETS(U3_DATA0)
    - pin6(CLK0): NETS(U3_CLK0)
    - pin7(CS0): NETS(U3_CS0)
    - pin8(DQ1): NETS(U3_DQ1)
    - pin9(DAT3): NETS(U3_DAT3)
    - pin10(DATA_1): NETS(U3_DATA_1)
    - pin11(DQ_2): NETS(U3_DQ_2)
    - pin12(SIO0): NETS(U3_SIO0)
    - pin13(DQS0_P): NETS(U3_DQS0_P)

    J1 (GENERIC_HEADER)
    - pin1(DATA0): NETS(U3_DATA0)
    - pin2(CLK0): NETS(U3_CLK0)
    - pin3(CS0): NETS(U3_CS0)
    - pin4(DQ1): NETS(U3_DQ1)
    - pin5(DAT3): NETS(U3_DAT3)
    - pin6(DATA_1): NETS(U3_DATA_1)
    - pin7(DQ_2): NETS(U3_DQ_2)
    - pin8(SIO0): NETS(U3_SIO0)
    - pin9(DQS0_P): NETS(U3_DQS0_P)
    "
  `)
})

it("scores data-line aliases without broadening generic numbered pins", () => {
  expect(scorePhrase("DATA")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("CLK")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("CS")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("DATA_1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("DQ_2")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("SIO0")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("DQS0_P")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("IO_7_N")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("A1")).toBe(0.5)
  expect(scorePhrase("GPIO1")).toBe(0.5)
  expect(scorePhrase("SCLK0")).toBe(0.5)
  expect(scorePhrase("pin14")).toBe(0.5)
  expect(scorePhrase("DATA_READY1")).toBe(0.5)
  expect(scorePhrase("CLK_EN1")).toBe(0.5)
  expect(scorePhrase("CS_GPIO1")).toBe(0.5)
  expect(scorePhrase("DATETIME1")).toBe(0.5)
  expect(scorePhrase("DOUT_EN1")).toBe(0.5)
  expect(scorePhrase("DATA_READY")).toBe(1)
  expect(scorePhrase("CLK_EN")).toBe(1)
  expect(scorePhrase("CS_GPIO")).toBe(scorePhrase("GPIO"))
  expect(scorePhrase("CS_GPIO")).toBeLessThan(scorePhrase("CS"))
  expect(scorePhrase("DOUT_EN")).toBe(1)
})
