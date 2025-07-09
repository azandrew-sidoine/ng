import { BuiltType, TypeOf } from '@azlabsjs/built-type';

/** @description Healthcare type builder declaration */
export const Healthcare = BuiltType._object({
		id: BuiltType._str(),
		reference: BuiltType._str(),
		pat_ipn: BuiltType._str(),
		pat_firstname: BuiltType._str(),
		pat_lastname: BuiltType._str(),
		pat_type_id: BuiltType._num({ coerce: true }),
		pat_birthdate: BuiltType._date({ coerce: true }),
		pat_sex: BuiltType._str(),
		pat_right_holder_type_id: BuiltType._num({ coerce: true }),
		pat_phone_number: BuiltType._str().nullish(),
		company_encoding: BuiltType._str(),
		company_phone_number: BuiltType._str(),
		prescriber_encoding: BuiltType._str(),
		consult_reason_id: BuiltType._num({ coerce: true }).nullish(),
		at: BuiltType._date({ coerce: true }).nullish(),
		status: BuiltType._str(),
		created_by: BuiltType._str().nullish(),
		synchronized: BuiltType._bool({ coerce: true }),
		created_at: BuiltType._date({ coerce: true }),
		updated_at: BuiltType._date({ coerce: true }),
});

/** @description Healthcare type declaration */
export type HealthcareType = TypeOf<typeof Healthcare>;