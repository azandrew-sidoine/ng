import { DetailColumnViewComponent } from './column-view.component';
import { DetailComponent } from './detail.component';

/** Exported standalone components */
export { DetailComponent } from './detail.component';
export { DetailColumnViewComponent } from './column-view.component';

/** Exported directives */
export const DETAIL_DIRECTIVES = [
  DetailComponent,
  DetailColumnViewComponent,
] as const;
