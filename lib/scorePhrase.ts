/**
 * Ranks how good a word is for a net name. Usually uncommon words are better.
 * If a word isn't on this list, it's given a score of 1
 *
 * A phrase is scored by finding the highest scoring word that it contains, so
 * for example GPIO1 would score 1.1, but GPIO1_RX would score 1.15
 *
 * These unique port names are usually the best indicator of what the net is for
 */
const exactPhraseQualityScore: Record<string, number> = {
  MISO: 1.2,
  MOSI: 1.2,
  SCLK: 1.2,
  SDA: 1.2,
  SCL: 1.2,
  RX: 1.15,
  TX: 1.15,
  GPIO: 1.1,
  GP: 1.1,
  SCK: 1.1,
  GND: 1.1,
  VDD: 1.1,
  AGND: 1.1,
  VBAT: 1.1,
  VCOMH: 1.1,
  V5: 1.1,
  V3: 1.1,
  V1: 1.1,
}

const tokenQualityScore: Record<string, number> = {
  ...exactPhraseQualityScore,
  CATHODE: 0.5,
  ANODE: 0.5,
  NEG: 0.9,
  NEGATIVE: 0.9,
  POS: 0.9,
  POSITIVE: 0.9,
  PIN: 0.5,
  NC: 0.4,
  LEFT: 0.3,
  RIGHT: 0.3,
  TOP: 0.3,
  BOTTOM: 0.3,
}

const genericSignalPrefixes = [
  "GPIO",
  "GP",
  "SPI",
  "I2C",
  "UART",
  "USART",
  "ADC",
  "DAC",
  "PWM",
]

const specificSuffixTokens = new Set([
  "IN",
  "OUT",
  "HIGH",
  "LOW",
  "PLUS",
  "MINUS",
  "U",
  "V",
  "W",
  "TX",
  "RX",
  "DATA",
  "CLOCK",
])

const getTokens = (phrase: string) => phrase.match(/[A-Z]+|\d+/g) ?? []

const getTokenScore = (token: string) =>
  /^\d+$/.test(token) ? 0.5 : (tokenQualityScore[token] ?? 1)

const startsWithGenericPrefix = (phrase: string) =>
  genericSignalPrefixes.some(
    (prefix) => phrase === prefix || phrase.startsWith(prefix),
  )

const isLowValueToken = (token: string) => getTokenScore(token) < 1

export const scorePhrase = (phrase: string) => {
  const normalizedPhrase = phrase.trim().toUpperCase()
  if (!normalizedPhrase) return 0

  const exactScore = exactPhraseQualityScore[normalizedPhrase]
  if (exactScore) {
    return exactScore
  }

  const tokens = getTokens(normalizedPhrase)
  if (tokens.length > 0 && tokens.every((token) => /^\d+$/.test(token))) {
    return 0.5
  }

  const bestTokenScore = tokens.reduce(
    (bestScore, token) => Math.max(bestScore, getTokenScore(token)),
    0,
  )

  if (bestTokenScore < 1 || startsWithGenericPrefix(normalizedPhrase)) {
    return bestTokenScore
  }

  const descriptiveTokens = tokens.filter((token) => !isLowValueToken(token))
  if (descriptiveTokens.length >= 2) {
    const specificityScore = 1.12 + Math.min(descriptiveTokens.length, 3) * 0.02
    const suffixBonus = specificSuffixTokens.has(
      descriptiveTokens[descriptiveTokens.length - 1],
    )
      ? 0.02
      : 0

    return Math.max(bestTokenScore, specificityScore + suffixBonus)
  }

  const [singleToken] = descriptiveTokens
  if (singleToken && singleToken.length >= 3) {
    return Math.max(bestTokenScore, 1.12)
  }

  return bestTokenScore
}
