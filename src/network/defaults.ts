import colors from "styles/colors";
import { EdgeOptions, Options, NodeOptions } from "vis-network/standalone";

const FONT_FACE = "Overpass Mono";

export const DEAFULT_NODE_STYLE: NodeOptions = {
  font: { face: FONT_FACE, size: 16 },
  shape: "dot",
  size: 25,
  color: {
    background: colors.white,
    border: colors.green,
    hover: { background: colors.yellow }
  }
};

export const ENTRY_POINT_STYLE = {
  ...DEAFULT_NODE_STYLE,
  color: {
    background: colors.lime,
    border: colors.green,
    hover: { background: colors.yellow }
  }
};

export const DEFAULT_NETWORK_OPTIONS: Options = {
  physics: false,
  interaction: { hover: true },
  layout: {
    hierarchical: {
      enabled: true,
      nodeSpacing: 200,
      edgeMinimization: false
    }
  }
};

export const DEFAULT_EDGE_STYLE: EdgeOptions = {
  font: {
    face: FONT_FACE,
    size: 24
  },
  arrows: {
    to: {
      enabled: true,
      type: "arrow"
    }
  }
};

export const SELF_REFERENTIAL_EDGE_STYLE: EdgeOptions = {
  color: {
    color: colors.red,
    hover: colors.red,
    highlight: colors.red
  }
};
