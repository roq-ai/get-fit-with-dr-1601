import axios from 'axios';
import queryString from 'query-string';
import {
  FunctionalNutritionistInterface,
  FunctionalNutritionistGetQueryInterface,
} from 'interfaces/functional-nutritionist';
import { GetQueryInterface } from '../../interfaces';

export const getFunctionalNutritionists = async (query?: FunctionalNutritionistGetQueryInterface) => {
  const response = await axios.get(`/api/functional-nutritionists${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createFunctionalNutritionist = async (functionalNutritionist: FunctionalNutritionistInterface) => {
  const response = await axios.post('/api/functional-nutritionists', functionalNutritionist);
  return response.data;
};

export const updateFunctionalNutritionistById = async (
  id: string,
  functionalNutritionist: FunctionalNutritionistInterface,
) => {
  const response = await axios.put(`/api/functional-nutritionists/${id}`, functionalNutritionist);
  return response.data;
};

export const getFunctionalNutritionistById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(
    `/api/functional-nutritionists/${id}${query ? `?${queryString.stringify(query)}` : ''}`,
  );
  return response.data;
};

export const deleteFunctionalNutritionistById = async (id: string) => {
  const response = await axios.delete(`/api/functional-nutritionists/${id}`);
  return response.data;
};
