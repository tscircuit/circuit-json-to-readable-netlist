import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("preserves high-speed serial pin labels with lane numbers", () => {
  const circuitJson = renderCircuit(
    <board width="10mm" height="10mm" routingDisabled>
      <chip
        name="U1"
        footprint="soic16"
        manufacturerPartNumber="PCIe_ENDPOINT"
        pinLabels={{
          pin14: ["PCIE_TX0_P"],
          pin15: ["PCIE_TX0_N"],
        }}
      />
      <chip
        name="J1"
        footprint="pinrow2"
        manufacturerPartNumber="EDGE_CONN"
        pinLabels={{
          pin1: ["RX0_P"],
          pin2: ["RX0_N"],
        }}
      />
      <trace from=".U1 .PCIE_TX0_P" to=".J1 .RX0_P" />
      <trace from=".U1 .PCIE_TX0_N" to=".J1 .RX0_N" />
    </board>,
  )

  expect(
    convertCircuitJsonToReadableNetlist(circuitJson),
  ).toMatchInlineSnapshot(`
    "COMPONENTS:
     - U1: PCIe_ENDPOINT, soic16
     - J1: EDGE_CONN, pinrow2

    NET: U1_PCIE_TX0_P
      - U1 PCIE_TX0_P
      - J1 RX0_P

    NET: U1_PCIE_TX0_N
      - U1 PCIE_TX0_N
      - J1 RX0_N


    COMPONENT_PINS:
    U1 (PCIe_ENDPOINT)
    - pin1: NOT_CONNECTED
    - pin2: NOT_CONNECTED
    - pin3: NOT_CONNECTED
    - pin4: NOT_CONNECTED
    - pin5: NOT_CONNECTED
    - pin6: NOT_CONNECTED
    - pin7: NOT_CONNECTED
    - pin8: NOT_CONNECTED
    - pin9: NOT_CONNECTED
    - pin10: NOT_CONNECTED
    - pin11: NOT_CONNECTED
    - pin12: NOT_CONNECTED
    - pin13: NOT_CONNECTED
    - pin14(PCIE_TX0_P): NETS(U1_PCIE_TX0_P)
    - pin15(PCIE_TX0_N): NETS(U1_PCIE_TX0_N)
    - pin16: NOT_CONNECTED

    J1 (EDGE_CONN)
    - pin1(RX0_P): NETS(U1_PCIE_TX0_P)
    - pin2(RX0_N): NETS(U1_PCIE_TX0_N)
    "
  `)
})
