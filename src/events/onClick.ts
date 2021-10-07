import { Data, DataSet, Network, Options } from "vis-network/standalone";
import functionGraph, { ENTRY_POINT } from "../parser/functionGraph";
import tokenize from "../parser/tokenize";
import { FunctionCallGraph } from "../parser/types";

const DEAFULT_NODE_STYLE = {
  font: { face: "Overpass Mono", size: 16 },
  shape: "circle",
  color: {
    background: "white",
    border: "#29AF7FFF",
    hover: { background: "#FDE725FF" }
  }
};

const ENTRY_POINT_STYLE = {
  ...DEAFULT_NODE_STYLE,
  color: {
    background: "#73F055FF",
    border: "#29AF7FFF",
    hover: { background: "#FDE725FF" }
  }
};

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
  const container = document.getElementById("pixi-display");

  const data: Data = {
    nodes,
    edges
  };

  const options: Options = {
    physics: false,
    interaction: { hover: true },
    layout: {
      hierarchical: {
        enabled: true
      }
    }
  };

  // This attaches the canvas to the container element
  network = new Network(container, data, options);
};

export const onGenerateClick = (): void => {
  const textarea = document.getElementById("code-input") as HTMLTextAreaElement;
  const sourceCodeText = textarea.value;

  try {
    const tokens = tokenize(sourceCodeText);
    const funcGraph = functionGraph(tokens, sourceCodeText);

    createNetwork(funcGraph);
  } catch (e) {
    alert(`Syntax error! ${(e as Error).message}`);
  }
};

export default onGenerateClick;
