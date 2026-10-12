import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Book } from '../models/Book';

const checkDatabaseConnection = (res: Response): boolean => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      message:
        'Database is not connected. Please verify your MongoDB Atlas connection string in backend/.env',
    });
    return false;
  }
  return true;
};

// GET /api/books (supports ?search= or ?title=)
export const getBooks = async (req: Request, res: Response): Promise<void> => {
  if (!checkDatabaseConnection(res)) return;

  try {
    const search = (req.query.search || req.query.title) as string | undefined;
    let filter = {};

    if (search && search.trim() !== '') {
      filter = {
        title: { $regex: search.trim(), $options: 'i' },
      };
    }

    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Failed to fetch books from database.' });
  }
};

// GET /api/books/:id
export const getBookById = async (req: Request, res: Response): Promise<void> => {
  if (!checkDatabaseConnection(res)) return;

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid book ID format.' });
      return;
    }

    const book = await Book.findById(id);
    if (!book) {
      res.status(404).json({ message: 'Book not found.' });
      return;
    }

    res.status(200).json(book);
  } catch (error) {
    console.error('Error fetching book by ID:', error);
    res.status(500).json({ message: 'Failed to fetch book details.' });
  }
};

// POST /api/books
export const createBook = async (req: Request, res: Response): Promise<void> => {
  if (!checkDatabaseConnection(res)) return;

  try {
    const { title, author, price, category } = req.body;

    // Field existence check
    if (!title || !author || price === undefined || price === null || !category) {
      res.status(400).json({
        message: 'All fields (title, author, price, and category) are required.',
      });
      return;
    }

    // String validation
    if (typeof title !== 'string' || !title.trim()) {
      res.status(400).json({ message: 'Title must be a non-empty text.' });
      return;
    }
    if (typeof author !== 'string' || !author.trim()) {
      res.status(400).json({ message: 'Author must be a non-empty text.' });
      return;
    }
    if (typeof category !== 'string' || !category.trim()) {
      res.status(400).json({ message: 'Category must be a non-empty text.' });
      return;
    }

    // Price validation
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      res.status(400).json({
        message: 'Price must be a valid non-negative number.',
      });
      return;
    }

    const newBook = new Book({
      title: title.trim(),
      author: author.trim(),
      price: numPrice,
      category: category.trim(),
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ message: 'Failed to add new book.' });
  }
};

// PUT /api/books/:id
export const updateBook = async (req: Request, res: Response): Promise<void> => {
  if (!checkDatabaseConnection(res)) return;

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid book ID format.' });
      return;
    }

    const { title, author, price, category } = req.body;

    if (!title || !author || price === undefined || price === null || !category) {
      res.status(400).json({
        message: 'All fields (title, author, price, and category) are required.',
      });
      return;
    }

    if (typeof title !== 'string' || !title.trim()) {
      res.status(400).json({ message: 'Title must be a non-empty text.' });
      return;
    }
    if (typeof author !== 'string' || !author.trim()) {
      res.status(400).json({ message: 'Author must be a non-empty text.' });
      return;
    }
    if (typeof category !== 'string' || !category.trim()) {
      res.status(400).json({ message: 'Category must be a non-empty text.' });
      return;
    }

    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice < 0) {
      res.status(400).json({
        message: 'Price must be a valid non-negative number.',
      });
      return;
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        author: author.trim(),
        price: numPrice,
        category: category.trim(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      res.status(404).json({ message: 'Book not found.' });
      return;
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Failed to update book.' });
  }
};

// DELETE /api/books/:id
export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  if (!checkDatabaseConnection(res)) return;

  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid book ID format.' });
      return;
    }

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      res.status(404).json({ message: 'Book not found.' });
      return;
    }

    res.status(200).json({ message: 'Book deleted successfully.', id });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Failed to delete book.' });
  }
};
