import axios from 'axios';
import type { User, Relationship, VibeCheckResponse, VibesResponse } from '../types';
import type { Vibe } from '../types';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});

export const getCsrfCookie = () => api.get('/sanctum/csrf-cookie');

export const registerUser = (data: Omit<User, 'id'>) => {
  return api.post('/auth/register', data);
};

export const loginUser = (data: Pick<User, 'email' | 'password'>) => {
  return api.post('/auth/login', data);
};

export const logoutUser = () => {
  return api.post('/auth/logout');
};

export const submitVibe = (data: Omit<Vibe, 'id' | 'date' | 'user_id'>) => {
  return api.post('/vibes', data);
};

export const checkVibeSubmission = () => {
  return api.get<VibeCheckResponse>('/vibes/check');
};

export const createRelationship = () => {
  return api.post<Relationship>('/relationships');
};

export const joinRelationship = (code: string) => {
  return api.post<Relationship>('/relationships/join', { code });
};

export const getVibes = (relationshipId: number) => {
  return api.get<VibesResponse[]>(`/vibes/${relationshipId}`);
};

export const getMyRelationship = () => {
  return api.get<Relationship>('/relationships/mine');
};

export default api;
