# TaskFlow — Planning Document

## Problem Statement
Small teams and individuals juggle tasks across sticky notes, chat threads, and
spreadsheets. There's no single, lightweight place to see what's due, what's
overdue, and who owns what. Existing tools (Jira, Asana) are heavyweight for a
team of 2–10 people who just want a clean task board with accountability.

**TaskFlow** solves this with a minimal, fast task management SaaS: sign up,
create a workspace, add tasks with priority/due dates/status, and see progress
on a dashboard — nothing more, nothing less

## Application Overview
TaskFlow is a single-tenant-per-user task management web app. Each user
registers an account, lands on a dashboard showing task statistics (total,
completed, overdue, due this week), and manages tasks through a board
organized by status (To Do / In Progress / Done). Tasks support priority
levels, due dates, and free-text descriptions.

**Target user:** an individual or small team lead who wants task visibility
without onboarding overhead.

## Features List
### Must Have
- User registration and login
- Create, view, edit, delete tasks
- Task has: title, description, status, priority, due date, category
- Dashboard showing stats (total, done, overdue, due soon)
- Kanban board (To Do / In Progress / Done)
- Filter by priority, search by title

### Out of Scope
- Team sharing
- Email notifications
- File attachments

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: SQLite (better-sqlite3)
- Auth: JWT + bcrypt

## Database Design
(Draw out your tables — users and tasks — with columns and types)

## API Routes
(List your endpoints — method, path, what it does, auth required?)

## Milestones
1. Project setup
2. Database schema
3. Authentication
4. Task API
5. Frontend React scaffold
6. Auth UI components
7. Dashboard UI components
8. Bug fixing
9. Testing
10. Documentation