import { HealthcareStatusChange } from '../healthcare-status-changes';
import { HealthcareMedicalPrescriptionProduct } from '../healthcare-medical-prescription-products';
import { HealthcareMedicalPrescriptionDelivery } from '../healthcare-medical-prescription-deliveries';
import { HealthcareDisease } from '../healthcare-diseases';
import { HealthcareMedicalProcedure } from '../healthcare-medical-procedures';
import { HealthcareMedicalPrescription } from '../healthcare-medical-prescriptions';
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
		healthcareStatusChanges: BuiltType._array(HealthcareStatusChange).nullish(),
		prescribedProducts: BuiltType._array(HealthcareMedicalPrescriptionProduct).nullish(),
		healthcareMedicalPrescriptionDeliveries: BuiltType._array(HealthcareMedicalPrescriptionDelivery).nullish(),
		healthcareDiseases: BuiltType._array(HealthcareDisease).nullish(),
		healthcareMedicalProcedures: BuiltType._array(HealthcareMedicalProcedure).nullish(),
		healthcareMedicalPrescriptions: BuiltType._array(HealthcareMedicalPrescription).nullish(),
});

/** @description Healthcare type declaration */
export type HealthcareType = TypeOf<typeof Healthcare>;