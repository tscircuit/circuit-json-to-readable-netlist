import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { getReadableNameForPin } from "lib/getReadableNameForPin"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("keeps meaningful pin labels that contain digits", () => {
  const readablePinName = getReadableNameForPin({
    source_port_id: "source_port_1",
    circuitJson: [
      {
        type: "source_component",
        source_component_id: "source_component_1",
        name: "U1",
        ftype: "simple_chip",
      },
      {
        type: "source_port",
        source_port_id: "source_port_1",
        source_component_id: "source_component_1",
        name: "pin14",
        pin_number: 14,
        port_hints: ["pin14", "GPIO2", "SDA"],
      },
    ],
  })

  expect(readablePinName).toBe("U1 pin14 (GPIO2,SDA)")
})

it("keeps custom descriptive pin hints while filtering low quality labels", () => {
  const readablePinName = getReadableNameForPin({
    source_port_id: "source_port_1",
    circuitJson: [
      {
        type: "source_component",
        source_component_id: "source_component_1",
        name: "U1",
        ftype: "simple_chip",
      },
      {
        type: "source_port",
        source_port_id: "source_port_1",
        source_component_id: "source_component_1",
        name: "pin14",
        pin_number: 14,
        port_hints: ["pin14", "RESET", "BOOT", "left"],
      },
    ],
  })

  expect(readablePinName).toBe("U1 pin14 (RESET,BOOT)")
})

it("keeps USB differential pin hints on generic physical pins", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "U1",
      ftype: "simple_chip",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["pin14", "D+"],
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_1",
      name: "pin15",
      pin_number: 15,
      port_hints: ["pin15", "D-"],
    },
  ]

  expect(
    getReadableNameForPin({
      circuitJson,
      source_port_id: "source_port_1",
    }),
  ).toBe("U1 pin14 (D+)")
  expect(
    getReadableNameForPin({
      circuitJson,
      source_port_id: "source_port_2",
    }),
  ).toBe("U1 pin15 (D-)")
})

it("uses useful schematic display labels for generic physical pins", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_1",
      name: "U1",
      ftype: "simple_chip",
    },
    {
      type: "source_component",
      source_component_id: "source_component_2",
      name: "J1",
      ftype: "simple_chip",
    },
    {
      type: "source_port",
      source_port_id: "source_port_1",
      source_component_id: "source_component_1",
      name: "pin14",
      pin_number: 14,
      port_hints: ["pin14"],
    },
    {
      type: "schematic_port",
      schematic_port_id: "schematic_port_1",
      source_port_id: "source_port_1",
      center: { x: 0, y: 0 },
      display_pin_label: "USB_DP",
    },
    {
      type: "source_port",
      source_port_id: "source_port_2",
      source_component_id: "source_component_2",
      name: "pin1",
      pin_number: 1,
      port_hints: ["pin1"],
    },
    {
      type: "source_trace",
      source_trace_id: "source_trace_1",
      connected_source_port_ids: ["source_port_1", "source_port_2"],
    },
  ]

  expect(
    getReadableNameForPin({
      circuitJson,
      source_port_id: "source_port_1",
    }),
  ).toBe("U1 pin14 (USB_DP)")
  expect(convertCircuitJsonToReadableNetlist(circuitJson)).toContain(
    "NET: U1_USB_DP",
  )
  expect(convertCircuitJsonToReadableNetlist(circuitJson)).toContain(
    "- pin14(USB_DP): NETS(U1_USB_DP)",
  )
})
