# WebLearnX Frontend

A full-featured React.js frontend for the WebLearnX platform — a combined learning management system and hackathon discovery platform built with React 18, Bootstrap 5, React Router v6, and Axios.

---

## Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18.2 | UI framework |
| Vite | 5.1 | Build tool and dev server |
| React Router DOM | 6.22 | Client-side routing |
| Bootstrap | 5.3 | CSS component library |
| Axios | 1.6 | HTTP client for API calls |

---

## Prerequisites

- Node.js v18 or higher
- npm
- WebLearnX backend running at `http://localhost:5000`

---

## Quick Start

```bash
cd weblearnx-frontend
npm install
npm run dev
```

Opens at **http://localhost:3000**

---

## Project Structure

```
weblearnx-frontend/
├── src/
│   ├── api/
│   │   ├── axios.js          — Axios instance, JWT interceptor, 401 auto-logout
│   │   ├── auth.js           — login, register
│   │   ├── courses.js        — getCourses, getCourse, createCourse
│   │   ├── articles.js       — getArticlesByCourse, getArticle, createArticle
│   │   ├── progress.js       — completeArticle, getCourseProgress
│   │   ├── cheatsheets.js    — getCheatsheets, getCheatsheet, createCheatsheet
│   │   ├── hackathons.js     — getHackathons, createHackathon, updateHackathon,
│   │   │                       deleteHackathon, bookmarkHackathon, removeBookmark,
│   │   │                       getMyBookmarks
│   │   └── admin.js          — getPendingOrganizers, approveOrganizer, rejectOrganizer
│   │
│   ├── context/
│   │   └── AuthContext.jsx   — Global auth state: user, token, login(), logout()
│   │
│   ├── components/
│   │   ├── Navbar.jsx        — Responsive navbar, role-aware links, logout button
│   │   ├── ProtectedRoute.jsx — Redirects to /login if not authenticated
│   │   └── RoleRoute.jsx     — Redirects to / if user doesn't have required role
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx         — Email + password login form
│   │   │   └── Register.jsx      — Name, email, password, role (user/organizer)
│   │   │
│   │   ├── user/
│   │   │   ├── Home.jsx              — Hero section + feature cards
│   │   │   ├── Courses.jsx           — Course grid with progress bars
│   │   │   ├── CourseDetail.jsx      — Article list + mark complete + progress sidebar
│   │   │   ├── ArticleReader.jsx     — Full article content + mark as complete
│   │   │   ├── Hackathons.jsx        — Browse + search + filter + bookmark
│   │   │   ├── Bookmarks.jsx         — Saved hackathons with remove button
│   │   │   ├── Cheatsheets.jsx       — Grouped by category with search
│   │   │   └── CheatsheetDetail.jsx  — Monospace content viewer
│   │   │
│   │   ├── organizer/
│   │   │   ├── OrganizerDashboard.jsx — Own hackathons table with edit/delete
│   │   │   └── HackathonForm.jsx      — Shared create/edit form with banner preview
│   │   │
│   │   └── admin/
│   │       ├── AdminDashboard.jsx     — Overview cards linking to all admin sections
│   │       ├── PendingOrganizers.jsx  — Approve/reject organizer requests
│   │       ├── ManageCourses.jsx      — Create courses + link to articles
│   │       ├── ManageArticles.jsx     — Create articles inside a course
│   │       └── ManageCheatsheets.jsx  — Create cheatsheets with auto-slug
│   │
│   ├── App.jsx     — All route definitions
│   └── main.jsx    — React entry point, Bootstrap imports, BrowserRouter
│
├── index.html
├── package.json
└── vite.config.js
```

---

## Complete User Flow

### 1. Landing — Unauthenticated

When a user visits any protected route without being logged in, `ProtectedRoute` redirects them to `/login`.

The only public routes are `/login` and `/register`.

---

### 2. Register — `/register`

**What the user does:**
- Fills in: Full Name, Email, Password (min 6 chars), Account Type (User or Organizer)
- Clicks "Create Account"

**What happens:**
- Calls `POST /api/auth/register`
- If role is `user`: success message shown, redirects to `/login` after 2 seconds
- If role is `organizer`: success message shown explaining account needs admin approval — no redirect, user must wait

**Organizer note:** Organizer accounts are created with `account_status = pending`. They cannot log in until an admin approves them.

---

### 3. Login — `/login`

**What the user does:**
- Fills in: Email, Password
- Clicks "Sign In"

**What happens:**
- Calls `POST /api/auth/login`
- Backend returns `{ success, id, email, role, token }`
- Token and user object `{ id, email, role }` are saved to `localStorage`
- `AuthContext` state is updated
- Redirect based on role:
  - `admin` → `/admin/dashboard`
  - `organizer` → `/organizer/dashboard`
  - `user` → `/` (Home)

---

### 4. Home — `/`

**Who sees it:** All authenticated users

**What's on the page:**
- Hero section with personalized greeting using `user.name` or `user.email`
- "Browse Courses" and "Explore Hackathons" CTA buttons
- Feature cards: Courses, Hackathons, Cheatsheets
- Bookmarks card shown only to `user` role

---

### 5. Courses — `/courses`

**Who sees it:** All authenticated users

**What happens on load:**
- Calls `GET /api/courses` to fetch all active courses
- For each course, calls `GET /api/progress/:courseId` to get completion percentage
- All progress calls run in parallel using `Promise.allSettled`

**What the user sees:**
- Course cards in a 3-column grid
- Each card shows: title, description, progress bar (%), article count
- Button label changes dynamically: "Start" (0%), "Continue" (1-99%), "Review" (100%)
- Progress bar turns green at 100%

**Navigation:** Clicking a course card or button goes to `/courses/:id`

---

### 6. Course Detail — `/courses/:id`

**Who sees it:** All authenticated users

**What happens on load:**
- Calls `GET /api/courses/:id` and `GET /api/articles/course/:id` in parallel
- Calls `GET /api/progress/:id` for the progress sidebar

**What the user sees:**
- Course title and description
- Ordered list of articles — each shows: number badge, title, Read button, Mark Complete button
- Completed articles show green background + checkmark
- Sticky progress sidebar on the right showing % and article count
- "🎉 Course Complete!" alert when all articles are done

**Mark Complete flow:**
- User clicks "Mark Complete" on an article
- Calls `POST /api/progress/complete` with `{ articleId }`
- Article turns green immediately (optimistic update via `completedIds` Set)
- Progress sidebar refreshes

**Navigation:** Breadcrumb → Courses. Article title links to `/articles/:id`

---

### 7. Article Reader — `/articles/:id`

**Who sees it:** All authenticated users

**What the user sees:**
- Article title, order badge, full content
- Content is split by newlines and rendered as paragraphs
- "← Back to Course" button (uses `article.course_id`)
- "Mark as Complete" button at the bottom — turns into green "Completed" button after clicking

**Mark Complete flow:**
- Calls `POST /api/progress/complete` with `{ articleId: Number(id) }`
- Button state changes to disabled green "Completed"

---

### 8. Hackathons — `/hackathons`

**Who sees it:** All authenticated users

**What happens on load:**
- Calls `GET /api/hackathons` with optional `?search=&status=` query params
- Re-fetches automatically when search or status filter changes (via `useCallback` + `useEffect`)

**What the user sees:**
- Search bar (filters by title)
- Status dropdown: All / Upcoming / Active / Completed
- Clear Filters button
- Hackathon cards showing: banner image, title, status badge, organizer name, description, start/end dates, Register button, Bookmark button

**Status badges:**
- `upcoming` → blue
- `active` → green
- `completed` → grey

**Bookmark flow (user role only):**
- Bookmark button (star icon) calls `POST /api/hackathons/:id/bookmark`
- Button turns filled yellow when bookmarked
- Calls the same endpoint again to toggle (backend returns 400 if already bookmarked — handled gracefully)

**Register button:** Opens `registration_link` in a new tab

---

### 9. Bookmarks — `/bookmarks`

**Who sees it:** `user` role only (RoleRoute enforced)

**What happens on load:**
- Calls `GET /api/hackathons/bookmarks/me`

**What the user sees:**
- Grid of bookmarked hackathon cards
- Each card has a red trash icon button to remove the bookmark
- Empty state with "Browse Hackathons" link

**Remove bookmark flow:**
- Calls `DELETE /api/hackathons/:id/bookmark`
- Card is removed from the list immediately

---

### 10. Cheatsheets — `/cheatsheets`

**Who sees it:** All authenticated users

**What happens on load:**
- Calls `GET /api/cheatsheets`

**What the user sees:**
- Search bar (filters by title or category in real time — no API call, client-side filter)
- Results grouped by category with section headers
- Each cheatsheet shown as a card with file icon, title, and slug

**Navigation:** Clicking a card goes to `/cheatsheets/:slug`

---

### 11. Cheatsheet Detail — `/cheatsheets/:slug`

**What happens on load:**
- Calls `GET /api/cheatsheets/:slug`

**What the user sees:**
- Title, category badge, slug
- Content displayed in a monospace `<pre>` block with word wrap
- "← Back to Cheatsheets" button

---

## Organizer Flow

### Organizer Dashboard — `/organizer/dashboard`

**Who sees it:** `organizer` and `admin` roles

**What happens on load:**
- Calls `GET /api/hackathons` (public endpoint)
- Filters results client-side to only show hackathons where `organizer_id === user.id`

**What the organizer sees:**
- Table of own hackathons: title, status badge, start date, end date, Edit/Delete buttons
- "+ Create Hackathon" button in the top right
- Empty state with "Create Your First Hackathon" button

**Delete flow:**
- `window.confirm()` dialog shown first
- Calls `DELETE /api/hackathons/:id`
- Row removed from table immediately

---

### Create Hackathon — `/organizer/hackathons/new`

**Form fields:** Title*, Description, Banner URL (with live preview), Registration Link, Start Date*, End Date*

**On submit:**
- Calls `POST /api/hackathons`
- Success message shown, redirects to `/organizer/dashboard` after 1.5 seconds

---

### Edit Hackathon — `/organizer/hackathons/:id/edit`

**On load:**
- Calls `GET /api/hackathons/:id` and pre-fills the form

**On submit:**
- Calls `PUT /api/hackathons/:id`
- Success message shown, redirects to `/organizer/dashboard` after 1.5 seconds

---

## Admin Flow

### Admin Dashboard — `/admin/dashboard`

**Who sees it:** `admin` role only

**What's on the page:**
- 4 cards linking to: Pending Organizers, Courses, Cheatsheets, Hackathons

---

### Pending Organizers — `/admin/organizers`

**What happens on load:**
- Calls `GET /api/admin/organizers/pending`

**What the admin sees:**
- Table of organizers with `account_status = pending`: name, email, registration date
- Approve (green) and Reject (red outline) buttons per row

**Approve flow:**
- Calls `PUT /api/admin/organizers/:userId/approve`
- Row removed from table, success message shown
- Organizer can now log in and create hackathons

**Reject flow:**
- `window.confirm()` dialog shown first
- Calls `PUT /api/admin/organizers/:userId/reject`
- Row removed from table

---

### Manage Courses — `/admin/courses`

**What happens on load:**
- Calls `GET /api/courses`

**What the admin sees:**
- Table of all courses with "Manage Articles" button per row
- Collapsible "+ New Course" form at the top

**Create course flow:**
- Fills in title and description
- Calls `POST /api/courses`
- New course added to table immediately

**Navigation:** "Manage Articles" button goes to `/admin/courses/:courseId/articles`

---

### Manage Articles — `/admin/courses/:courseId/articles`

**What happens on load:**
- Calls `GET /api/courses/:id` and `GET /api/articles/course/:courseId` in parallel

**What the admin sees:**
- Course name in the header
- "← Courses" back button
- Collapsible "+ New Article" form
- List of articles sorted by `order` field, each showing: order badge, title, content preview, Preview button

**Create article flow:**
- Fills in title, content, and optional order number
- If order is blank, defaults to `articles.length + 1`
- Calls `POST /api/articles`
- New article added to list immediately

**Preview button:** Opens `/articles/:id` in a new tab

---

### Manage Cheatsheets — `/admin/cheatsheets`

**What happens on load:**
- Calls `GET /api/cheatsheets`

**What the admin sees:**
- Table of all cheatsheets: title, slug (code style), category badge, View button
- Collapsible "+ New Cheatsheet" form

**Create cheatsheet flow:**
- Fills in title (slug auto-generates from title as you type), category, content
- Calls `POST /api/cheatsheets`
- Duplicate slug returns 409 with clear error message
- New cheatsheet added to table immediately

---

## How Authentication Works

### Token storage

After login, two items are saved to `localStorage`:
- `token` — the JWT string
- `user` — JSON stringified `{ id, email, role }`

### AuthContext

`src/context/AuthContext.jsx` reads from `localStorage` on mount and provides:

```js
const { user, token, login, logout, loading } = useAuth()
```

- `loading` is `true` during the initial localStorage read — prevents flash of login redirect

### Axios interceptor (request)

Every API call automatically attaches the token:

```js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
```

### Axios interceptor (response)

On any `401` response, clears storage and redirects to login:

```js
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

### Route guards

**ProtectedRoute** — any authenticated user:
```jsx
<ProtectedRoute><Courses /></ProtectedRoute>
```

**RoleRoute** — specific roles only:
```jsx
<RoleRoute roles={['admin']}><AdminDashboard /></RoleRoute>
```

Both show a spinner while `loading` is true, then redirect if the check fails.

---

## Navbar Behavior

The Navbar reads `user` from `AuthContext` and shows different links:

| Condition | Links shown |
|-----------|-------------|
| Not logged in | Login, Register |
| Any logged-in user | Home, Courses, Hackathons, Cheatsheets |
| `user` role | + Bookmarks |
| `organizer` role | + My Hackathons |
| `admin` role | + Admin Dashboard |
| Non-user role | Badge showing role (organizer/admin) next to email |

---

## API Response Handling

The backend wraps most list/detail responses as:
```json
{ "success": true, "data": [...] }
```

All pages use `res.data.data ?? res.data` to safely handle both wrapped and plain responses.

---

## How to Create an Admin Account

Admin accounts cannot be registered through the UI. To create one:

1. Register a normal account on `/register`
2. Run this SQL in your database:

```sql
UPDATE users
SET role = 'admin', account_status = 'approved'
WHERE email = 'your@email.com';
```

3. Log in — you will be redirected to `/admin/dashboard`

---

## Seed / Test Accounts

If you imported `schema/seed.sql`, these accounts are available:

| Email | Password | Role |
|-------|----------|------|
| admin@weblearnx.com | password123 | admin |
| zain@weblearnx.com | password123 | user |
| sara@weblearnx.com | password123 | user |
| devorg@weblearnx.com | password123 | organizer (approved) |
| techhub@weblearnx.com | password123 | organizer (approved) |
| pending@weblearnx.com | password123 | organizer (pending) |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

---

## Common Issues

**Blank page / infinite spinner**
- Check browser console for errors
- Make sure backend is running at `http://localhost:5000`
- Check `DB_NAME` in backend `.env` matches your database

**401 on every request**
- Token is expired or invalid — log out and log in again
- Check `JWT_SECRET` in backend `.env` is not empty

**400 on register/login**
- Check backend terminal for the exact error
- Most likely `users` table is missing `account_status` column — run:
```sql
ALTER TABLE users
  MODIFY COLUMN role ENUM('user', 'organizer', 'admin') DEFAULT 'user',
  ADD COLUMN IF NOT EXISTS account_status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved' AFTER role;
```

**Seed users get "invalid credentials"**
- The seed passwords need to be updated — run in your database:
```sql
UPDATE users
SET password = '$2b$10$b63K9WCp.Uz2rKcdhcdEpeXeIBe9FzfX9jWed6o7He.8eyf2OxL9W'
WHERE email IN ('admin@weblearnx.com','zain@weblearnx.com','sara@weblearnx.com',
                'devorg@weblearnx.com','techhub@weblearnx.com','pending@weblearnx.com');
```

**Bookmarks not deleting**
- Make sure backend has `DELETE /api/hackathons/:hackathonId/bookmark` route
- Restart backend after any route changes
