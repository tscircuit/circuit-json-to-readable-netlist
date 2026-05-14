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

const hvacThermostatAliasPatterns = [
  /\bOPEN_?THERM(?:_?(?:BUS|TX|RX|IN|OUT|P|N|PLUS|MINUS))?\d?\b/i,
  /\bOT_?(?:BUS|TX|RX|IN|OUT|P|N|PLUS|MINUS)\d?\b/i,
  /\bTHERMOSTAT_?(?:W\d?|Y\d?|G\d?|C|R|RC|RH|O|B|AUX|E|FAN|HEAT|COOL)\b/i,
  /\bHVAC_?(?:HEAT|COOL|FAN|AUX|EMHEAT|CALL)\d?\b/i,
  /\b(?:HEAT|COOL|FAN|AUX|EM)_CALL\d?\b/i,
  /\bBOILER_?(?:CALL|ENABLE|FIRE|TX|RX|BUS)\d?\b/i,
  /\bFURNACE_?(?:W\d?|CALL|FAN|HEAT|FAULT)\b/i,
  /\bHEATPUMP_?(?:O|B|REV|AUX|DEFROST|Y\d?)\b/i,
]

export const scorePhrase = (phrase: string) => {
  if (hvacThermostatAliasPatterns.some((pattern) => pattern.test(phrase))) {
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
