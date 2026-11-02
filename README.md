# Student API (Node + Express + MongoDB Atlas)

CRUD REST API built with Express and Mongoose, tested with Postman.

## Structure

```
config/db.js                     MongoDB connection
models/Student.js                Mongoose model
controllers/studentController.js CRUD logic
routes/studentRoutes.js          Route definitions
server.js                        App entry point
```

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in `MONGO_URI` (Atlas -> Connect -> Drivers).
   In Atlas -> Network Access, add your IP address.
3. `npm run dev` (or `npm start`) - server runs on http://localhost:5000

## Endpoints

| Method | Route               | Description        |
|--------|---------------------|--------------------|
| POST   | /api/students       | Create a student   |
| GET    | /api/students       | List all students  |
| GET    | /api/students/:id   | Get one student    |
| PUT    | /api/students/:id   | Update a student   |
| DELETE | /api/students/:id   | Delete a student   |

Student body: `{ "name": "...", "email": "...", "age": 21, "course": "..." }` (`name` and `email` required, email unique).

## Testing with Postman

Import the "Student API - CRUD" collection (included as `postman/Student-API.postman_collection.json`, also in your Postman workspace).
Run **Create Student** first - it stores `studentId` for the other requests.
