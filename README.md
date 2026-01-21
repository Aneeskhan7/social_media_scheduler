# social_media_scheduler
Task for intership


# Social Media Content Scheduler (MERN Stack)

A simplified **Social Media Content Scheduler** built using the **MERN stack**.  
This application allows users to create, schedule, and automatically publish posts at a future time.

Note:  
This project **does NOT post to real social media platforms**.  
It only **simulates scheduling logic**, as required by the assessment.

---

##  Project Overview

The goal of this project is to demonstrate:
- Full-stack MERN development
- Secure authentication & authorization
- Background scheduling using cron jobs
- Clean API design
- A professional and responsive frontend UI

Users can:
- Register and login
- Create posts
- Schedule posts for a future time
- Automatically publish posts via background jobs
- View statistics on a dashboard

---

## High-Level Architecture
```text
Frontend (React + Tailwind)
↓
Backend (Node + Express)
↓
MongoDB
↓
Cron Job (runs every minute)
```


---

## Features

### Authentication
- User registration & login
- Password hashing with bcrypt
- JWT-based authentication
- Protected routes

### Post Management
- Create, update, delete posts
- Schedule posts for future publishing
- Content length validation (max 500 characters)
- Ownership-based access control

### Scheduling Logic
- Background cron job runs every minute
- Automatically publishes posts when scheduled time is reached
- Publication logs maintained

### Dashboard
- Total posts count
- Scheduled posts count
- Published posts count
- Upcoming scheduled posts
- Real-time updates without page refresh

### Frontend UI
- Built with React + Tailwind CSS
- Responsive and clean design
- Loading states, error handling
- Snackbars and modals for user feedback

---

##  Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcrypt
- node-cron

---

## Project Structure

```text
social-media-content-scheduler/

├── frontend/
│ ├── src/
│ ├── public/
│ └── package.json
│
├── backend/
│ ├── controllers/
│ ├── routes/
│ ├── models/
│ ├── cron/
│ ├── middleware/
│ └── server.js
|
├── TESTING.md
```

## Project Structure
cd backend
npm install


**Create .env file in backend/:**

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

3️ **Frontend Setup**
cd frontend
npm install
npm run dev

**API Endpoints**

**Authentication**

POST /api/auth/register – Register user

POST /api/auth/login – Login user

**Posts**

POST /api/posts – Create post

GET /api/posts – Get all user posts

PUT /api/posts/:id – Update post

DELETE /api/posts/:id – Delete post

**Dashboard**

GET /api/dashboard/stats – Dashboard statistics

GET /api/dashboard/upcoming – Upcoming scheduled posts

 **Testing & Edge Cases**

All major user flows and edge cases were manually tested.
Covered areas include:

Authentication validation
Authorization checks
Scheduling accuracy
CRUD operations
UI feedback and error handling
Security and input validation

**Detailed testing is documented in:**
  TESTING.md

**Security Measures**

Password hashing using bcrypt
JWT authentication and route protection
Ownership checks for posts
Input sanitization and validation
CORS enabled
Rate limiting (optional)

**Deployment**

Frontend deployed on Vercel
Backend deployed on Vercel
Environment variables configured securely



