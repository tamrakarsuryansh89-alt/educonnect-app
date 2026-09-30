# EduConnect

EduConnect is a full-stack online tutoring platform that connects students with subject-expert tutors. It provides three separate, role-based portals — **Student**, **Tutor**, and **Admin** — each with its own dashboard tailored to that user's needs.

---

## ✨ Features

### Student Portal
- Browse and search tutors by subject
- View assigned tutor's profile
- See upcoming and completed sessions in a timeline view
- Track learning progress

### Tutor Portal
- Manage assigned students
- Schedule new tutoring sessions
- View and manage upcoming/completed sessions

### Admin Panel
- Full visibility into all students, tutors, and sessions
- Manage and delete meetings across the platform
- Platform-wide statistics overview

### General
- Clean, modern dark-themed UI built from scratch
- Role-based dashboards with separate navigation for each user type
- Demo login credentials for quick testing

---

## 🛠 Tech Stack

**Frontend**
- React 19
- Vite
- Plain CSS (custom design system using CSS variables)

**Backend**
- Node.js
- Express 5
- MongoDB with Mongoose (ODM)

---

## 📁 Project Structure

```
educonnect/
├── educonnect-app/        # Frontend (React + Vite)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── ...
│   └── package.json
│
├── backend/                # Backend (Express + MongoDB)
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

Clone the repository:
```bash
git clone <your-repo-url>
```

**Install frontend dependencies:**
```bash
cd educonnect-app
npm install
```

**Install backend dependencies:**
```bash
cd backend
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend` folder (if not already present) with:

```
MONGO_URI=mongodb://127.0.0.1:27017/educonnect
PORT=5000
```

> Currently, the MongoDB connection string is hard-coded directly in the backend's `index.js`. Moving it into a `.env` file is a recommended next step.

---

## ▶️ Running the Project

**Backend:**
```bash
cd backend
node index.js
```
Server runs on `http://localhost:5000`

**Frontend:**
```bash
cd educonnect-app
npm run dev
```
App runs on `http://localhost:5173` (default Vite port)

---

## 🧪 Demo Credentials

| Role    | Email                      | Password   |
|---------|-----------------------------|------------|
| Student | rahul@student.com          | pass123    |
| Tutor   | amit@tutor.com              | tutor123   |
| Admin   | admin@educonnect.com        | admin@123  |

---

## 📌 Current Status & Notes

This project is under active development, with both frontend and backend deployed and connected. A few honest notes for anyone reviewing the code:

- The frontend communicates with the backend via Axios — registration and user data are sent to the Express API and persisted in MongoDB through Mongoose.
- Authentication (JWT) and password hashing are not yet implemented — demo/local testing only for now.
- The backend currently has a `User` model; models for meetings, tutor profiles, and announcements are planned next.

---

## 🚀 Future Improvements

- [ ] Add JWT-based authentication and bcrypt password hashing
- [ ] Add Mongoose models for Meetings, Tutor profiles, and Announcements
- [ ] Role-based API route protection
- [ ] Real-time session reminders and notifications
- [ ] Move MongoDB connection string into `.env` for better config management

---

## 📄 License

This project is open for personal and educational use.
