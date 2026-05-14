import { expect, it } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { getReadableNameForPin } from "lib/getReadableNameForPin"
import { scorePhrase } from "lib/scorePhrase"

it("uses descriptive numbered pin hints instead of generic pin labels", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_0",
      name: "U1",
      manufacturer_part_number: "RP2040",
    },
    {
      type: "source_component",
      ftype: "simple_resistor",
      source_component_id: "source_component_1",
      name: "R1",
      resistance: 1000,
      display_resistance: "1k",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["14", "pin14", "GP10", "SPI1_SCK"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin1",
      pin_number: 1,
      port_hints: ["anode", "pos", "left"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_0",
      connected_source_port_ids: ["source_port_0", "source_port_1"],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("  - U1 GP10 (SPI1_SCK)")
  expect(netlist).not.toContain("  - U1 pin14")
  expect(netlist).toContain("- pin14(GP10, SPI1_SCK): NETS(U1_GP10)")
  expect(netlist).not.toContain("undefined")
})

it("keeps lowercase descriptive pin hints from falling back to generic pin labels", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_0",
      name: "U1",
      manufacturer_part_number: "RP2040",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["14", "pin14", "gp10", "spi1_sck"],
    },
  ]

  expect(
    getReadableNameForPin({
      circuitJson,
      source_port_id: "source_port_0",
    }),
  ).toBe("U1 gp10 (spi1_sck)")
})

it("prefers descriptive domain aliases over generic MCU GPIO labels", () => {
  const circuitJson: AnyCircuitElement[] = [
    {
      type: "source_component",
      ftype: "simple_chip",
      source_component_id: "source_component_domain",
      name: "U1",
      manufacturer_part_number: "DRV8313",
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
      source_port_id: "source_port_opto_input",
      source_component_id: "source_component_domain",
      name: "pin1",
      pin_number: 1,
      port_hints: ["1", "pin1", "OPTOCOUPLER", "OPTO_IN", "LED_INPUT"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_opto_input",
      source_component_id: "source_component_mcu",
      name: "pin18",
      pin_number: 18,
      port_hints: ["18", "pin18", "GPIO_DRIVE"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_motor_phase",
      source_component_id: "source_component_domain",
      name: "pin5",
      pin_number: 5,
      port_hints: ["5", "pin5", "MOTOR_PHASE", "PHASE_U"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_motor_phase",
      source_component_id: "source_component_mcu",
      name: "pin19",
      pin_number: 19,
      port_hints: ["19", "pin19", "GPIO_MOTOR"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_usb_power",
      source_component_id: "source_component_domain",
      name: "pin8",
      pin_number: 8,
      port_hints: ["8", "pin8", "VBUS_SENSE", "USB_POWER_DELIVERY"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_mcu_usb_power",
      source_component_id: "source_component_mcu",
      name: "pin20",
      pin_number: 20,
      port_hints: ["20", "pin20", "GPIO_VBUS"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_opto_input",
      connected_source_port_ids: [
        "source_port_opto_input",
        "source_port_mcu_opto_input",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_motor_phase",
      connected_source_port_ids: [
        "source_port_motor_phase",
        "source_port_mcu_motor_phase",
      ],
      connected_source_net_ids: [],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_usb_power",
      connected_source_port_ids: [
        "source_port_usb_power",
        "source_port_mcu_usb_power",
      ],
      connected_source_net_ids: [],
    },
  ]

  const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(netlist).toContain("NET: U1_OPTO_IN")
  expect(netlist).not.toContain("NET: U1_OPTOCOUPLER")
  expect(netlist).not.toContain("NET: U2_GPIO_DRIVE")
  expect(netlist).toContain("NET: U1_PHASE_U")
  expect(netlist).not.toContain("NET: U1_MOTOR_PHASE")
  expect(netlist).not.toContain("NET: U2_GPIO_MOTOR")
  expect(netlist).toContain("NET: U1_USB_POWER_DELIVERY")
  expect(netlist).not.toContain("NET: U1_VBUS_SENSE")
  expect(netlist).not.toContain("NET: U2_GPIO_VBUS")
  expect(netlist).not.toContain("undefined")
})

it("scores descriptive signal aliases without substring false positives", () => {
  expect(scorePhrase("gp10")).toBeGreaterThan(1)
  expect(scorePhrase("spi1_sck")).toBeGreaterThan(1)
  expect(scorePhrase("GPIO_STATUS")).toBeLessThan(scorePhrase("OPTO_IN"))
  expect(scorePhrase("OPTOCOUPLER")).toBeLessThan(scorePhrase("OPTO_IN"))
  expect(scorePhrase("MOTOR_PHASE")).toBeLessThan(scorePhrase("PHASE_U"))
  expect(scorePhrase("VBUS_SENSE")).toBeLessThan(
    scorePhrase("USB_POWER_DELIVERY"),
  )
  expect(scorePhrase("IBI")).toBeGreaterThan(1)
  expect(scorePhrase("positive")).toBeLessThanOrEqual(1)
  expect(scorePhrase("DC")).toBe(1)
})
