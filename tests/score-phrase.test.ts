import { expect, it } from "bun:test"
import { scorePhrase } from "lib/scorePhrase"

it("scores known aliases before applying the generic digit penalty", () => {
  expect(scorePhrase("GPIO1")).toBe(1.1)
  expect(scorePhrase("UART_RX1")).toBe(1.15)
  expect(scorePhrase("3V3")).toBe(1.1)
  expect(scorePhrase("VBUS")).toBe(1.1)
  expect(scorePhrase("pin14")).toBe(0.5)
})
