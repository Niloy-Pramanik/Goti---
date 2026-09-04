# ProKoi - Project Management Tool

**ProKoi** is a modern, team-focused project management system designed to organize your work around organizations, teams, and projects.

> **Status: Phase 1 Completed** 
> 
> The application is currently in its fully functional Phase 1 state. It features a complete Spring Boot + PostgreSQL backend and a Vite + React frontend. 
> *Phase 2 (Milestones, Issues, Progress Logs) is planned for the future.*

## 🚀 Phase 1 Features

- **Authentication & User Management**
  - Secure stateless JWT authentication.
  - User registration and login flows.
- **Organization Management**
  - Create and manage Organizations.
  - Invite and manage Organization Members with role-based access (`ADMIN`, `MEMBER`).
- **Team Management**
  - Group users into Teams within an Organization.
  - Team-specific roles (`LEAD`, `MEMBER`) allowing granular access control.
- **Project Tracking**
  - Create Projects assigned to specific Teams.
  - Store project metadata and link to external resources (Code Repositories, Meeting Links, Storage Links).
  - Edit projects as a Team Lead or Org Admin.

## 🛠 Tech Stack

**Frontend**
- React 18 & Vite
- TypeScript
- Tailwind CSS & Lucide Icons
- React Query (server state) & Zustand (client state)
- React Router

**Backend**
- Java Spring Boot (Stateless REST API)
- Spring Security (JWT-based)
- PostgreSQL (Primary Data Store)
- Flyway (Database Migrations)
- JdbcTemplate (Raw SQL/JDBC)

## 💻 Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- Java 17+
- PostgreSQL (running locally on port `5432` with user `prokoi` and no password by default)

### 1. Database Setup
Create a PostgreSQL database named `prokoi`:
```bash
createdb prokoi -U prokoi
```
*(Note: Flyway migrations will run automatically on application startup to build the Phase 1 schema).*

### 2. Environment Variables
Create a `.env` file in the root directory (you can copy `.env.example` if available) and add your JWT secret:
```env
JWT_SECRET=your_super_secret_jwt_key_that_is_at_least_32_chars_long
```

### 3. Starting the Application
We've included a convenient terminal shortcut to boot both the frontend and backend simultaneously.

From the root of the project, run:
```bash
./start.sh
```

**What this does:**
1. Starts the Spring Boot backend on `http://localhost:8080`.
2. Starts the Vite frontend dev server on `http://localhost:5174`.
3. You can press `CTRL+C` to gracefully shut down both services.

---

## 🏗 Architecture

For a deep dive into the system design, API module boundaries, database schemas, and architectural tradeoffs, please see our detailed [Architecture Document](./Docs/ARCHITECTURE.md).
