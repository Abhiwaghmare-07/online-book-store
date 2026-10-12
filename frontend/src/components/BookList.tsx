import React from 'react';
import type { Book } from '../types';
import { BookCard } from './BookCard';

interface BookListProps {
  books: Book[];
  editingBookId?: string | null;
  onEdit: (book: Book) => void;
  onDelete: (id: string, title: string) => void;
  isLoading: boolean;
  searchTerm: string;
}

export const BookList: React.FC<BookListProps> = ({
  books,
  editingBookId,
  onEdit,
  onDelete,
  isLoading,
  searchTerm,
}) => {
  if (isLoading) {
    return (
      <div className="books-loading">
        <div className="spinner"></div>
        <p>Loading books from database...</p>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="empty-books-state">
        <div className="empty-icon">📚</div>
        <h3>No Books Found</h3>
        {searchTerm ? (
          <p>
            No books found matching <strong>"{searchTerm}"</strong>. Try a different search title.
          </p>
        ) : (
          <p>Your collection is empty right now. Add your first book using the form above!</p>
        )}
      </div>
    );
  }

  return (
    <div className="book-list-container">
      <div className="book-list-header">
        <h2>
          All Books <span className="book-count">({books.length})</span>
        </h2>
        {searchTerm && (
          <span className="search-filter-tag">
            Filtering by: "{searchTerm}"
          </span>
        )}
      </div>

      <div className="books-grid">
        {books.map((book) => (
          <BookCard
            key={book._id}
            book={book}
            onEdit={onEdit}
            onDelete={onDelete}
            isEditing={editingBookId === book._id}
          />
        ))}
      </div>
    </div>
  );
};
