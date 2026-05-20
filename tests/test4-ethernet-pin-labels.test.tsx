import { expect, it } from "bun:test";
import type { AnyCircuitElement } from "circuit-json";
import { convertCircuitJsonToReadableNetlist } from "lib/convertCircuitJsonToReadableNetlist";

it("keeps ethernet differential pin labels ahead of generic numeric pins", () => {
	const circuitJson: AnyCircuitElement[] = [
		{
			type: "source_component",
			ftype: "simple_chip",
			source_component_id: "source_component_1",
			name: "U1",
			manufacturer_part_number: "ETH_PHY",
		},
		{
			type: "source_component",
			ftype: "simple_chip",
			source_component_id: "source_component_2",
			name: "J1",
			manufacturer_part_number: "HEADER",
		},
		{
			type: "source_port",
			source_port_id: "source_port_1",
			source_component_id: "source_component_1",
			name: "pin1",
			pin_number: 1,
			port_hints: ["TXP1"],
		},
		{
			type: "source_port",
			source_port_id: "source_port_2",
			source_component_id: "source_component_2",
			name: "pin1",
			pin_number: 1,
			port_hints: ["pos", "pin1"],
		},
		{
			type: "source_trace",
			source_trace_id: "source_trace_1",
			connected_source_port_ids: ["source_port_1", "source_port_2"],
			connected_source_net_ids: [],
		},
	];

	const netlist = convertCircuitJsonToReadableNetlist(circuitJson);

	expect(netlist).toContain("NET: U1_TXP1");
	expect(netlist).toContain("  - U1 pin1 (TXP1)");
	expect(netlist).toContain("- pin1(TXP1): NETS(U1_TXP1)");
});
