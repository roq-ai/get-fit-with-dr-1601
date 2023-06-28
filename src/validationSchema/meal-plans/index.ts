import * as yup from 'yup';

export const mealPlanValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  nutritionist_id: yup.string().nullable(),
  patient_id: yup.string().nullable(),
});
