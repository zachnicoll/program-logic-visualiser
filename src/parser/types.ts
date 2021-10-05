/* eslint-disable no-use-before-define */

type FunctionCallGraphCalledBy = {
  name: string;
  calls: FunctionCallGraph[];
  isCalledBy: string;
};

type IsConditionallyCalled = {
  conditionallyCalled: true;
  callCondition: string;
};

type IsNotConditionallyCalled = {
  conditionallyCalled: false;
};

export type FunctionCallGraph =
  | {
      width?: number;
    } & (
      | {
          name: string;
          calls: FunctionCallGraph[];
        }
      | (FunctionCallGraphCalledBy &
          (IsNotConditionallyCalled | IsConditionallyCalled))
    );
