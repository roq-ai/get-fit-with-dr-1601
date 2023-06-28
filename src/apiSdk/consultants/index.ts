import axios from 'axios';
import queryString from 'query-string';
import { ConsultantInterface, ConsultantGetQueryInterface } from 'interfaces/consultant';
import { GetQueryInterface } from '../../interfaces';

export const getConsultants = async (query?: ConsultantGetQueryInterface) => {
  const response = await axios.get(`/api/consultants${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createConsultant = async (consultant: ConsultantInterface) => {
  const response = await axios.post('/api/consultants', consultant);
  return response.data;
};

export const updateConsultantById = async (id: string, consultant: ConsultantInterface) => {
  const response = await axios.put(`/api/consultants/${id}`, consultant);
  return response.data;
};

export const getConsultantById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/consultants/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteConsultantById = async (id: string) => {
  const response = await axios.delete(`/api/consultants/${id}`);
  return response.data;
};
