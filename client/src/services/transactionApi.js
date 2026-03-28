import apiClient from './apiClient';

export const listTransactions = (params) =>
  apiClient.get('/api/transactions', { params }).then((res) => res.data);

export const getTransaction = (id) =>
  apiClient.get(`/api/transactions/${id}`).then((res) => res.data);

export const createTransaction = (payload) =>
  apiClient.post('/api/transactions', payload).then((res) => res.data);

export const updateTransaction = (id, payload) =>
  apiClient.put(`/api/transactions/${id}`, payload).then((res) => res.data);

export const deleteTransaction = (id) =>
  apiClient.delete(`/api/transactions/${id}`).then((res) => res.data);

export const getTransactionSummary = (params) =>
  apiClient.get('/api/transactions/summary', { params }).then((res) => res.data);

export const getTransactionCategories = () =>
  apiClient.get('/api/transactions/categories').then((res) => res.data);
