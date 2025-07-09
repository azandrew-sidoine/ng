import {
  FormConfigInterface,
  TextInput,
  //   NumberInput,
  DateInput,
  InputGroup,
  OptionsInputConfigInterface,
  InputConfigInterface,
} from '@azlabsjs/smart-form-core';

/** Exported module form configuration */
export const form = {
  //id: ,
  title: 'app.modules.healthcares.form.title',
  method: 'POST',
  controlConfigs: [
    {
      label: '',
      name: 'pat_header',
      type: 'html',
      classes: 'control__group__header',
      placeholder: '...',
      value: 'app.modules.healthcares.form.headers.patient',
      containerClass: 'input-col-sm-12 input-col-md-12',
      constraints: {
        required: false,
        disabled: false,
      },
    } as InputConfigInterface,
    {
      label: 'app.modules.healthcares.columns.pat_ipn',
      name: 'pat_ipn',
      type: 'text',
      classes: 'clr-input',
      placeholder: '...',
      value: null,
      description: '', // TODO: Add input description
      index: undefined,
      isRepeatable: false,
      containerClass: 'input-col-sm-12 input-col-md-12',
      constraints: {
        required: true,
        disabled: false,
        email: false,
        min: 1,
        max: 45,
      },
    } as TextInput,
    {
      label: 'app.modules.healthcares.columns.pat_type_id',
      name: 'pat_type_id',
      type: 'select',
      classes: 'clr-input',
      placeholder: '...',
      value: null,
      description: '', // TODO: Add input description
      index: undefined,
      isRepeatable: false,
      containerClass: 'input-col-sm-12 input-col-md-12',
      //# TODO: Provide list of possible options or use `optionsConfig` property to query data from backend source
      options: [],
      //optionsConfig: { source: { resource: 'http://localhost'}},
      constraints: {
        required: true,
        disabled: false,
        min: 1,
      },
    } as OptionsInputConfigInterface,
    {
      label: 'app.modules.healthcares.columns.pat_firstname',
      name: 'pat_firstname',
      type: 'text',
      classes: 'clr-input',
      placeholder: '...',
      value: null,
      description: '', // TODO: Add input description
      index: undefined,
      isRepeatable: false,
      containerClass: 'input-col-sm-12 input-col-md-6',
      constraints: {
        required: true,
        disabled: false,
        email: false,
        min: 1,
        max: 100,
      },
    } as TextInput,
    {
      label: 'app.modules.healthcares.columns.pat_lastname',
      name: 'pat_lastname',
      type: 'text',
      classes: 'clr-input',
      placeholder: '...',
      value: null,
      description: '', // TODO: Add input description
      index: undefined,
      isRepeatable: false,
      containerClass: 'input-col-sm-12 input-col-md-6',
      constraints: {
        required: true,
        disabled: false,
        email: false,
        min: 1,
        max: 100,
      },
    } as TextInput,
    {
      label: 'app.modules.healthcares.columns.pat_birthdate',
      name: 'pat_birthdate',
      type: 'date',
      classes: 'clr-input',
      placeholder: '...',
      value: null,
      description: '', // TODO: Add input description
      index: undefined,
      isRepeatable: false,
      containerClass: 'input-col-sm-12 input-col-md-6',
      constraints: {
        required: true,
        disabled: false,
      },
    } as DateInput,
    {
      label: 'app.modules.healthcares.columns.pat_sex',
      name: 'pat_sex',
      type: 'text',
      classes: 'clr-input',
      placeholder: '...',
      value: null,
      description: '', // TODO: Add input description
      index: undefined,
      isRepeatable: false,
      containerClass: 'input-col-sm-12 input-col-md-6',
      constraints: {
        required: true,
        disabled: false,
        email: false,
        min: 1,
        max: 1,
      },
    } as TextInput,
    {
      label: 'app.modules.healthcares.columns.pat_right_holder_type_id',
      name: 'pat_right_holder_type_id',
      type: 'select',
      classes: 'clr-input',
      placeholder: '...',
      value: null,
      description: '', // TODO: Add input description
      index: undefined,
      isRepeatable: false,
      containerClass: 'input-col-sm-12 input-col-md-12',
      //# TODO: Provide list of possible options or use `optionsConfig` property to query data from backend source
      options: [],
      //optionsConfig: { source: { resource: 'http://localhost'}},
      constraints: {
        required: true,
        disabled: false,
        min: 1,
      },
    } as OptionsInputConfigInterface,
    {
      label: 'app.modules.healthcares.columns.pat_phone_number',
      name: 'pat_phone_number',
      type: 'text',
      classes: 'clr-input',
      placeholder: '...',
      value: null,
      description: '', // TODO: Add input description
      index: undefined,
      isRepeatable: false,
      containerClass: 'input-col-sm-12',
      constraints: {
        required: false,
        disabled: false,
        email: false,
        max: 20,
      },
    } as TextInput,
    {
      label: 'app.modules.healthcares.columns.consult_reason_id',
      name: 'consult_reason_id',
      type: 'select',
      classes: 'clr-input',
      placeholder: '...',
      value: null,
      description: '', // TODO: Add input description
      index: undefined,
      isRepeatable: false,
      containerClass: 'input-col-sm-12',
      //# TODO: Provide list of possible options or use `optionsConfig` property to query data from backend source
      options: [],
      //optionsConfig: { source: { resource: 'http://localhost'}},
      constraints: {
        required: false,
        disabled: false,
      },
    } as OptionsInputConfigInterface,
    {
      label: '',
      name: 'company_header',
      type: 'html',
      classes: 'control__group__header',
      placeholder: '...',
      value: 'app.modules.healthcares.form.headers.company',
      containerClass: 'input-col-sm-12 input-col-md-12',
      constraints: {
        required: false,
        disabled: false,
      },
    } as InputConfigInterface,
    {
      label: 'app.modules.healthcares.columns.prescriber_encoding',
      name: 'prescriber_encoding',
      type: 'text',
      classes: 'clr-input',
      placeholder: '...',
      value: null,
      description: '', // TODO: Add input description
      index: undefined,
      isRepeatable: false,
      containerClass: 'input-col-sm-12 input-col-md-4',
      constraints: {
        required: true,
        disabled: false,
        email: false,
        min: 1,
        max: 45,
      },
    } as TextInput,
    {
      label: 'app.modules.healthcares.columns.company_encoding',
      name: 'company_encoding',
      type: 'text',
      classes: 'clr-input',
      placeholder: '...',
      value: null,
      description: '', // TODO: Add input description
      index: undefined,
      isRepeatable: false,
      containerClass: 'input-col-sm-12 input-col-md-4',
      constraints: {
        required: true,
        disabled: false,
        email: false,
        min: 1,
        max: 45,
      },
    } as TextInput,
    {
      label: 'app.modules.healthcares.columns.company_phone_number',
      name: 'company_phone_number',
      type: 'text',
      classes: 'clr-input',
      placeholder: '...',
      value: null,
      description: '', // TODO: Add input description
      index: undefined,
      isRepeatable: false,
      containerClass: 'input-col-sm-12 input-col-md-4',
      constraints: {
        required: true,
        disabled: false,
        email: false,
        min: 1,
        max: 45,
      },
    } as TextInput,
    // {
    //   label: 'app.modules.healthcares.columns.at',
    //   name: 'at',
    //   type: 'date',
    //   classes: 'clr-input',
    //   placeholder: '...',
    //   value: null,
    //   description: '', // TODO: Add input description
    //   index: undefined,
    //   isRepeatable: false,
    //   containerClass: 'input-col-sm-12',
    //   constraints: {
    //     required: false,
    //     disabled: false,
    //   },
    // } as DateInput,
    // {
    //   label:
    //     'app.modules.healthcares.columns.healthcareMedicalPrescriptionDeliveries',
    //   name: 'healthcareMedicalPrescriptionDeliveries',
    //   type: 'control_group',
    //   classes: 'controls-header table',
    //   placeholder: '...',
    //   value: null,
    //   description: '', // TODO: Add input description
    //   index: undefined,
    //   isRepeatable: true,
    //   containerClass: 'input-col-sm-12',
    //   children: healthcareMedicalPrescriptionDeliveriesInputConfigs,
    //   constraints: {
    //     required: false,
    //     disabled: false,
    //   },
    // } as InputGroup,
  ],
} as FormConfigInterface;

/** Exported form factory function */
export function createFormConfig(url: string, method: string = 'POST') {
  return { ...form, endpointURL: url, method } as FormConfigInterface;
}

/** Exported inputs configurations */
export const healthcaresInputConfigs = form.controlConfigs;
