# 📋 Team Task Manager

A full-stack web application for managing projects and tasks with role-based access control (Admin/Member).

🔗 **Live URL:** [teamtaskmanager-production-c399.up.railway.app](teamtaskmanager-production-c399.up.railway.app)
🎥 **Demo Video:** [https://drive.google.com/file/d/1lXnnzXhOmrH0jPbmIfGrL2loGR4jm4ZL/view?usp=sharing]  
💻 **GitHub:** [https://github.com/Trishithareddy/team-task-manager](https://github.com/Trishithareddy/team-task-manager)

---

## ✨ Features

### Admin
- Register/Login with JWT authentication
- Create & manage projects
- Add members to projects
- Create & assign tasks with due dates
- Dashboard with stats: Total, To Do, In Progress, Completed, Overdue tasks
- Delete projects and tasks

### Member
- Register/Login
- View assigned tasks
- Update task status (To Do → In Progress → Completed)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcryptjs |
| Deployment | Railway |

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free)
- Git

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGO_URI and JWT_SECRET in .env
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Environment Variables (backend/.env)
```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/teamtaskmanager
JWT_SECRET=your_secret_key
PORT=5000
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/auth/register | Public | Register user |
| POST | /api/auth/login | Public | Login user |
| GET | /api/auth/me | Protected | Get current user |

### Projects
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/projects | Protected | Get all/own projects |
| POST | /api/projects | Admin | Create project |
| PUT | /api/projects/:id | Admin | Update project |
| DELETE | /api/projects/:id | Admin | Delete project |

### Tasks
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/tasks | Protected | Get all/assigned tasks |
| GET | /api/tasks/dashboard | Admin | Get dashboard stats |
| POST | /api/tasks | Admin | Create task |
| PUT | /api/tasks/:id | Protected | Update task/status |
| DELETE | /api/tasks/:id | Admin | Delete task |

### Users
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/users | Admin | Get all users |

---

## 🗂️ Folder Structure

```
team-task-manager/
├── backend/
│   ├── config/        # DB connection
│   ├── controllers/   # Business logic
│   ├── middleware/    # Auth & role guards
│   ├── models/        # Mongoose schemas
│   ├── routes/        # Express routes
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/  # Navbar
│       ├── context/     # Auth context
│       ├── pages/       # Login, Register, Dashboard, Projects, Tasks
│       └── utils/       # Axios API calls
└── README.md
