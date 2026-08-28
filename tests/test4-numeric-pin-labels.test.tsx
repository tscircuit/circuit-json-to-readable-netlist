import { expect, it } from "bun:test"
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist"
import { scorePhrase } from "lib/scorePhrase"
import { renderCircuit } from "tests/fixtures/render-circuit"

declare module "bun:test" {
  interface Matchers<T = unknown> {
    toMatchInlineSnapshot(snapshot?: string | null): Promise<MatcherResult>
  }
}

it("scorePhrase: GPIO14 should score >= 1.1 (not penalized for digits)", () => {
  expect(scorePhrase("GPIO14")).toBeGreaterThanOrEqual(1.1)
})

it("scorePhrase: SCL2 should score >= 1.2 (SCL keyword present)", () => {
  expect(scorePhrase("SCL2")).toBeGreaterThanOrEqual(1.2)
})

it("scorePhrase: TX1 should score >= 1.15 (TX keyword present)", () => {
  expect(scorePhrase("TX1")).toBeGreaterThanOrEqual(1.15)
})

it("scorePhrase: plain number '14' should score 0.5", () => {
  expect(scorePhrase("14")).toBe(0.5)
})

it("scorePhrase: 'pin14' should score 0.5 (generic pin label)", () => {
  expect(scorePhrase("pin14")).toBe(0.5)
})
