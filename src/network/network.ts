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
  SELF_REFERENTIAL_EDGE_STYLE,
  DEFAULT_DIAGRAM_OPTIONS,
  DIAGRAM_NODE_TYPE_MAP,
  FONT_FACE
} from "./defaults";

let network: Network | null = null;

const onNodeClick = (
  properties: { nodes: string[] },
  nodes: DataSet<any>
): void => {
  const ids = properties.nodes;
  const clickedNode: GraphNode = nodes.get(ids)[0];

  if (clickedNode) {
    // Clear the current network
    network.destroy();

    const diagram = logicDiagram(clickedNode.lines);

    const nodesData = new DataSet(
      diagram.nodes.map((node) => ({
        ...node,
        ...DEAFULT_NODE_STYLE,
        ...DIAGRAM_NODE_TYPE_MAP[node.type]
      }))
    );

    const edgesData = new DataSet(
      diagram.edges.map((e) => ({
        ...e,
        ...DEFAULT_EDGE_STYLE,
        font: { face: FONT_FACE, size: 16 },
        id: `${e.from}->${e.to}`
      }))
    );

    const data: Data = {
      nodes: nodesData,
      edges: edgesData
    };

    const container = document.getElementById("visjs-container");
    network = new Network(container, data, DEFAULT_DIAGRAM_OPTIONS);
  }
};

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
    try {
      onNodeClick(properties, nodes);
    } catch (e) {
      alert(`Syntax error! ${(e as Error).message}`);

      // Re-construct previous network so the user doesn't just see a white screen
      createNetwork(graph);
    }
  });
};

export default createNetwork;
