# WebLearnX Backend Setup Guide

This document explains how to run and use the WebLearnX backend locally.

---

# Tech Stack

* Node.js
* Express.js
* MySQL
* JWT Authentication
* ES Modules

---

# Project Features

## Learning Platform

* Courses
* Articles
* Cheatsheets
* Progress Tracking

## Hackathon Module

* External Hackathon Listings
* Organizer Approval Workflow
* Bookmark System
* Search & Filtering

## Security

* JWT Authentication
* Role-Based Access Control
* Organizer Ownership Checks
* Soft Delete System

---

# Requirements

Install the following before starting:

* Node.js
* MySQL
* Postman
* Git

---

# 1. Clone Repository

```bash
git clone <repository-url>
```

Open project folder


---

# 2. Install Dependencies

```bash
npm install
```

---

# 3. Import Database

Open phpMyAdmin or MySQL Workbench.

Create a database:

```sql
CREATE DATABASE weblearnx;
```
`You can create DB of any name just remember to change it on .env fine`

Import provided SQL file:

```plaintext
schema.sql
```

This will create all required tables.

---

# 4. Configure Environment Variables

Rename a file:

```plaintext
.env.examle
```

To:

```env
.env
```

---

# 5. Start Server

Development mode:

```bash
npm run dev
```

OR:

```bash
nodemon server.js
```

Production mode:

```bash
npm start
```

---

# 6. Verify Server

Server should run on:

```plaintext
http://localhost:5000
```

---

# 7. Import Postman Collection

Open Postman:

* Click Import
* Select provided Postman JSON collection
* All APIs will be available automatically

---

# Platform Workflow

WebLearnX is divided into two main modules:

1. Learning Platform
2. Hackathon Platform

---

# Learning Platform Workflow

The learning platform works as a CMS (Content Management System) where admins manage educational content and users consume learning material.

---

## Admin Workflow

### Step 1 — Create Courses

Admin creates learning courses.

Examples:

* Web Development
* MERN Stack
* JavaScript Basics
* React.js

Each course acts as a container for articles and learning content.

---

### Step 2 — Add Articles

Admin adds multiple articles inside courses.

Example:

Course:

```plaintext
MERN Stack
```

Articles:

```plaintext
Introduction to MongoDB
Express.js Routing
React Components
Node.js APIs
```

Users can open and read articles individually.

---

### Step 3 — Add Cheatsheets

Admins can upload cheatsheets for quick revision and reference.

Examples:

* JavaScript Array Methods
* CSS Flexbox Cheatsheet
* React Hooks Cheatsheet

---

### Step 4 — User Learning Experience

Users can:

* browse courses
* read articles
* access cheatsheets
* continue learning progressively

The platform is designed to provide structured web development learning resources.

---

# Hackathon Platform Workflow

The hackathon module works as an external hackathon discovery platform.

Important:

* WebLearnX does NOT host hackathons directly
* registration happens on external websites
* WebLearnX only lists and manages hackathon information

---

## User Workflow

### Step 1 — Browse Hackathons

Users can view:

* title
* description
* banner
* organizer
* dates
* registration link

---

### Step 2 — Search & Filter

Users can:

* search hackathons by title
* filter hackathons by status

Examples:

* active
* upcoming
* completed

---

### Step 3 — Bookmark Hackathons

Users can bookmark hackathons to save them for later viewing.

---

### Step 4 — External Registration

When users click:

```plaintext
Join Now
```

they are redirected to the external hackathon website using:

```plaintext
registration_link
```

The actual registration process happens externally.

---

# Organizer Workflow

---

## Step 1 — Organizer Registration Request

During registration users can choose:

```plaintext
user
```

OR

```plaintext
organizer
```

---

## Step 2 — Pending Organizer Approval

If user selects:

```plaintext
organizer
```

their account becomes:

```plaintext
account_status = pending
```

The organizer cannot access organizer features until admin approval.

---

## Step 3 — Admin Reviews Organizer Requests

Admin can:

* view pending organizer requests
* approve organizers
* reject organizers

Admin may verify organizers manually using:

* email
* communication
* organizer details

---

## Step 4 — Organizer Access Granted

After approval:

```plaintext
account_status = approved
```

Organizer can:

* create hackathons
* update own hackathons
* delete own hackathons

Organizers cannot manage hackathons created by other organizers.

---

# Admin Workflow

Admins have complete platform control.

Admins can:

* manage courses
* manage articles
* manage cheatsheets
* manage all hackathons
* approve organizers
* reject organizers
* monitor platform content

---

# Security Workflow

The backend uses:

* JWT Authentication
* Role-Based Access Control
* Organizer Ownership Checks
* Validation Middleware
* Soft Delete System

Protected routes require JWT authentication using:

```plaintext
Authorization: Bearer TOKEN
```

---

# Important Notes

* Hackathons are external listings
* Registration happens on external websites
* `registration_link` stores external registration URL
* Soft delete is enabled using `deleted_at`
* Only approved organizers can manage hackathons
* Backend uses ES Modules
* Keep API response format consistent


---

# Folder Structure

```plaintext
controllers/
routes/
middleware/
config/
```

---

# Common Issues

## Database Connection Error

Check:

* MySQL running
* correct DB credentials in `.env`

---

## JWT Errors

Check:

* valid token
* Authorization header format

Correct format:

```plaintext
Bearer TOKEN
```

---

# Development Notes

* Backend uses ES Modules
* Avoid converting to CommonJS
* Keep API response format consistent

Standard response format:

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

---

# Final Notes

This backend is designed to remain:

* simple
* maintainable
* beginner-friendly
* modular
* frontend-ready
