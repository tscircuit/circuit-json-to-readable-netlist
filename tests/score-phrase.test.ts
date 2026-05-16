import { expect, it } from "bun:test"
import { scorePhrase } from "lib/scorePhrase"

it("scores known digit-bearing pin labels before the generic digit fallback", () => {
  expect(scorePhrase("GPIO1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("gpio1")).toBeGreaterThan(scorePhrase("pos"))
  expect(scorePhrase("UART_TX1")).toBeGreaterThan(scorePhrase("pin14"))
})
