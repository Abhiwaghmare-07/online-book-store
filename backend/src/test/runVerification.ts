import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import bookRoutes from '../routes/bookRoutes';

const runTests = async () => {
  console.log('--- Starting API Verification Tests ---');

  // 1. Setup in-memory MongoDB
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
  console.log('✓ Connected to in-memory test database');

  // 2. Setup Express test app
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api/books', bookRoutes);

  // Test 1: GET /api/books initially empty
  let res = await request(app).get('/api/books');
  if (res.status !== 200 || !Array.isArray(res.body) || res.body.length !== 0) {
    throw new Error(`Test 1 Failed: status=${res.status}, body=${JSON.stringify(res.body)}`);
  }
  console.log('✓ Test 1: GET /api/books returns empty list on initial database');

  // Test 2: POST /api/books validation failure (missing fields)
  res = await request(app).post('/api/books').send({ title: 'Only Title' });
  if (res.status !== 400) {
    throw new Error(`Test 2 Failed: Expected 400, got ${res.status}`);
  }
  console.log('✓ Test 2: POST /api/books validates missing fields (400)');

  // Test 3: POST /api/books validation failure (negative price)
  res = await request(app).post('/api/books').send({
    title: 'Clean Code',
    author: 'Robert C. Martin',
    price: -5,
    category: 'Software Engineering',
  });
  if (res.status !== 400) {
    throw new Error(`Test 3 Failed: Expected 400, got ${res.status}`);
  }
  console.log('✓ Test 3: POST /api/books validates negative price (400)');

  // Test 4: POST /api/books create valid book
  res = await request(app).post('/api/books').send({
    title: 'Clean Code',
    author: 'Robert C. Martin',
    price: 32.5,
    category: 'Software Engineering',
  });
  if (res.status !== 201 || res.body.title !== 'Clean Code') {
    throw new Error(`Test 4 Failed: Expected 201, got ${res.status}`);
  }
  const book1Id = res.body._id;
  console.log(`✓ Test 4: POST /api/books successfully created book (id: ${book1Id})`);

  // Create another book for search test
  await request(app).post('/api/books').send({
    title: 'The Pragmatic Programmer',
    author: 'David Thomas, Andrew Hunt',
    price: 44.99,
    category: 'Software Engineering',
  });

  // Test 5: GET /api/books returns all books
  res = await request(app).get('/api/books');
  if (res.status !== 200 || res.body.length !== 2) {
    throw new Error(`Test 5 Failed: Expected 2 books, got ${res.body?.length}`);
  }
  console.log('✓ Test 5: GET /api/books returns all books (2 books found)');

  // Test 6: Search books by title
  res = await request(app).get('/api/books?search=Pragmatic');
  if (
    res.status !== 200 ||
    res.body.length !== 1 ||
    !res.body[0].title.includes('Pragmatic')
  ) {
    throw new Error('Test 6 Failed: search filtering did not match');
  }
  console.log('✓ Test 6: GET /api/books?search=Pragmatic successfully filters by title');

  // Test 7: PUT /api/books/:id update book
  res = await request(app)
    .put(`/api/books/${book1Id}`)
    .send({
      title: 'Clean Code: Revised Edition',
      author: 'Robert C. Martin',
      price: 34.99,
      category: 'Computer Science',
    });
  if (
    res.status !== 200 ||
    res.body.price !== 34.99 ||
    res.body.title !== 'Clean Code: Revised Edition'
  ) {
    throw new Error('Test 7 Failed: book update failed');
  }
  console.log('✓ Test 7: PUT /api/books/:id updates book details');

  // Test 8: DELETE /api/books/:id delete book
  res = await request(app).delete(`/api/books/${book1Id}`);
  if (res.status !== 200) {
    throw new Error('Test 8 Failed: delete failed');
  }
  console.log('✓ Test 8: DELETE /api/books/:id deletes book');

  // Test 9: Verify deletion
  res = await request(app).get('/api/books');
  if (res.status !== 200 || res.body.length !== 1) {
    throw new Error('Test 9 Failed: book still present after deletion');
  }
  console.log('✓ Test 9: Verified book count is now 1');

  // Teardown
  await mongoose.disconnect();
  await mongod.stop();
  console.log('--- ALL BACKEND CRUD & SEARCH TESTS PASSED SUCCESSFULLY! ---');
};

runTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
