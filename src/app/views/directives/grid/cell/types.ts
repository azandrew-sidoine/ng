/** @description Cell mode type declaration */
export type CellModeType = 'edit' | 'view';

/** @description Cell navigation direction */
export type NavigationDirectionType = 'backward' | 'forward' | 'top' | 'down';

/** @description Cell selection change type declaration */
export type SelectionChangeType = {
  mode: CellModeType;
  index: number;
  direction: NavigationDirectionType;
};
