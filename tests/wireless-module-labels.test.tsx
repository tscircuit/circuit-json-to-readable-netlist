import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scores digit-bearing wireless module labels before numeric fallback", () => {
  expect(scorePhrase("WIFI_IRQ1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("ZIGBEE_RESET1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("BLE_HOST_WAKE1")).toBeGreaterThan(scorePhrase("pin14"))
})

it("uses wireless module aliases in readable netlists", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic4"
        manufacturerPartNumber="ESP32-C6"
        pinLabels={{
          pin1: ["GPIO1", "WIFI_IRQ1"],
          pin2: ["GPIO2", "ZIGBEE_RESET1"],
          pin3: ["GPIO3", "BLE_HOST_WAKE1"],
          pin4: ["GPIO4", "RFID_FIELD1"],
        }}
      />
      <resistor resistance="1k" footprint="0402" name="R1" />
      <resistor resistance="1k" footprint="0402" name="R2" />

      <trace from=".U1 .GPIO1" to=".R1 .pin1" />
      <trace from=".U1 .GPIO2" to=".R2 .pin1" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: ESP32-C6, soic4
     - R1: 1kΩ 0402 resistor
     - R2: 1kΩ 0402 resistor

    NET: U1_WIFI_IRQ1
      - U1 GPIO1 (WIFI_IRQ1)
      - R1 pin1

    NET: U1_ZIGBEE_RESET1
      - U1 GPIO2 (ZIGBEE_RESET1)
      - R2 pin1


    COMPONENT_PINS:
    U1 (ESP32-C6)
    - pin1(GPIO1, WIFI_IRQ1): NETS(U1_WIFI_IRQ1)
    - pin2(GPIO2, ZIGBEE_RESET1): NETS(U1_ZIGBEE_RESET1)
    - pin3(GPIO3, BLE_HOST_WAKE1): NOT_CONNECTED
    - pin4(GPIO4, RFID_FIELD1): NOT_CONNECTED

    R1 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_WIFI_IRQ1)
    - pin2(cathode, neg, right): NOT_CONNECTED

    R2 (1kΩ 0402)
    - pin1(anode, pos, left): NETS(U1_ZIGBEE_RESET1)
    - pin2(cathode, neg, right): NOT_CONNECTED
    "
  `)
})
