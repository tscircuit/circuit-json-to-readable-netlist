import { expect, it } from "bun:test"
import { scorePhrase } from "lib/scorePhrase"

it("scores reset, boot, and enable control pin aliases above the default", () => {
  expect(scorePhrase("NRST")).toBe(1.15)
  expect(scorePhrase("RESET")).toBe(1.15)
  expect(scorePhrase("BOOT")).toBe(1.15)
  expect(scorePhrase("ENABLE")).toBe(1.15)
  expect(scorePhrase("SHDN")).toBe(1.15)
  expect(scorePhrase("RST")).toBe(1.1)
  expect(scorePhrase("EN")).toBe(1.1)
})

it("keeps unrelated control-like phrases at the default score", () => {
  expect(scorePhrase("PORTA")).toBe(1)
  expect(scorePhrase("DATA")).toBe(1)
})
