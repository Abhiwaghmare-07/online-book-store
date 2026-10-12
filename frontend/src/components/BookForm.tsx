import React, { useState, useEffect } from 'react';
import type { Book, BookFormData } from '../types';

interface BookFormProps {
  editingBook: Book | null;
  onSubmit: (formData: BookFormData) => Promise<void>;
  onCancelEdit: () => void;
  isLoading: boolean;
}

export const BookForm: React.FC<BookFormProps> = ({
  editingBook,
  onSubmit,
  onCancelEdit,
  isLoading,
}) => {
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    price: '',
    category: '',
  });

  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (editingBook) {
      setFormData({
        title: editingBook.title,
        author: editingBook.author,
        price: editingBook.price,
        category: editingBook.category,
      });
      setFormError(null);
    } else {
      setFormData({
        title: '',
        author: '',
        price: '',
        category: '',
      });
      setFormError(null);
    }
  }, [editingBook]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Frontend validations
    if (!formData.title.toString().trim()) {
      setFormError('Please enter a book title.');
      return;
    }
    if (!formData.author.toString().trim()) {
      setFormError('Please enter an author name.');
      return;
    }
    if (
      formData.price === '' ||
      isNaN(Number(formData.price)) ||
      Number(formData.price) < 0
    ) {
      setFormError('Please enter a valid price (0 or greater).');
      return;
    }
    if (!formData.category.toString().trim()) {
      setFormError('Please enter or select a category.');
      return;
    }

    try {
      await onSubmit({
        title: formData.title.toString().trim(),
        author: formData.author.toString().trim(),
        price: Number(formData.price),
        category: formData.category.toString().trim(),
      });

      if (!editingBook) {
        setFormData({
          title: '',
          author: '',
          price: '',
          category: '',
        });
      }
    } catch {
      // Parent component handles notification error
    }
  };

  return (
    <div className="book-form-card">
      <h2 className="form-title">
        {editingBook ? '✏️ Edit Book Details' : '➕ Add a New Book'}
      </h2>

      {formError && <div className="form-error-alert">{formError}</div>}

      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-group">
          <label htmlFor="title">Book Title *</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="e.g. To Kill a Mockingbird"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">Author *</label>
          <input
            id="author"
            name="author"
            type="text"
            placeholder="e.g. Harper Lee"
            value={formData.author}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price ($) *</label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g. 14.99"
              value={formData.price}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <input
              id="category"
              name="category"
              type="text"
              list="category-suggestions"
              placeholder="e.g. Fiction"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
            <datalist id="category-suggestions">
              <option value="Fiction" />
              <option value="Non-Fiction" />
              <option value="Science & Technology" />
              <option value="History" />
              <option value="Biography" />
              <option value="Fantasy" />
              <option value="Mystery" />
              <option value="Computer Science" />
            </datalist>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading
              ? 'Saving...'
              : editingBook
              ? 'Save Changes'
              : 'Add Book'}
          </button>
          {editingBook && (
            <button
              type="button"
              className="btn-secondary"
              onClick={onCancelEdit}
              disabled={isLoading}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
