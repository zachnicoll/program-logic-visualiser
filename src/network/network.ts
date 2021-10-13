import { DataSet } from "vis-data";
import { Network, Data } from "vis-network/standalone";
import { FunctionCallGraph, GraphNode } from "parser/types";
import { ENTRY_POINT } from "utils/constants";
import logicDiagram from "parser/logicDiagram";
import {
  ENTRY_POINT_STYLE,
  DEAFULT_NODE_STYLE,
  DEFAULT_NETWORK_OPTIONS,
  DEFAULT_EDGE_STYLE,
  SELF_REFERENTIAL_EDGE_STYLE
} from "./defaults";

let network: Network | null = null;

const createNetwork = (graph: FunctionCallGraph): void => {
  if (network) {
    network.destroy();
  }

  // create an array with nodes
  const nodes = new DataSet(
    graph.nodes.map((node) => ({
      ...(node.id === ENTRY_POINT ? ENTRY_POINT_STYLE : DEAFULT_NODE_STYLE),
      ...node
    }))
  );

  // create an array with edges
  const edges = new DataSet(
    graph.edges.map((e, i) => {
      let styledEdge = { ...DEFAULT_EDGE_STYLE, ...e, id: i };

      if (styledEdge.selfReferential) {
        styledEdge = { ...styledEdge, ...SELF_REFERENTIAL_EDGE_STYLE };
      }

      return styledEdge;
    })
  );

  // create a network
  const container = document.getElementById("visjs-container");

  const data: Data = {
    nodes,
    edges
  };

  // This attaches the canvas to the container element
  network = new Network(container, data, DEFAULT_NETWORK_OPTIONS);

  network.on("click", (properties) => {
    const ids = properties.nodes;
    const clickedNode: GraphNode = nodes.get(ids)[0];

    logicDiagram(clickedNode.lines);
  });
};

export default createNetwork;
