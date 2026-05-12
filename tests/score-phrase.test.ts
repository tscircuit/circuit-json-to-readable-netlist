import { expect, it } from "bun:test"
import { getReadableNameForPin } from "lib/getReadableNameForPin"
import { scorePhrase } from "lib/scorePhrase"

it("scores technical aliases that contain pin numbers", () => {
  expect(scorePhrase("14")).toBe(0.5)
  expect(scorePhrase("pin14")).toBe(0.5)
  expect(scorePhrase("GPIO1_RX")).toBe(1.15)
  expect(scorePhrase("I2C1_SCL")).toBe(1.2)
  expect(scorePhrase("ADC0")).toBe(1.2)
  expect(scorePhrase("PWM1")).toBe(1.2)
  expect(scorePhrase("anode")).toBe(0.5)
  expect(scorePhrase("pos")).toBe(0.9)
  expect(scorePhrase("left")).toBe(0.3)
})

it("includes digit-bearing technical aliases in readable pin names", () => {
  const circuitJson = [
    {
      type: "source_component",
      source_component_id: "source_component_0",
      name: "U1",
      ftype: "simple_chip",
    },
    {
      type: "source_port",
      source_port_id: "source_port_0",
      source_component_id: "source_component_0",
      name: "pin14",
      pin_number: 14,
      port_hints: ["pin14", "14", "ADC0", "PWM1"],
    },
  ] as any

  expect(
    getReadableNameForPin({
      circuitJson,
      source_port_id: "source_port_0",
    }),
  ).toBe("U1 pin14 (ADC0,PWM1)")
})
