import { FormConfigInterface } from '@azlabsjs/smart-form-core';

/** @description Type definition of a composed form type */
export type ComposedFormType = {
  name: string;
  label: string;
  form: FormConfigInterface;
};

/** @internal */
type FlexedComposedFormType =
  | [ComposedFormType & { flex: 6 }, ComposedFormType & { flex: 6 }]
  | [
      ComposedFormType & { flex: 4 },
      ComposedFormType & { flex: 4 },
      ComposedFormType & { flex: 4 }
    ]
  | [ComposedFormType & { flex: 12 }];

/** @description Type declaration for a composed form component configuration */
export type ComposedFormConfigType = FlexedComposedFormType[];
