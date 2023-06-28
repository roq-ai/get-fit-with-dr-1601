const mapping: Record<string, string> = {
  consultants: 'consultant',
  'functional-nutritionists': 'functional_nutritionist',
  'meal-plans': 'meal_plan',
  patients: 'patient',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
