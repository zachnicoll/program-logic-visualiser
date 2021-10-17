import { LogicNodeType } from "parser/types";
import colors from "styles/colors";
import { EdgeOptions, Options, NodeOptions } from "vis-network/standalone";

export const FONT_FACE = "Overpass Mono";

export const DEAFULT_NODE_STYLE: NodeOptions = {
  font: { face: FONT_FACE, size: 16 },
  shape: "dot",
  size: 25,
  color: {
    background: colors.white,
    border: colors.green,
    hover: { background: colors.green }
  }
};

export const DISABLED_NODE_STYLE: NodeOptions = {
  color: {
    background: colors.white,
    border: colors.grey,
    hover: { background: colors.grey }
  }
};

export const ENTRY_POINT_STYLE = {
  ...DEAFULT_NODE_STYLE,
  color: {
    background: colors.lime,
    border: colors.green,
    hover: { background: colors.green }
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

export const DEFAULT_DIAGRAM_OPTIONS: Options = {
  physics: false,
  interaction: { hover: true },
  layout: {
    hierarchical: {
      enabled: true,
      nodeSpacing: 200,
      edgeMinimization: false,
      sortMethod: "directed",
      direction: "LR"
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
  },
  color: {
    color: colors.green,
    hover: colors.green
  },
  smooth: {
    enabled: false,
    type: "continuous",
    roundness: 0
  }
};

export const DISABLED_EDGE_STYLE: EdgeOptions = {
  color: {
    color: colors.grey,
    hover: colors.grey
  }
};

export const SELF_REFERENTIAL_EDGE_STYLE: EdgeOptions = {
  color: {
    color: colors.red,
    hover: colors.red,
    highlight: colors.red
  }
};

export const DIAGRAM_NODE_TYPE_MAP: Record<LogicNodeType, NodeOptions> = {
  [LogicNodeType.START]: {
    color: {
      background: colors.lime,
      border: colors.green,
      hover: { background: colors.lime }
    },
    shape: "hexagon"
  },
  [LogicNodeType.STOP]: {
    color: {
      background: colors.red,
      border: colors.red,
      hover: { background: colors.red }
    },
    shape: "hexagon"
  },
  [LogicNodeType.DECISION]: {
    color: {
      background: colors.purple,
      border: colors.black,
      hover: { background: colors.purple }
    },
    shape: "diamond"
  },
  [LogicNodeType.PROCESS]: {
    color: {
      background: colors.yellow,
      border: colors.black,
      hover: { background: colors.yellow }
    },
    shape: "square"
  },
  [LogicNodeType.TERMINAL]: {
    color: {
      background: colors.white,
      border: colors.green,
      hover: { background: colors.green }
    },
    shape: "dot"
  }
};
