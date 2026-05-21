import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

it("scores USB HID controller aliases before the numeric fallback", () => {
  expect(scorePhrase("HID_INT1")).toBeGreaterThan(1)
  expect(scorePhrase("USBHID_WAKE1")).toBeGreaterThan(1)
  expect(scorePhrase("BOOT_MOUSE1")).toBeGreaterThan(1)
})

it("uses USB HID aliases for generic chip pins", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic8"
        manufacturerPartNumber="USB-HID-CTRL"
        pinLabels={{ pin1: ["HID_INT1"], pin2: ["USBHID_WAKE1"] }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <trace from=".U1 .HID_INT1" to=".R1 .pin1" />
    </board>,
  )

  const u1 = circuitJson.find(
    (element: any) =>
      element.type === "source_component" && element.name === "U1",
  ) as any
  const hidInterruptPort = circuitJson.find(
    (element: any) =>
      element.type === "source_port" &&
      element.source_component_id === u1.source_component_id &&
      element.name === "HID_INT1",
  ) as any

  expect(hidInterruptPort).toBeDefined()
  hidInterruptPort.name = "pin14"
  hidInterruptPort.pin_number = 14
  hidInterruptPort.port_hints = ["pin14", "HID_INT1"]

  const readableNetlist = convertCircuitJsonToReadableNetlist(circuitJson)

  expect(readableNetlist).toContain("NET: U1_HID_INT1")
  expect(readableNetlist).toContain("  - U1 pin14 (HID_INT1)")
})
