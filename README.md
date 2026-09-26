# Goti — Project Management System

**Goti** is a modern, team-focused project management system designed to organize your work around organizations, teams, and projects. It features milestone tracking, issue management, time tracking, and an activity inbox layered on top of a resilient enterprise-grade architecture.

> **Status: Phase 1 & Phase 2 Complete**
>
> The application has a complete Spring Boot + PostgreSQL backend and a Vite + React frontend, covering the full workspace hierarchy (Organizations → Teams → Projects) as well as milestone/issue tracking, progress logging, email-based invitations, time tracking, and a notifications inbox. See the [Roadmap](#-roadmap) below for upcoming features.

---

## 🚀 Features

### Authentication & User Management
- **Security-First:** Stateless JWT authentication with BCrypt password hashing.
- **Onboarding:** Seamless user registration and login flows.

### Organization & Team Management
- **Hierarchical Workspaces:** Create and manage Organizations, and group users into Teams.
- **Granular Access Control:** Role-based access for both Organizations (`ADMIN`, `MEMBER`) and Teams (`LEAD`, `MEMBER`).
- **SMTP Invitations:** Email-based invitations with role assignment. Invite links are sent securely via real SMTP for both Org-level and Team-level access.

### Project & Delivery Tracking (Phase 2)
- **Projects:** Create Projects assigned to specific Teams. Store project metadata and link to external resources (Code Repository, Meeting Link, Storage Link). Full project editing capabilities are supported for Team Leads.
- **Milestones:** Group issues under deliverable phases, with progress automatically calculated from linked issue completion.
- **Issues (Kanban):** Issues support a `TO_DO` → `IN_PROGRESS` → `DONE` lifecycle, team member assignment, and a Kanban board view.
- **Blocker Tracking:** Progress and delay logging per issue for tracking blockers effectively.

### Time & Activity Tracking
- **Time Tracking:** Log time entries against specific issues or projects and view aggregated totals.
- **Inbox:** In-app notifications for assignments, invites, and activity relevant to the user.
- **Reports:** Overview, Projects, Tasks, and Team dashboards with CSV export capabilities.

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React 18 & Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS & Lucide Icons
- **State Management:** React Query (server state) & Zustand (client state)
- **Routing:** React Router

### Backend
- **Framework:** Java Spring Boot (Stateless REST API)
- **Security:** Spring Security (JWT-based)
- **Database:** PostgreSQL
- **Migrations:** Flyway
- **Data Access:** JdbcTemplate (Raw SQL/JDBC — no JPA/Hibernate, by design for maximum performance and explicit querying)
- **Mailing:** Spring Mail (SMTP) for invitation emails

---

## 💻 Getting Started (Local Development)

### Prerequisites
- **Node.js** (v18+)
- **Java 17+**
- **PostgreSQL** (running locally on port `5432` with user `prokoi` and no password by default)

### 1. Database Setup
Create a PostgreSQL database named `prokoi`:
```bash
createdb prokoi -U prokoi
```
*(Note: Flyway migrations run automatically on application startup. This builds the full schema through Phase 2, including invitations, time tracking, and the inbox.)*

### 2. Environment Variables
Create a `.env` file in the root directory (copy `.env.example` as a starting point) and configure the minimum required variables:
```env
JWT_SECRET=your_super_secret_jwt_key_that_is_at_least_32_chars_long
```
**Email Configuration (Optional but Recommended):** 
To enable actual delivery of invitation emails, configure the SMTP credentials in your `.env` file. Without them, invites are still created and links are generated, but delivery will fail silently (the link will be printed in the backend logs as a fallback).

### 3. Starting the Application
We've included a unified startup script to boot both services:

```bash
./start.sh
```
**What this does:**
1. Loads variables from your `.env` file.
2. Starts the Spring Boot backend on `http://localhost:8080`.
3. Starts the Vite frontend dev server on `http://localhost:5174`.
4. Gracefully shuts down both services when you press `CTRL+C`.

---

## 🏗 Architecture

For a deep dive into system design, module boundaries, database schema, and architectural trade-offs, see the [Architecture Document](./Docs/ARCHITECTURE.md).

---

## 🗺 Roadmap

Known gaps and planned features, tracked honestly for upcoming sprints:

- **Testing:** No automated test suite yet (backend or frontend). Coverage is manual/exploratory today.
- **Authentication Enhancements:** Session tokens cannot be revoked before natural expiry (no refresh-token rotation yet). Password-reset flow is pending.
- **API Optimizations:** List endpoints (organizations/teams/projects) are currently unpaginated. No rate limiting on auth endpoints.

**Planned — Phase 1.5 (Production Hardening):** 
Refresh-token rotation with revocation (httpOnly cookies), password reset, rate limiting, pagination, soft deletes, and audit logging — scoped for completion before real (non-demo) users are onboarded.
