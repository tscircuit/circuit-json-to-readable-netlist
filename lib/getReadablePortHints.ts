export const getReadablePortHints = (portHints?: string[]) =>
  (portHints ?? []).map((hint) => hint.trim()).filter((hint) => hint.length > 0)
