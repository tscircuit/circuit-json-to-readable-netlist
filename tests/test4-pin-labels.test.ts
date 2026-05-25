import { expect, it, describe } from "bun:test"
import { getBestPinNameFromHints } from "lib/getBestPinNameFromHints"

describe("getBestPinNameFromHints", () => {
  it("returns port.name when it is a valid descriptive name", () => {
    const result = getBestPinNameFromHints({
      name: "SCL",
      pin_number: 3,
      port_hints: ["3", "SCL", "GPIO3"],
    })
    expect(result).toBe("SCL")
  })

  it("picks the best hint when port.name is undefined", () => {
    const result = getBestPinNameFromHints({
      name: undefined,
      pin_number: 14,
      port_hints: ["14", "GPIO14", "SCL"],
    })
    expect(result).toBe("SCL")
  })

  it("picks GPIO hint over pin number when name is missing", () => {
    const result = getBestPinNameFromHints({
      name: undefined,
      pin_number: 5,
      port_hints: ["5", "GPIO5"],
    })
    expect(result).toBe("GPIO5")
  })

  it("falls back to pin{number} when no good hints exist", () => {
    const result = getBestPinNameFromHints({
      name: undefined,
      pin_number: 1,
      port_hints: ["1"],
    })
    expect(result).toBe("pin1")
  })

  it("handles port.name being the string 'undefined'", () => {
    const result = getBestPinNameFromHints({
      name: "undefined" as any,
      pin_number: 7,
      port_hints: ["7", "GPIO7", "UART_RX"],
    })
    expect(result).toBe("UART_RX")
  })

  it("handles port.name matching pin{number} format", () => {
    const result = getBestPinNameFromHints({
      name: "pin3",
      pin_number: 3,
      port_hints: ["3", "GPIO3", "SDA"],
    })
    expect(result).toBe("SDA")
  })

  it("picks VDD over pin number", () => {
    const result = getBestPinNameFromHints({
      name: undefined,
      pin_number: 8,
      port_hints: ["8", "VDD"],
    })
    expect(result).toBe("VDD")
  })

  it("picks GND over pin number", () => {
    const result = getBestPinNameFromHints({
      name: undefined,
      pin_number: 1,
      port_hints: ["1", "GND"],
    })
    expect(result).toBe("GND")
  })

  it("handles empty port_hints", () => {
    const result = getBestPinNameFromHints({
      name: undefined,
      pin_number: 2,
      port_hints: [],
    })
    expect(result).toBe("pin2")
  })

  it("handles MISO hint", () => {
    const result = getBestPinNameFromHints({
      name: undefined,
      pin_number: 12,
      port_hints: ["12", "MISO"],
    })
    expect(result).toBe("MISO")
  })
})
