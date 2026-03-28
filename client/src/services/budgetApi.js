import apiClient from './apiClient';

export const getBudget = (params) =>
  apiClient.get('/api/budgets', { params }).then((res) => res.data);

export const upsertBudget = (payload) =>
  apiClient.post('/api/budgets', payload).then((res) => res.data);

export const getBudgetStatus = (params) =>
  apiClient.get('/api/budgets/status', { params }).then((res) => res.data);
