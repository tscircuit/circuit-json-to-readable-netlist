import type { CircuitJson, AnyCircuitElement } from "circuit-json"
import { getFullConnectivityMapFromCircuitJson } from "circuit-json-to-connectivity-map"

/*
declare class ConnectivityMap {
    netMap: Record<string, string[]>;
    idToNetMap: Record<string, string>;
    constructor(netMap: Record<string, string[]>);
    addConnections(connections: string[][]): void;
    getIdsConnectedToNet(netId: string): string[];
    getNetConnectedToId(id: string): string | undefined;
    areIdsConnected(id1: string, id2: string): boolean;
    areAllIdsConnected(ids: string[]): boolean;
}
*/

export const convertCircuitJsonToReadableNetlist = (
  circuitJson: AnyCircuitElement[],
): string => {
  const connectivityMap = getFullConnectivityMapFromCircuitJson(circuitJson)
}
