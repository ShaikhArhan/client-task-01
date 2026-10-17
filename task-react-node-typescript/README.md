# React + Node Student Registration App

This project implements the login and student registration workflow defined in the task document, with a two-level encryption model and full CRUD support.

## Tech stack

Frontend:
- React + TypeScript
- Redux Toolkit
- Formik
- Zod
- Axios
- CryptoJS

Backend:
- Node.js + Express
- TypeScript
- Mongoose
- MongoDB
- body-parser
- dotenv

## Project structure

```text
project/
├── client/                  # React frontend
│   ├── src/
│   ├── package.json
│   └── .env.example
├── server/                  # Express backend
│   ├── src/
│   ├── package.json
│   └── .env.example
├── README.md
└── .gitignore
```

## Setup instructions

1. Open a terminal in the project root.
2. Install frontend dependencies:

```bash
cd client
npm install
```

3. Install backend dependencies:

```bash
cd ../server
npm install
```

4. Configure environment variables by creating `.env` files from the examples:

```bash
cp .env.example .env
```

For the frontend, set:

```env
VITE_API_URL=http://localhost:5000/api
VITE_FRONTEND_SECRET=student_frontend_secret
```

For the backend, set:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/
MONGODB_DB=student-db
FRONTEND_SECRET=student_frontend_secret
BACKEND_SECRET=student_backend_secret
```

5. Start MongoDB locally.
6. Start the backend:

```bash
cd server
npm run dev
```

7. Start the frontend:

```bash
cd client
npm run dev
```

8. Open the frontend URL shown in the terminal, usually `http://localhost:5173`.

## Encryption flow

The application uses a two-layer encryption approach:

- Frontend encrypts user-submitted values before sending them to the backend.
- Backend decrypts one layer before validation and then applies a second encryption before storing in MongoDB.
- While returning data, the backend decrypts its stored encryption and sends the result as encrypted data to the frontend.
- The frontend decrypts the second layer before displaying values to the user.

This is implemented for the required login and student record data flow.

## API routes

- `POST /api/register` – Create student
- `GET /api/students` – Get all students
- `PUT /api/student/:id` – Update student
- `DELETE /api/student/:id` – Delete student
- `POST /api/login` – Login with email and password

## Notes

- If MongoDB is not running, the backend will fail to connect until the database is started.
- The frontend includes Redux Toolkit state management for all student CRUD actions and login flow.
