import { ComposedFormComponent } from './composed';
import { ModalComponent } from './modal/modal.component';

/** Exported standalone directives */
export const FORM_MODAL_DIRECTIVES = [ModalComponent] as const;

/** Exported standalone directives */
export const COMPOSED_FORM_DIRECTIVES = [ComposedFormComponent] as const;

/** Exported standalone form directives  */
export const FORM_DIRECTIVES = [ModalComponent, ComposedFormComponent] as const;

/** @description Exported type declarations */
export * from './modal';
export * from './composed';
