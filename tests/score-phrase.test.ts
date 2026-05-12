import { expect, it } from "bun:test"
import { scorePhrase } from "../lib/scorePhrase"

it("scores numbered signal labels higher than generic pin names", () => {
  expect(scorePhrase("pin14")).toBe(0.5)
  expect(scorePhrase("GP14")).toBeGreaterThan(1)
  expect(scorePhrase("GPIO14")).toBeGreaterThan(1)
})
