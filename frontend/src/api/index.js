import axios from 'axios';

// Base URL: uses REACT_APP_API_URL env variable in production,
// falls back to localhost for local development
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Base Axios instance pointing to Spring Boot backend
const API = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirect to login on 401 Unauthorized
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===== AUTH =====
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

// ===== BOOKS =====
export const getAllBooks = () => API.get('/books');
export const getBookById = (id) => API.get(`/books/${id}`);
export const searchBooks = (q) => API.get(`/books/search?q=${q}`);
export const getBooksByCategory = (cat) => API.get(`/books/category/${cat}`);
export const addBook = (data) => API.post('/books', data);
export const updateBook = (id, data) => API.put(`/books/${id}`, data);
export const deleteBook = (id) => API.delete(`/books/${id}`);

// ===== TRANSACTIONS =====
export const issueBook = (userId, bookId) =>
  API.post(`/transactions/issue?userId=${userId}&bookId=${bookId}`);
export const returnBook = (transactionId) =>
  API.put(`/transactions/${transactionId}/return`);
export const getUserTransactions = (userId) =>
  API.get(`/transactions/user/${userId}`);
export const getAllTransactions = () => API.get('/transactions');
export const getOverdueTransactions = () => API.get('/transactions/overdue');

// ===== USERS =====
export const getAllUsers = () => API.get('/users');
export const getUserById = (id) => API.get(`/users/${id}`);

export default API;
