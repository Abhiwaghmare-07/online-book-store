import axios from 'axios';
import type { Book, BookFormData } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getBooks = async (searchQuery?: string): Promise<Book[]> => {
  const params = searchQuery && searchQuery.trim() ? { search: searchQuery.trim() } : {};
  const response = await api.get<Book[]>('/books', { params });
  return response.data;
};

export const createBook = async (bookData: BookFormData): Promise<Book> => {
  const response = await api.post<Book>('/books', bookData);
  return response.data;
};

export const updateBook = async (id: string, bookData: BookFormData): Promise<Book> => {
  const response = await api.put<Book>(`/books/${id}`, bookData);
  return response.data;
};

export const deleteBook = async (id: string): Promise<void> => {
  await api.delete(`/books/${id}`);
};

export default api;
