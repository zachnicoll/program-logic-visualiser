import { Options } from "vis-network/standalone";

export const DEAFULT_NODE_STYLE = {
  font: { face: "Overpass Mono", size: 16 },
  shape: "circle",
  color: {
    background: "white",
    border: "#29AF7FFF",
    hover: { background: "#FDE725FF" }
  }
};

export const ENTRY_POINT_STYLE = {
  ...DEAFULT_NODE_STYLE,
  color: {
    background: "#73F055FF",
    border: "#29AF7FFF",
    hover: { background: "#FDE725FF" }
  }
};

export const DEFAULT_NETWORK_OPTIONS: Options = {
  physics: false,
  interaction: { hover: true },
  layout: {
    hierarchical: {
      enabled: true
    }
  }
};
