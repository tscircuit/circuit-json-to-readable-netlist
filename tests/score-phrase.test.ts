import { expect, it } from "bun:test"
import { scorePhrase } from "lib/scorePhrase"

it("keeps useful numbered pin labels above generic pin names", () => {
  expect(scorePhrase("GP10")).toBeGreaterThan(1)
  expect(scorePhrase("GPIO10")).toBeGreaterThan(1)
  expect(scorePhrase("SPI1_SCK")).toBeGreaterThan(1)
  expect(scorePhrase("pin14")).toBeLessThan(1)
  expect(scorePhrase("14")).toBeLessThan(1)
})
