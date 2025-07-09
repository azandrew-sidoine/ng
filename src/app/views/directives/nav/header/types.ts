/** @internal Action handler type declaration */
export type ActionHandler = {
  /** @description Handler functional interface method */
  call: () => void | Promise<void>;
};
