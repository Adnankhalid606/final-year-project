# WebLearnX

WebLearnX is a full-stack educational content management system and hackathon discovery platform built using Node.js, Express.js, MySQL, and React (Vite). The system provides structured learning resources (courses, ordered articles, cheatsheets, and progress tracking) alongside an external hackathon listing and management portal featuring multi-role access control for Learners, Organizers, and Administrators.

---

## Short Project Overview

WebLearnX bridges educational content delivery with real-world developer opportunities. Platform creators and administrators manage structured learning curricula and reference sheets, while registered learners track their reading progress and bookmark upcoming hackathons. Organizer accounts allow verified external event hosts to publish and maintain event listings with external registration links.

---

## Team

| Name | Role |
|------|------|
| Adnan Khalid | Backend Developer |
| Mehtab Khan | Frontend Developer & UI Designer |

---

## Features

### Learning Platform (CMS)
- **Course Catalog**: Categorized courses with titles, descriptions, and metadata.
- **Ordered Articles**: Sequential learning articles grouped under courses, allowing step-by-step educational progression.
- **Cheatsheets**: Quick-reference technical documentation lookup by slug and category.
- **Progress Tracking**: Automatic tracking of completed articles per user with dynamic course completion percentage calculation.

### Hackathon Management Portal
- **Hackathon Discovery**: Public listing of external hackathons with title search and status filtering (upcoming, active, completed).
- **External Registration**: Redirection to external hackathon portals via verified URLs.
- **Bookmarking System**: Authenticated learners can save hackathons to a personalized bookmark list.
- **Organizer Workspace**: Event creation and management interface restricted to approved organizers.

### Administration & User Management
- **Organizer Workflow**: Registration flow for organizers requiring administrative verification before access is granted.
- **User Management**: System administrators can monitor all user accounts and perform soft deletions.
- **Content Administration**: Dedicated management panels for creating, updating, and soft-deleting courses, articles, cheatsheets, and hackathon listings.

---

## User Roles

| Role | Access Level | Capabilities |
| :--- | :--- | :--- |
| **Public Visitor** | Unauthenticated | View landing page, access authentication pages (Login / Register). |
| **User (Learner)** | Authenticated (`user`) | Browse courses, read articles, complete progress, access cheatsheets, search hackathons, bookmark hackathons, manage profile. |
| **Organizer** | Authenticated (`organizer`, Approved) | Access organizer dashboard, create hackathon listings, update and soft-delete owned hackathons. *(Requires admin approval upon registration)*. |
| **Admin** | Authenticated (`admin`) | Full platform authority: approve/reject pending organizers, manage users, manage all courses, articles, cheatsheets, and hackathons. |

---

## Tech Stack

### Frontend
| Technology | Description |
| :--- | :--- |
| **React 18** | UI component architecture |
| **Vite** | Frontend build tool and development server |
| **React Router DOM v6** | Client-side routing and protected route guards |
| **Axios** | HTTP client with request/response interceptors |
| **Bootstrap 5** | Responsive layout framework and UI styling |
| **Framer Motion** | UI animations and transition effects |
| **React Markdown & Remark GFM** | Rendering Markdown content and GitHub Flavored Markdown tables |
| **React Syntax Highlighter** | Code snippet syntax highlighting for articles and cheatsheets |

### Backend
| Technology | Description |
| :--- | :--- |
| **Node.js** | Server-side JavaScript runtime (ES Modules) |
| **Express.js v5** | RESTful web framework and routing pipeline |
| **MySQL / MySQL2** | Relational database storage with promise-based connection pooling |
| **JSON Web Token (JWT)** | Stateless authentication header tokens |
| **BcryptJS** | Salted password hashing |
| **Cors & Dotenv** | Cross-Origin Resource Sharing and environment configuration |

---

## Architecture Overview

WebLearnX follows a decoupled client-server architecture using RESTful API design principles and an MVC-inspired pattern on the backend.

```
[ Client: React + Vite ]
         │
         │ HTTP Requests (Axios + JWT Bearer Token)
         ▼
[ Express API Server ]
  ├── Middleware (CORS, Express JSON, Auth Guard, Role Guard, Input Validation)
  ├── Controllers (Business Logic & Payload Formatting)
  └── Database Layer (MySQL2 Pool Queries)
         │
         ▼
[ Relational Database: MySQL ]
```

Key Architecture Highlights:
- **Stateless Authentication**: JWT tokens are issued upon login/registration and stored in client storage.
- **Centralized HTTP Interceptors**: Axios instance automatically attaches authentication headers and handles `401 Unauthorized` responses.
- **Soft Delete Paradigm**: Data records use a `deleted_at` timestamp column to preserve historical integrity while hiding deleted entities from application queries.

---

## Folder Structure

```
final-year-project/
├── backend/
│   ├── config/
│   │   └── db.js                        # MySQL connection pool setup
│   ├── controllers/
│   │   ├── adminController.js           # Organizer approvals, user & platform metrics
│   │   ├── articleController.js         # Course article CRUD handlers
│   │   ├── authController.js            # Register & login authentication logic
│   │   ├── cheatsheetController.js      # Technical cheatsheet CRUD handlers
│   │   ├── courseController.js           # Learning course CRUD handlers
│   │   ├── hackathonController.js       # Hackathon & bookmark management logic
│   │   └── progressController.js        # User learning completion calculations
│   ├── middleware/
│   │   ├── authMiddleware.js            # JWT protection & admin authorization
│   │   ├── hackathonValidationMiddleware.js # Input & URL payload validators
│   │   └── roleMiddleware.js            # Generic role-based route guard
│   ├── routes/
│   │   ├── adminRoutes.js               # Administrative endpoints
│   │   ├── articleRoutes.js             # Article endpoints
│   │   ├── authRoutes.js                # Auth endpoints
│   │   ├── cheatsheetRoutes.js          # Cheatsheet endpoints
│   │   ├── courseRoutes.js              # Course endpoints
│   │   ├── hackathonRoutes.js           # Hackathon & bookmark endpoints
│   │   └── progressRoutes.js            # Progress tracking endpoints
│   ├── schema/
│   │   ├── fyp.sql                      # Primary relational schema dump
│   │   ├── aiven.sql                    # Cloud MySQL deployment schema
│   │   └── seed.sql                     # Initial seed database records
│   ├── api/
│   │   └── WebLearn with Hackathon.postman_collection.json # API documentation
│   ├── .env.example                     # Environment template
│   ├── package.json                     # Backend dependencies & scripts
│   └── server.js                        # Express server entry point
│
└── frontend/
    ├── src/
    │   ├── api/                         # Modular Axios request services
    │   ├── components/                  # Shared UI components (Navbar, Guards)
    │   ├── context/                     # AuthContext state provider
    │   ├── pages/                       # View components grouped by authorization level
    │   │   ├── admin/                   # Admin dashboards and management panels
    │   │   ├── auth/                    # Login and Register pages
    │   │   ├── organizer/               # Organizer forms and dashboards
    │   │   ├── public/                  # Landing page
    │   │   └── user/                    # User dashboard, courses, reader, hackathons
    │   ├── App.jsx                      # Client router configuration
    │   ├── main.jsx                     # Application root render
    │   └── index.css                    # Global application styles
    ├── index.html                       # Base HTML page template
    ├── package.json                     # Frontend dependencies & scripts
    └── vite.config.js                   # Vite builder configuration
```

---

## Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MySQL Server**: v8.0 or MariaDB v10.4 or higher
- **Git**

### Step 1: Clone Repository
```bash
git clone https://github.com/Adnankhalid606/final-year-project.git
cd final-year-project
```

### Step 2: Database Setup
1. Start your local MySQL server (e.g., MySQL Workbench, XAMPP, or command line).
2. Create a database named `weblearnx` (or any custom name):
   ```sql
   CREATE DATABASE weblearnx;
   ```
3. Import the database schema from `backend/schema/fyp.sql`:
   ```bash
   mysql -u root -p weblearnx < backend/schema/fyp.sql
   ```

### Step 3: Backend Setup
```bash
cd backend
npm install
```

### Step 4: Frontend Setup
```bash
cd ../frontend
npm install
```

---

## Environment Variables

Create a `.env` file in the `backend/` directory using `.env.example` as a reference:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Authentication Secret
JWT_SECRET=your_jwt_secret_key_here

# Database Configuration (Local)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=weblearnx
```

> Note: Never commit `.env` files containing sensitive production passwords or secret keys to source control.

---

## Running Backend

Navigate to the `backend/` directory and execute:

### Development Mode (with Nodemon auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server runs at `http://localhost:5000`. You can test server connectivity by visiting `http://localhost:5000/`.

---

## Running Frontend

Navigate to the `frontend/` directory and execute:

### Development Mode
```bash
npm run dev
```

### Production Build & Preview
```bash
npm run build
npm run preview
```

The frontend application runs at `http://localhost:5173`.

---

## API Overview

All API endpoints are prefixed with `/api`.

### Auth Endpoints (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user (`user` or `organizer`). Returns JWT token. |
| `POST` | `/api/auth/login` | Public | Authenticate user and issue JWT token. |

### Course Endpoints (`/api/courses`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/courses` | Authenticated | List active courses (supports optional `?search=` filter). |
| `GET` | `/api/courses/:id` | Authenticated | Fetch single course details by ID. |
| `POST` | `/api/courses` | Admin | Create a new course container. |
| `PUT` | `/api/courses/:id` | Admin | Update course title and description. |
| `DELETE` | `/api/courses/:id` | Admin | Soft-delete course listing. |

### Article Endpoints (`/api/articles`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/articles/course/:courseId` | Authenticated | List ordered articles belonging to a specific course. |
| `GET` | `/api/articles/:id` | Authenticated | Fetch article content by ID. |
| `POST` | `/api/articles` | Admin | Add article to a course with sequence ordering. |
| `PUT` | `/api/articles/:id` | Admin | Update article content, title, or order. |
| `DELETE` | `/api/articles/:id` | Admin | Soft-delete article. |

### Progress Endpoints (`/api/progress`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/progress/complete` | Authenticated | Mark an article as completed for current user. |
| `GET` | `/api/progress/course/:courseId` | Authenticated | Calculate percentage and article count progress for a course. |

### Cheatsheet Endpoints (`/api/cheatsheets`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cheatsheets` | Authenticated | List active cheatsheets. |
| `GET` | `/api/cheatsheets/:slug` | Authenticated | Fetch cheatsheet details by unique URL slug. |
| `POST` | `/api/cheatsheets` | Admin | Create a new technical cheatsheet. |
| `PUT` | `/api/cheatsheets/:id` | Admin | Update cheatsheet title, slug, category, or content. |
| `DELETE` | `/api/cheatsheets/:id` | Admin | Soft-delete cheatsheet record. |

### Hackathon Endpoints (`/api/hackathons`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/hackathons` | Public | List active hackathons (supports `?search=` and `?status=`). |
| `GET` | `/api/hackathons/bookmarks` | Authenticated | Fetch current user's bookmarked hackathons. |
| `GET` | `/api/hackathons/:hackathonId` | Authenticated | Fetch single hackathon details. |
| `POST` | `/api/hackathons` | Organizer / Admin | Create a new hackathon listing with schedule & registration link. |
| `PUT` | `/api/hackathons/:hackathonId` | Organizer / Admin | Update hackathon listing (organizers manage own listings only). |
| `DELETE` | `/api/hackathons/:hackathonId` | Organizer / Admin | Soft-delete hackathon listing. |
| `POST` | `/api/hackathons/:hackathonId/bookmark` | Authenticated | Save hackathon to user bookmarks. |
| `DELETE` | `/api/hackathons/:hackathonId/bookmark` | Authenticated | Remove hackathon from user bookmarks. |

### Admin Endpoints (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/organizers/pending` | Admin | Fetch pending organizer registration requests. |
| `PUT` | `/api/admin/organizers/:userId/approve` | Admin | Approve pending organizer account. |
| `PUT` | `/api/admin/organizers/:userId/reject` | Admin | Reject pending organizer account. |
| `GET` | `/api/admin/users` | Admin | Fetch all registered system users. |
| `DELETE` | `/api/admin/users/:userId` | Admin | Soft-delete user account. |
| `GET` | `/api/admin/hackathons` | Admin | List all hackathons with organizer details. |
| `PUT` | `/api/admin/hackathons/:hackathonId/status` | Admin | Update hackathon status (`upcoming`, `active`, `completed`). |
| `GET` | `/api/admin/courses` | Admin | List all platform courses with author information. |

---

## Database Overview

WebLearnX relies on a structured MySQL schema with foreign key relationships, indexes, and soft-delete timestamps.

### Entity Relationship Summary

```
   ┌──────────┐            ┌───────────┐            ┌───────────┐
   │  users   │───1:N─────>│  courses  │───1:N─────>│ articles  │
   └──────────┘            └───────────┘            └───────────┘
     │     │                                              │
    1:N   1:N                                            1:N
     │     │                                              │
     │     └──────────────┐                               ▼
     ▼                    ▼                         ┌───────────┐
┌───────────┐     ┌──────────────┐                  │ progress  │
│hackathons │     │ cheatsheets  │                  └───────────┘
└───────────┘     └──────────────┘
     │
    1:N
     ▼
┌───────────┐
│ bookmarks │
└───────────┘
```

### Table Definitions

1. **`users`**: Stores user credentials, roles (`user`, `organizer`, `admin`), and organizer approval status (`pending`, `approved`, `rejected`).
2. **`courses`**: High-level subject containers created by administrators.
3. **`articles`**: Individual lessons linked to a course via `course_id` with ordering support (`order`).
4. **`cheatsheets`**: Quick reference documentation containing unique URL slugs (`slug`) and category tags.
5. **`hackathons`**: External hackathon listings created by approved organizers or admins, containing date schedules, status (`upcoming`, `active`, `completed`), banners, registration links, and prize pool attributes.
6. **`bookmarks`**: Composite join table linking users to bookmarked hackathons (`user_id`, `hackathon_id`).
7. **`progress`**: Completion tracking table linking user IDs to finished article IDs (`user_id`, `article_id`).

---

## Authentication Flow

```
[ User Submit Form ] ──> POST /api/auth/login ──> [ Validate Credentials & Password Hash ]
                                                                 │
[ Save JWT to localStorage ] <── Return 200 OK + JWT Token <─────┘
           │
           ▼
[ Send Requests with Header: Authorization: Bearer <TOKEN> ]
           │
           ▼
[ backend/middleware/authMiddleware.js ]
   ├── Verify JWT token signature
   ├── Query active database user (WHERE deleted_at IS NULL)
   ├── Enforce account status check for organizers (must be approved)
   └── Attach user context (req.user) to route handler
```

If an expired or invalid token is presented to any protected endpoint, the frontend Axios interceptor captures the `401 Unauthorized` status code, clears local storage items, and redirects the user to `/login`.

---

## Authorization / Role-Based Access

The platform enforces multi-tiered authorization on both backend and frontend layers:

1. **Route Level Guards (Backend)**:
   - `protect`: Verifies JWT payload and valid database user.
   - `admin`: Restricts access to users with `role = 'admin'`.
   - `authorizeRoles(...roles)`: Configurable middleware for multi-role endpoint protection.
2. **Ownership Verification (Backend)**:
   - Organizers can update or delete only hackathons where `organizer_id === req.user.id`. Administrators bypass ownership checks to maintain global moderation authority.
3. **Client-Side Component Guards (Frontend)**:
   - `<ProtectedRoute>`: Blocks unauthenticated users from accessing internal routes.
   - `<RoleRoute roles={['admin', 'organizer']}>`: Protects role-specific page views and renders unauthorized redirects.

---

## Image Upload

Images across the platform (such as hackathon banners) are supported via external image URL references stored directly in the database (`banner` column).

- **Payload Validation**: Before creating or updating hackathon records, backend validation middleware (`isValidUrl`) verifies that input banner strings conform to valid URL syntax.
- **Rendering**: Banners are directly rendered on the client side inside responsive image components with fallback states.

---

## Markdown Support

WebLearnX includes Markdown rendering across all content-heavy sections:

- **Supported Modules**: Course Articles, Cheatsheet Detail views, Hackathon Description panels, and Admin/Organizer preview editors.
- **Rendering Stack**: `react-markdown` configured with `remark-gfm` (GitHub Flavored Markdown plugin for tables, tasklists, and strikethroughs).
- **Code Syntax Highlighting**: Integrated `react-syntax-highlighter` using the `vscDarkPlus` theme to format code snippets in multiple programming languages automatically.

---

## Screenshots

*(Placeholders: Replace image URLs below with actual project screenshots when available)*

| Landing Page | Course Catalog |
| :---: | :---: |
| ![Landing Page Placeholder](https://via.placeholder.com/600x350?text=WebLearnX+Landing+Page) | ![Courses Placeholder](https://via.placeholder.com/600x350?text=Course+Catalog+Page) |

| Article Reader & Markdown | Hackathon Discovery Portal |
| :---: | :---: |
| ![Article Reader Placeholder](https://via.placeholder.com/600x350?text=Article+Reader+With+Syntax+Highlighting) | ![Hackathons Placeholder](https://via.placeholder.com/600x350?text=Hackathon+Listings+%26+Filtering) |

| Admin Management Dashboard | Organizer Event Portal |
| :---: | :---: |
| ![Admin Dashboard Placeholder](https://via.placeholder.com/600x350?text=Admin+Pending+Organizers+Management) | ![Organizer Dashboard Placeholder](https://via.placeholder.com/600x350?text=Organizer+Event+Form) |

---

## Future Improvements / Roadmap

- [ ] **Direct Cloud File Uploads**: Integrate Multer and AWS S3 / Cloudinary for direct image and asset uploads.
- [ ] **Email Notifications**: Automated email updates upon organizer approval/rejection using Nodemailer.
- [ ] **Interactive Code Sandbox**: Embedded code execution environment inside article reading views.
- [ ] **Rich Text Editor**: Integration of a WYSIWYG Markdown editor (e.g., SimpleMDE or Quill) for admin content creation.
- [ ] **Social Authentication**: OAuth2 integration for Google and GitHub sign-in.

---

## Learning Highlights

- **Soft Delete Pattern**: Implemented database-wide non-destructive deletion via `deleted_at` timestamps, maintaining relational records without data loss.
- **Role Approval Workflow**: Architected an asynchronous approval lifecycle for event organizers, balancing public signups with administrative verification.
- **Responsive Navigation**: Built dynamic role-aware navigation components in React that render contextually based on user state and permissions.
- **Database Connection Pooling**: Utilized promise-based MySQL connection pools to optimize query latency and handle concurrent client requests efficiently.

---

## Contributors

> This project was developed collaboratively as a Final Year Project. Responsibilities were divided between backend engineering and frontend development to simulate a real-world team workflow.

### Adnan Khalid
**Backend Developer**

Responsible for:
- Backend architecture design & implementation
- REST API development (Express.js)
- Database schema design & query optimization (MySQL)
- Authentication & Role-Based Access Control (JWT, RBAC)
- Middleware implementation & centralized error handling
- Core business logic & connection pool management

### Mehtab Khan
**Frontend Developer & UI Designer**

Responsible for:
- React frontend application development (Vite)
- User Interface implementation & visual design
- Responsive layout implementation (Bootstrap 5)
- User Experience improvements & dynamic state management
- Reusable component architecture (Markdown rendering, syntax highlighting)
- Frontend integration with backend APIs

---

## License

This project is licensed under the **ISC License**.

---

## Author

**Adnan Khalid**
- GitHub: [@Adnankhalid606](https://github.com/Adnankhalid606)
- Project Repository: [WebLearnX Repository](https://github.com/Adnankhalid606/final-year-project)
- GitHub: [@mehtab-official](https://github.com/mehtab-official)
