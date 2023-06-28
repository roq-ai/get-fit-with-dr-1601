import { FunctionalNutritionistInterface } from 'interfaces/functional-nutritionist';
import { PatientInterface } from 'interfaces/patient';
import { GetQueryInterface } from 'interfaces';

export interface MealPlanInterface {
  id?: string;
  name: string;
  description?: string;
  nutritionist_id?: string;
  patient_id?: string;
  created_at?: any;
  updated_at?: any;

  functional_nutritionist?: FunctionalNutritionistInterface;
  patient?: PatientInterface;
  _count?: {};
}

export interface MealPlanGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  description?: string;
  nutritionist_id?: string;
  patient_id?: string;
}
