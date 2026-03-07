# Church Management System (CMS)

A modern, scalable, and secure Church Management System built with **Next.js + TypeScript (frontend)** and **Django + Django REST Framework (backend)**. This system allows church administrators, pastors, finance officers, cell leaders, and evangelism teams to manage members, events, attendance, finances, pastoral care, and analytics efficiently.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Modules & Features](#modules--features)
- [Project Roadmap](#project-roadmap)
- [Setup Instructions](#setup-instructions)
- [Development Workflow](#development-workflow)
- [Contributing](#contributing)
- [Progress Tracking](#progress-tracking)

---

## Project Overview

**Purpose:**  
Provide a comprehensive platform to manage all aspects of church operations including members, cells, departments, events, attendance, finances, pastoral care, communication, and reporting.

**Target Users:**  
- Pastors / Senior Pastors  
- Church administrators  
- Finance officers  
- Cell leaders  
- Evangelism & follow-up teams  

**Goals:**  
- Streamline administration and workflows  
- Improve reporting and analytics  
- Enhance member engagement tracking  
- Ensure secure, role-based access  
- Enable multi-branch support  

---

## Tech Stack

### Frontend

- **Framework:** Next.js + TypeScript  
- **UI Components:** shadcn/ui  
- **Styling:** Tailwind CSS  
- **State Management:** React Query / Zustand  
- **Forms & Validation:** React Hook Form + Zod  
- **Charts:** Recharts / Chart.js  

### Backend

- **Framework:** Django + Django REST Framework  
- **Database:** PostgreSQL (production), SQLite (development)  
- **Authentication:** Django Auth + SimpleJWT (JWT)  
- **Caching & Background Tasks:** Redis + Celery  
- **File Storage:** Local / AWS S3  

### Deployment & DevOps

- Docker + Docker Compose  
- Nginx + Gunicorn (backend)  
- CI/CD: GitHub Actions / GitLab CI  
- Hosting: AWS / GCP / DigitalOcean  
- Monitoring: Sentry + Prometheus  

---

## Modules & Features

### Core Modules (MVP)

- Auth (login, register, JWT)  
- Users (CRUD, roles, permissions)  
- Members (CRUD, family info, spiritual milestones)  
- Visitors (CRUD, follow-ups)  
- Cells / Small Groups (CRUD, member assignments)  
- Departments / Ministries (CRUD, member assignments)  
- Attendance (events & members)  
- Events (CRUD, scheduling)  
- Finance (tithes, offerings, expenses, transactions)  
- Followups (member & visitor follow-ups)  
- Dashboard (analytics & stats)  
- Reports (membership growth, finance, attendance)

### Extended Modules (Phase 2+)

- Prayer Requests  
- Counseling & Pastoral Visits  
- Media Library (Sermons, Audio/Video)  
- Assets / Inventory Management  
- Documents (baptism, marriage, reports)  
- Announcements & Notifications (Email / SMS)  
- Service Planning & Tasks  
- Multi-branch / Branch Management  

---

## Project Roadmap

**Phase 0: Planning**

1. Define MVP modules & extended modules  
2. Draw system architecture  
3. Set up Git repository & branching strategy  
4. Configure environment variables  

**Phase 1: Backend MVP**

1. Initialize Django project & apps  
2. Design database schema & models  
3. Implement authentication & role-based permissions  
4. Build API endpoints (CRUD + filters + search + pagination)  
5. Setup Django admin panel  
6. Write unit tests  

**Phase 2: Frontend MVP**

1. Initialize Next.js + TypeScript project  
2. Configure shadcn UI & Tailwind CSS  
3. Build layout & navigation (sidebar, navbar)  
4. Connect frontend pages to backend APIs  
5. Implement forms, tables, charts  
6. Add role-based navigation & permissions  

**Phase 3: Extended Features**

- Prayer Requests, Counseling, Pastoral care  
- Media library, Documents, Assets  
- Announcements, Tasks, Service Planning  
- Multi-branch support  

**Phase 4: Deployment & DevOps**

1. Dockerize backend, frontend, database, Redis  
2. Configure Gunicorn + Nginx  
3. Deploy to cloud  
4. Setup monitoring (Sentry) & backups  

**Phase 5: Testing & QA**

- Manual testing of workflows  
- Automated backend tests  
- Frontend testing (React Testing Library)  
- User acceptance testing  

**Phase 6: Maintenance & Scaling**

- Monitor performance & errors  
- Optimize queries & caching  
- Implement new modules incrementally  

---

## Setup Instructions

### Backend

```bash
# Clone repo
git clone https://github.com/<username>/church-management-system.git
cd church-management-system/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment variables (.env)
# DATABASE_URL, SECRET_KEY, DEBUG, etc.

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start server
python manage.py runserver
