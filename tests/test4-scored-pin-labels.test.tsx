import { expect, it } from "bun:test"
import { scorePhrase } from "lib/scorePhrase"

it("scores semantic pin labels with digits before generic numbered pins", () => {
  expect(scorePhrase("GPIO1")).toBe(1.1)
  expect(scorePhrase("GPIO1_RX")).toBe(1.15)
  expect(scorePhrase("pin14")).toBe(0.5)
})
