# Online Book Store

A simple, beginner-friendly **Online Book Store** web application built for a college assignment using the **MERN** stack with **TypeScript**.

---

## 🛠️ Technology Stack

- **Frontend:** React 19 with TypeScript, Vite
- **Backend:** Node.js with Express.js and TypeScript
- **Database:** MongoDB Atlas (Mongoose ODM)
- **API Client:** Axios
- **Styling:** Clean, responsive vanilla CSS

---

## 📋 Features

1. **Display All Books:** View book records displayed as responsive cards with Title, Author, Price, and Category.
2. **Add New Book:** Form to add a book with validation for required fields and non-negative prices.
3. **Edit Existing Book:** Click "Edit" on any book to pre-fill the form, update its details, and save changes.
4. **Delete Book:** Delete books with a confirmation prompt.
5. **Search by Title:** Real-time and submit search to filter books instantly by title.
6. **User Feedback:** Clear success and error alert banners for all actions.

---

## 📁 Project Structure

```
online-book-store/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── bookController.ts   # CRUD logic and input validations
│   │   ├── models/
│   │   │   └── Book.ts             # Mongoose schema and TypeScript model
│   │   ├── routes/
│   │   │   └── bookRoutes.ts       # Express router endpoints
│   │   ├── test/
│   │   │   └── runVerification.ts  # End-to-end API test script
│   │   └── server.ts               # Express server setup & DB connection
│   ├── .env.example                # Template for environment variables
│   ├── .gitignore                  # Ignores node_modules, dist, .env
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookCard.tsx        # Book display card with Edit/Delete
│   │   │   ├── BookForm.tsx        # Form for Add & Edit operations
│   │   │   ├── BookList.tsx        # Grid container & empty states
│   │   │   ├── Header.tsx          # Navigation header
│   │   │   ├── Notification.tsx    # Success / error notification banners
│   │   │   └── SearchBar.tsx       # Search bar with clear button
│   │   ├── services/
│   │   │   └── api.ts              # Axios API service
│   │   ├── App.css                 # Clean, responsive layout styling
│   │   ├── App.tsx                 # Main application state and integration
│   │   ├── index.css               # Global CSS variables & reset
│   │   ├── main.tsx                # React entry point
│   │   └── types.ts                # TypeScript interfaces (Book, BookFormData)
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── .gitignore                      # Root git ignore (node_modules, .env, dist)
├── package.json                    # Root package scripts
└── README.md                       # Documentation
```

---

## 🚀 Getting Started & Setup

### Prerequisites
- **Node.js** (v18.0.0 or later)
- **npm** (v9.0.0 or later)
- **MongoDB Atlas** account (or local MongoDB)

---

### Step 1: Clone Repository

```bash
git clone https://github.com/Abhiwaghmare-07/online-book-store.git
cd online-book-store
```

---

### Step 2: Configure Backend Environment

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create your `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` and paste your MongoDB Atlas connection string:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/online-book-store?retryWrites=true&w=majority
   ```
   *(Replace `<username>` and `<password>` with your MongoDB Atlas database user credentials).*

---

### Step 3: Install Dependencies

#### Backend:
```bash
cd backend
npm install
```

#### Frontend:
```bash
cd ../frontend
npm install
```

---

### Step 4: Run the Application

Open **two terminal windows**:

#### Terminal 1 — Start Backend Server:
```bash
cd backend
npm run dev
```
- Backend runs at: `http://localhost:5000`
- Health check: `http://localhost:5000/`

#### Terminal 2 — Start Frontend Application:
```bash
cd frontend
npm run dev
```
- Frontend runs at: `http://localhost:5173`
- Open your browser and navigate to `http://localhost:5173`.

---

## 🔌 REST API Endpoints

| Method | Endpoint | Description | Query / Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/books` | Get all books | `?search=title` (optional) |
| `GET` | `/api/books/:id` | Get single book by ID | None |
| `POST` | `/api/books` | Add a new book | `{ title, author, price, category }` |
| `PUT` | `/api/books/:id` | Update an existing book | `{ title, author, price, category }` |
| `DELETE` | `/api/books/:id` | Delete a book | None |

### Sample Book JSON
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "price": 29.99,
  "category": "Computer Science"
}
```

---

## 🧪 Testing Backend APIs

You can run automated end-to-end tests for all CRUD operations and title search with an in-memory database:

```bash
cd backend
npm test
```
