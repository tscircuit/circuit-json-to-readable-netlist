/**
 * Ranks how good a word is for a net name. Usually uncommon words are better.
 * If a word isn't on this list, it's given a score of 1
 *
 * A phrase is scored by finding the highest scoring word that it contains, so
 * for example GPIO1 would score 1.1, but GPIO1_RX would score 1.15
 *
 * These unique port names are usually the best indicator of what the net is for
 */
const wordQualityScore = {
  MISO: 1.2,
  MOSI: 1.2,
  SCLK: 1.2,
  SDA: 1.2,
  SCL: 1.2,
  QSPI: 1.2,
  PSRAM: 1.2,
  FLASH: 1.2,
  DQ: 1.2,
  IO: 1.15,
  HOLD: 1.15,
  WP: 1.15,
  RX: 1.15,
  TX: 1.15,
  GPIO: 1.1,
  cathode: 0.5,
  anode: 0.5,
  GND: 1.1,
  VDD: 1.1,
  AGND: 1.1,
  V5: 1.1,
  V3: 1.1,
  V1: 1.1,
  neg: 0.9,
  pos: 0.9,
  pin: 0.5,
  left: 0.3,
  right: 0.3,
}

const wordQualityScoreEntries = Object.entries(wordQualityScore).sort(
  (a, b) => b[1] - a[1],
)

const qspiMemoryWordQualityScoreEntries = wordQualityScoreEntries.filter(
  ([word]) =>
    ["QSPI", "PSRAM", "FLASH", "DQ", "IO", "HOLD", "WP"].includes(word),
)

export const scorePhrase = (phrase: string) => {
  for (const [word, score] of qspiMemoryWordQualityScoreEntries) {
    if (phrase.includes(word)) {
      return score
    }
  }
  if (phrase.match(/\d+/)) {
    return 0.5
  }
  for (const [word, score] of wordQualityScoreEntries) {
    if (phrase.includes(word)) {
      return score
    }
  }
  return 1
}
