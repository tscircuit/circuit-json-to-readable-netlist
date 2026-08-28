/**
 * Ranks how good a word is for a net name. Usually uncommon words are better.
 * If a word isn't on this list, it's given a score of 1
 *
 * Model railroad control aliases are scored first because their digits are part
 * of the domain-specific name. Other phrases with digits are treated as generic
 * pin labels and score 0.5 before matching against the word list.
 *
 * Phrases without digits are scored by finding the highest scoring word that
 * they contain, so for example GPIO_RX would score 1.15
 *
 * These unique port names are usually the best indicator of what the net is for
 */
const wordQualityScore = {
  MISO: 1.2,
  MOSI: 1.2,
  SCLK: 1.2,
  SDA: 1.2,
  SCL: 1.2,
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

const modelRailroadControlAliasRegex =
  /^(DCC|DCC_RAIL|RAILCOM|LOCONET)(?:[_-]?[A-Z0-9]+)*$/i

export const scorePhrase = (phrase: string) => {
  if (modelRailroadControlAliasRegex.test(phrase)) {
    return 1.2
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
