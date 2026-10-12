import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bookRoutes from './routes/bookRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/online-book-store';

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/books', bookRoutes);

// Root Health Check Route
app.get('/', (_req: Request, res: Response) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    message: 'Online Book Store API is running',
    database: dbConnected ? 'Connected' : 'Disconnected',
    endpoints: {
      getAllBooks: 'GET /api/books',
      searchBooks: 'GET /api/books?search=title',
      getBookById: 'GET /api/books/:id',
      createBook: 'POST /api/books',
      updateBook: 'PUT /api/books/:id',
      deleteBook: 'DELETE /api/books/:id',
    },
  });
});

// 404 Route Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Database Connection & Server Initialization
const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully.');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.warn('Note: To connect to MongoDB Atlas, add your Atlas connection string to backend/.env:');
    console.warn('MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/online-book-store?retryWrites=true&w=majority');
  }
};

startServer();

export default app;
