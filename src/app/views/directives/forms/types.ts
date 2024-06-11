import { ReactiveFormComponentInterface } from '@azlabsjs/ngx-smart-form';
import { ModalElement } from '../modal';

/** @description Form modal element type declaration */
export type FormModalElement = ModalElement & {
  formRef: ReactiveFormComponentInterface | null;
};
