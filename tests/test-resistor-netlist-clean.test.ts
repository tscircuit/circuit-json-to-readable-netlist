import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { convertCircuitJsonToReadableNetlist } from "../lib/convertCircuitJsonToReadableNetlist"
import type { AnyCircuitElement } from "circuit-json"

describe("resistor netlist clean formatting", () => {
  it("does not print 'undefined' after resistor value when footprint is missing", () => {
    const circuitJson: AnyCircuitElement[] = [
      {
        type: "source_component",
        source_component_id: "resistor_1",
        ftype: "simple_resistor",
        name: "R1",
        display_resistance: "10k",
      } as any,
      {
        type: "source_port",
        source_port_id: "port_1",
        source_component_id: "resistor_1",
        pin_number: 1,
        port_hints: ["1", "left", "anode", "pos"],
      } as any,
      {
        type: "source_port",
        source_port_id: "port_2",
        source_component_id: "resistor_1",
        pin_number: 2,
        port_hints: ["2", "right", "cathode", "neg"],
      } as any,
    ]

    const netlist = convertCircuitJsonToReadableNetlist(circuitJson)

    // Verify 'undefined' is never printed
    assert(!netlist.includes("undefined"), `Expected no 'undefined' in netlist, got:\n${netlist}`)

    // Verify header is clean 'R1 (10k)'
    assert(netlist.includes("R1 (10k)"), `Expected 'R1 (10k)', got:\n${netlist}`)

    // Verify resistor pins do not have anode / cathode / pos / neg
    assert(!netlist.includes("anode"), `Expected no 'anode' on resistor, got:\n${netlist}`)
    assert(!netlist.includes("cathode"), `Expected no 'cathode' on resistor, got:\n${netlist}`)
    assert(!netlist.includes("pos"), `Expected no 'pos' on resistor, got:\n${netlist}`)
    assert(!netlist.includes("neg"), `Expected no 'neg' on resistor, got:\n${netlist}`)

    // Verify neutral geometric hints like 'left' and 'right' are preserved
    assert(netlist.includes("pin1(left)"), `Expected 'pin1(left)', got:\n${netlist}`)
    assert(netlist.includes("pin2(right)"), `Expected 'pin2(right)', got:\n${netlist}`)
  })

  it("preserves footprint when present", () => {
    const circuitJson: AnyCircuitElement[] = [
      {
        type: "source_component",
        source_component_id: "resistor_2",
        ftype: "simple_resistor",
        name: "R2",
        display_resistance: "4.7k",
      } as any,
      {
        type: "cad_component",
        cad_component_id: "cad_resistor_2",
        source_component_id: "resistor_2",
        footprinter_string: "0603",
      } as any,
      {
        type: "source_port",
        source_port_id: "port_3",
        source_component_id: "resistor_2",
        pin_number: 1,
        port_hints: ["1", "pin1"],
      } as any,
    ]

    const netlist = convertCircuitJsonToReadableNetlist(circuitJson)
    assert(netlist.includes("R2 (4.7k 0603)"), `Expected 'R2 (4.7k 0603)', got:\n${netlist}`)
    assert(!netlist.includes("undefined"), `Expected no 'undefined', got:\n${netlist}`)
  })

  it("retains polarity hints on polarized components like capacitors", () => {
    const circuitJson: AnyCircuitElement[] = [
      {
        type: "source_component",
        source_component_id: "cap_1",
        ftype: "simple_capacitor",
        name: "C1",
        display_capacitance: "10uF",
      } as any,
      {
        type: "source_port",
        source_port_id: "port_cap_1",
        source_component_id: "cap_1",
        pin_number: 1,
        port_hints: ["1", "pos", "anode"],
      } as any,
    ]

    const netlist = convertCircuitJsonToReadableNetlist(circuitJson)
    assert(netlist.includes("pos") || netlist.includes("anode"), `Expected polarity hints retained on capacitor, got:\n${netlist}`)
  })
})
