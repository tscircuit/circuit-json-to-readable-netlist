import { expect, it } from "bun:test"
import { scorePhrase } from "lib/scorePhrase"

it("scores timecode pin aliases above generic numbered labels", () => {
  expect(scorePhrase("PTP_1588")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("IRIGB1")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("1PPS")).toBeGreaterThan(scorePhrase("pin14"))
  expect(scorePhrase("TIMEPULSE")).toBeGreaterThan(scorePhrase("pos"))
})
