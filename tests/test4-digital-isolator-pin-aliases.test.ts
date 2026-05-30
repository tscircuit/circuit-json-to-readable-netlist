import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("keeps digital isolator aliases for generic chip pin labels", () => {
  const circuitJson = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_0",
      name: "U1",
      manufacturer_part_number: "ADUM_DIGITAL_ISOLATOR",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["ISO_IN1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_0",
      name: "pin15",
      pin_number: 15,
      port_hints: ["ADUM_TX1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_4",
      source_component_id: "source_component_0",
      name: "pin16",
      pin_number: 16,
      port_hints: ["ISOINA1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_5",
      source_component_id: "source_component_0",
      name: "pin17",
      pin_number: 17,
      port_hints: ["ADUM_RXB2"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_8",
      source_component_id: "source_component_0",
      name: "pin18",
      pin_number: 18,
      port_hints: ["SI86_CH1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_10",
      source_component_id: "source_component_0",
      name: "pin19",
      pin_number: 19,
      port_hints: ["VDD1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_12",
      source_component_id: "source_component_0",
      name: "pin20",
      pin_number: 20,
      port_hints: ["EN1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_14",
      source_component_id: "source_component_0",
      name: "pin21",
      pin_number: 21,
      port_hints: ["VIA1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_16",
      source_component_id: "source_component_0",
      name: "pin22",
      pin_number: 22,
      port_hints: ["VE1"],
    },
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_1",
      name: "U2",
      manufacturer_part_number: "MCU_HEADER",
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["ISO_OUT1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_3",
      source_component_id: "source_component_1",
      name: "pin2",
      pin_number: 2,
      port_hints: ["ADUM_RX1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_6",
      source_component_id: "source_component_1",
      name: "pin3",
      pin_number: 3,
      port_hints: ["ISOOUTA1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_7",
      source_component_id: "source_component_1",
      name: "pin4",
      pin_number: 4,
      port_hints: ["ADUM_TXB2"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_9",
      source_component_id: "source_component_1",
      name: "pin5",
      pin_number: 5,
      port_hints: ["ISO_CH1"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_11",
      source_component_id: "source_component_1",
      name: "pin6",
      pin_number: 6,
      port_hints: ["VISO2"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_13",
      source_component_id: "source_component_1",
      name: "pin7",
      pin_number: 7,
      port_hints: ["EN2"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_15",
      source_component_id: "source_component_1",
      name: "pin8",
      pin_number: 8,
      port_hints: ["VOB2"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_17",
      source_component_id: "source_component_1",
      name: "pin9",
      pin_number: 9,
      port_hints: ["nEN2"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_0", "source_port_2"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_3"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_2",
      connected_source_port_ids: ["source_port_4", "source_port_6"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_3",
      connected_source_port_ids: ["source_port_5", "source_port_7"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_4",
      connected_source_port_ids: ["source_port_8", "source_port_9"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_5",
      connected_source_port_ids: ["source_port_10", "source_port_11"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_6",
      connected_source_port_ids: ["source_port_12", "source_port_13"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_7",
      connected_source_port_ids: ["source_port_14", "source_port_15"],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_8",
      connected_source_port_ids: ["source_port_16", "source_port_17"],
      connected_source_net_ids: [],
    },
  ] as any

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: ADUM_DIGITAL_ISOLATOR
     - U2: MCU_HEADER

    NET: U1_ISO_IN1
      - U1 pin14 (ISO_IN1)
      - U2 pin1 (ISO_OUT1)

    NET: U1_ADUM_TX1
      - U1 pin15 (ADUM_TX1)
      - U2 pin2 (ADUM_RX1)

    NET: U1_ISOINA1
      - U1 pin16 (ISOINA1)
      - U2 pin3 (ISOOUTA1)

    NET: U1_ADUM_RXB2
      - U1 pin17 (ADUM_RXB2)
      - U2 pin4 (ADUM_TXB2)

    NET: U1_SI86_CH1
      - U1 pin18 (SI86_CH1)
      - U2 pin5 (ISO_CH1)

    NET: U1_VDD1
      - U1 pin19 (VDD1)
      - U2 pin6 (VISO2)

    NET: U1_EN1
      - U1 pin20 (EN1)
      - U2 pin7 (EN2)

    NET: U1_VIA1
      - U1 pin21 (VIA1)
      - U2 pin8 (VOB2)

    NET: U1_VE1
      - U1 pin22 (VE1)
      - U2 pin9 (nEN2)


    COMPONENT_PINS:
    U1 (ADUM_DIGITAL_ISOLATOR)
    - pin14(ISO_IN1): NETS(U1_ISO_IN1)
    - pin15(ADUM_TX1): NETS(U1_ADUM_TX1)
    - pin16(ISOINA1): NETS(U1_ISOINA1)
    - pin17(ADUM_RXB2): NETS(U1_ADUM_RXB2)
    - pin18(SI86_CH1): NETS(U1_SI86_CH1)
    - pin19(VDD1): NETS(U1_VDD1)
    - pin20(EN1): NETS(U1_EN1)
    - pin21(VIA1): NETS(U1_VIA1)
    - pin22(VE1): NETS(U1_VE1)

    U2 (MCU_HEADER)
    - pin1(ISO_OUT1): NETS(U1_ISO_IN1)
    - pin2(ADUM_RX1): NETS(U1_ADUM_TX1)
    - pin3(ISOOUTA1): NETS(U1_ISOINA1)
    - pin4(ADUM_TXB2): NETS(U1_ADUM_RXB2)
    - pin5(ISO_CH1): NETS(U1_SI86_CH1)
    - pin6(VISO2): NETS(U1_VDD1)
    - pin7(EN2): NETS(U1_EN1)
    - pin8(VOB2): NETS(U1_VIA1)
    - pin9(nEN2): NETS(U1_VE1)
    "
  `)
})

it("scores digital isolator channel aliases above passive labels", () => {
  const isolatorScore = scorePhrase("ISO_CH1")

  expect(isolatorScore).toBe(1.15)
  expect(scorePhrase("SI86_CH1")).toBe(isolatorScore)
  expect(scorePhrase("VDD1")).toBe(isolatorScore)
  expect(scorePhrase("VISO2")).toBe(isolatorScore)
  expect(scorePhrase("EN1")).toBe(isolatorScore)
  expect(scorePhrase("VIA1")).toBe(isolatorScore)
  expect(scorePhrase("VOB2")).toBe(isolatorScore)
  expect(scorePhrase("VE1")).toBe(isolatorScore)
  expect(scorePhrase("nEN2")).toBe(isolatorScore)
  expect(scorePhrase("DISABLE1")).toBe(0.5)
  expect(scorePhrase("NOE1")).toBe(0.5)
  expect(scorePhrase("GND1")).toBe(0.5)
  expect(scorePhrase("pin14")).toBe(0.5)
  expect(scorePhrase("ISO1")).toBe(0.5)
  expect(scorePhrase("ADUM1")).toBe(0.5)
  expect(scorePhrase("ISO_RESET1")).toBe(0.5)
  expect(scorePhrase("ISO_CTRL1")).toBe(0.5)
  expect(scorePhrase("ISO_FAULT1")).toBe(0.5)
  expect(scorePhrase("ADUM_FAULT1")).toBe(0.5)
  expect(scorePhrase("SI86_FAULT1")).toBe(0.5)
  expect(scorePhrase("CONTROL1")).toBe(0.5)
  expect(scorePhrase("CTRL1")).toBe(0.5)
  expect(scorePhrase("ENABLE1")).toBe(0.5)
  expect(scorePhrase("VCC1")).toBe(0.5)
  expect(scorePhrase("VSS1")).toBe(0.5)
  expect(scorePhrase("VDDIO1")).toBe(0.5)
  expect(scorePhrase("VDD_3V3")).toBe(0.5)
  expect(scorePhrase("VDD10")).toBe(0.5)
  expect(scorePhrase("VISO20")).toBe(0.5)
  expect(scorePhrase("EN10")).toBe(0.5)
  expect(scorePhrase("EN999")).toBe(0.5)
  expect(scorePhrase("VDD999")).toBe(0.5)
  expect(scorePhrase("VISO999")).toBe(0.5)
  expect(scorePhrase("VE999")).toBe(0.5)
  expect(scorePhrase("nEN999")).toBe(0.5)
  expect(scorePhrase("VIA123")).toBe(0.5)
  expect(scorePhrase("VIA999")).toBe(0.5)
  expect(scorePhrase("VOH999")).toBe(0.5)
  expect(scorePhrase("VDD_IO1")).toBe(0.5)
})
