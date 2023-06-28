import { MealPlanInterface } from 'interfaces/meal-plan';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface PatientInterface {
  id?: string;
  name: string;
  description?: string;
  image?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  meal_plan?: MealPlanInterface[];
  user?: UserInterface;
  _count?: {
    meal_plan?: number;
  };
}

export interface PatientGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  description?: string;
  image?: string;
  user_id?: string;
}
