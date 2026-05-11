export const formatPinLabelFromNumber = ({
  pinNumber,
  numericPrefix,
}: {
  pinNumber: unknown
  numericPrefix: string
}) => {
  if (pinNumber === undefined || pinNumber === null) return undefined
  if (typeof pinNumber === "number") return `${numericPrefix}${pinNumber}`
  return String(pinNumber)
}
