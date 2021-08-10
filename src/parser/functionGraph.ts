import { FunctionDeclarationMap } from './tokenize';

type FunctionCallGraph = {
  name: string;
  calls: FunctionCallGraph[];
} | {
  name: string;
  calls: FunctionCallGraph[];
  isCalledBy: string;
  conditionallyCalled: boolean;
  callCondition?: string;
}

const functionGraph = (functionDeclarations: FunctionDeclarationMap): FunctionCallGraph => {
  
};

export default functionGraph;
