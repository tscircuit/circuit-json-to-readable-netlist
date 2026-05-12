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

const scoreAudioInterfacePhrase = (phrase: string) => {
  // Avoid the generic digit penalty for common audio interface pin aliases.
  // Examples: I2S_BCLK, I2S_LRCLK, I2S_WS, I2S_SDOUT, PDM_CLK, PDM_DAT.
  if (/(^|[_-])I2S([_-]|$)/.test(phrase)) return 1.2
  if (/(^|[_-])(BCLK|LRCLK|WS|MCLK)([_-]|$)/.test(phrase)) return 1.15
  if (/(^|[_-])(SDIN|SDOUT|DIN|DOUT|DATA)([_-]|$)/.test(phrase)) return 1.1
  if (/(^|[_-])PDM([_-]|$)/.test(phrase)) return 1.2
  if (/(^|[_-])(PDM_CLK|PDM_DAT)([_-]|$)/.test(phrase)) return 1.15
}

export const scorePhrase = (phrase: string) => {
  const audioScore = scoreAudioInterfacePhrase(phrase)
  if (audioScore) return audioScore

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
