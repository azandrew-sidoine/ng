import { HeaderActionsComponent } from './actions.component';


export { HeaderAction, HeaderActionsFactory } from './types';
export { HEADER_ACTIONS_FACTORY } from './tokens';

/** @description Exported standalone directives */
export const HEADER_ACTIONS_DIRECTIVES = [HeaderActionsComponent] as const;