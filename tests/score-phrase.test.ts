import { expect, test } from "bun:test"
import { scorePhrase } from "../lib/scorePhrase"

test("preserves semantic score for digit-bearing aliases like GPIO1", () => {
  expect(scorePhrase("GPIO1")).toBe(1.1)
  expect(scorePhrase("GPIO1_RX")).toBe(1.15)
})

test("matches known words case-insensitively", () => {
  expect(scorePhrase("sda")).toBe(1.2)
  expect(scorePhrase("gNd")).toBe(1.1)
})

test("still falls back to generic digit score for unknown numeric labels", () => {
  expect(scorePhrase("pin14")).toBe(0.5)
})
