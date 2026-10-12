import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bookRoutes from './routes/bookRoutes';
import { Book } from './models/Book';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || '';

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

// Seed helper
const seedSampleBooksIfEmpty = async () => {
  try {
    const count = await Book.countDocuments();
    if (count === 0) {
      await Book.insertMany([
        {
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          price: 10.99,
          category: 'Classic Fiction',
        },
        {
          title: 'To Kill a Mockingbird',
          author: 'Harper Lee',
          price: 12.5,
          category: 'Fiction',
        },
        {
          title: 'Clean Code',
          author: 'Robert C. Martin',
          price: 32.0,
          category: 'Computer Science',
        },
      ]);
      console.log('Sample books seeded into database.');
    }
  } catch (seedErr) {
    console.error('Error seeding sample books:', seedErr);
  }
};

// Database Connection & Server Initialization
const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });

  const isPlaceholder =
    !MONGODB_URI ||
    MONGODB_URI.includes('<username>') ||
    MONGODB_URI.includes('<password>');

  if (!isPlaceholder) {
    try {
      console.log('Connecting to MongoDB Atlas...');
      await mongoose.connect(MONGODB_URI);
      console.log('Connected to MongoDB Atlas successfully.');
      await seedSampleBooksIfEmpty();
      return;
    } catch (error) {
      console.warn(
        'MongoDB Atlas connection failed. Falling back to in-memory database for local testing:',
        error
      );
    }
  } else {
    console.log(
      'No MongoDB Atlas credentials provided in backend/.env. Initializing local in-memory MongoDB for testing...'
    );
  }

  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log(
      'Connected to in-memory MongoDB successfully! (Data will persist while server runs)'
    );
    await seedSampleBooksIfEmpty();
  } catch (err) {
    console.error('Failed to initialize in-memory MongoDB fallback:', err);
  }
};

startServer();

export default app;
