import React from 'react';
import type { Book } from '../types';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string, title: string) => void;
  isEditing: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onEdit,
  onDelete,
  isEditing,
}) => {
  return (
    <div className={`book-card ${isEditing ? 'card-editing' : ''}`}>
      <div className="book-card-header">
        <span className="book-category-badge">{book.category}</span>
        <span className="book-price">${Number(book.price).toFixed(2)}</span>
      </div>

      <h3 className="book-title">{book.title}</h3>
      <p className="book-author">By {book.author}</p>

      <div className="book-card-actions">
        <button
          type="button"
          className="btn-edit"
          onClick={() => onEdit(book)}
          title="Edit this book"
        >
          ✏️ Edit
        </button>
        <button
          type="button"
          className="btn-delete"
          onClick={() => onDelete(book._id, book.title)}
          title="Delete this book"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};
