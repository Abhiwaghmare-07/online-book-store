import React, { useState, useEffect, useCallback } from 'react';
import type { Book, BookFormData } from './types';
import { getBooks, createBook, updateBook, deleteBook } from './services/api';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { BookForm } from './components/BookForm';
import { BookList } from './components/BookList';
import { Notification, type NotificationState } from './components/Notification';
import './App.css';

export const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  // Fetch books from backend
  const fetchBookList = useCallback(async (searchQuery?: string) => {
    setIsLoading(true);
    try {
      const data = await getBooks(searchQuery);
      setBooks(data);
    } catch (error: any) {
      console.error('Error fetching books:', error);
      const msg =
        error.response?.data?.message ||
        'Could not connect to backend server. Make sure backend is running on port 5000.';
      setNotification({ type: 'error', message: msg });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchBookList();
  }, [fetchBookList]);

  // Handle Search Input Change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value.trim() === '') {
      fetchBookList('');
    }
  };

  // Handle Search Form Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBookList(searchTerm);
  };

  // Clear Search
  const handleClearSearch = () => {
    setSearchTerm('');
    fetchBookList('');
  };

  // Create or Update Book
  const handleFormSubmit = async (formData: BookFormData) => {
    setIsSubmitting(true);
    try {
      if (editingBook) {
        const updated = await updateBook(editingBook._id, formData);
        setNotification({
          type: 'success',
          message: `Book "${updated.title}" updated successfully!`,
        });
        setEditingBook(null);
      } else {
        const created = await createBook(formData);
        setNotification({
          type: 'success',
          message: `Book "${created.title}" added to bookstore!`,
        });
      }
      // Refresh list
      fetchBookList(searchTerm);
    } catch (error: any) {
      console.error('Error saving book:', error);
      const msg =
        error.response?.data?.message ||
        'Failed to save book. Please check your network and fields.';
      setNotification({ type: 'error', message: msg });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Book
  const handleDeleteBook = async (id: string, title: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );
    if (!confirmed) return;

    try {
      await deleteBook(id);
      setNotification({
        type: 'success',
        message: `Book "${title}" deleted successfully!`,
      });
      if (editingBook?._id === id) {
        setEditingBook(null);
      }
      fetchBookList(searchTerm);
    } catch (error: any) {
      console.error('Error deleting book:', error);
      const msg =
        error.response?.data?.message ||
        'Failed to delete book. Please try again.';
      setNotification({ type: 'error', message: msg });
    }
  };

  // Start Edit
  const handleStartEdit = (book: Book) => {
    setEditingBook(book);
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditingBook(null);
  };

  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        <Notification
          notification={notification}
          onClose={() => setNotification(null)}
        />

        <div className="controls-section">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearchSubmit}
            onClearSearch={handleClearSearch}
          />
        </div>

        <div className="content-layout">
          <section className="form-column">
            <BookForm
              editingBook={editingBook}
              onSubmit={handleFormSubmit}
              onCancelEdit={handleCancelEdit}
              isLoading={isSubmitting}
            />
          </section>

          <section className="books-column">
            <BookList
              books={books}
              editingBookId={editingBook?._id}
              onEdit={handleStartEdit}
              onDelete={handleDeleteBook}
              isLoading={isLoading}
              searchTerm={searchTerm}
            />
          </section>
        </div>
      </main>

      <footer className="app-footer">
        <p>Online Book Store &bull; Simple MERN Assignment Project</p>
      </footer>
    </div>
  );
};

export default App;
