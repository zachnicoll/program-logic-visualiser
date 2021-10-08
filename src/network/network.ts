import { DataSet } from "vis-data";
import { Network, Data } from "vis-network/standalone";
import { FunctionCallGraph } from "parser/types";
import { ENTRY_POINT } from "utils/constants";
import {
  ENTRY_POINT_STYLE,
  DEAFULT_NODE_STYLE,
  DEFAULT_NETWORK_OPTIONS
} from "./defaults";

let network: Network | null = null;

const createNetwork = (graph: FunctionCallGraph): void => {
  if (network) {
    network.destroy();
  }

  // create an array with nodes
  const nodes = new DataSet(
    graph.nodes.map((node) => ({
      ...node,
      ...(node.id === ENTRY_POINT ? ENTRY_POINT_STYLE : DEAFULT_NODE_STYLE)
    }))
  );

  // create an array with edges
  const edges = new DataSet(graph.edges.map((e, i) => ({ ...e, id: i })));

  // create a network
  const container = document.getElementById("visjs-container");

  const data: Data = {
    nodes,
    edges
  };

  // This attaches the canvas to the container element
  network = new Network(container, data, DEFAULT_NETWORK_OPTIONS);
};

export default createNetwork;
