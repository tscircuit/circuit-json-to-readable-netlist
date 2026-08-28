import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
        toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("test2 chip", () => {
    const circuitJson = renderCircuit(
          <board width="10mm" height="10mm" routingDisabled>
                <chip
                          name="U1"
                          footprint="soic8"
                          manufacturerPartNumber="ATMEGA328P"
                          pinLabels={{
                                      pin1: ["GND"],
                                      pin2: ["AGND"],
                                      pin3: ["GPIO1", "SCL"],
                                      pin4: ["GPIO2", "SDA"],
                                      pin5: ["GPIO3"],
                                      pin6: ["GPIO4", "UART_TX"],
                                      pin7: ["GPIO5", "UART_RX"],
                                      pin8: ["VCC"],
                          }}
                        />
          </board>board>,
        )
      
        expect(
              convertCircuitJsonToReadableNetlist(circuitJson),
            ).toMatchInlineSnapshot(`
                "COMPONENTS:
                     - U1: ATMEGA328P soic8 chip
                     
                         NET: 
                         
                             COMPONENT_PINS:
                                 U1 (ATMEGA328P soic8)
                                     - pin1(GND): NOT_CONNECTED
                                         - pin2(AGND): NOT_CONNECTED
                                             - pin3(GPIO1, SCL): NOT_CONNECTED
                                                 - pin4(GPIO2, SDA): NOT_CONNECTED
                                                     - pin5(GPIO3): NOT_CONNECTED
                                                         - pin6(GPIO4, UART_TX): NOT_CONNECTED
                                                             - pin7(GPIO5, UART_RX): NOT_CONNECTED
                                                                 - pin8(VCC): NOT_CONNECTED
                                                                     "
                                                                       `)
})
  </board>
