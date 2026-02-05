import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

export const getTransactions = (params) => api.get('/transactions', { params });
export const createTransaction = (data) => api.post('/transactions', data);
export const updateTransaction = (id, data) => api.put(`/transactions/${id}`, data);
export const getSummary = () => api.get('/reports/summary');
export const getChartData = (type) => api.get(`/reports/chart/${type}`);
export const getAccounts = () => api.get('/accounts');
export const createAccount = (data) => api.post('/accounts', data);

export default api;
