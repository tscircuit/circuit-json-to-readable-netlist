import { expect, it } from "bun:test"
import { scorePhrase } from "lib/scorePhrase"

it("scores known pin labels with numbers by their useful words", () => {
  expect(scorePhrase("GPIO1")).toBeGreaterThan(1)
  expect(scorePhrase("UART_RX1")).toBeGreaterThan(1)
})

it("still treats generic numbered pins as low quality", () => {
  expect(scorePhrase("pin14")).toBeLessThan(1)
})
