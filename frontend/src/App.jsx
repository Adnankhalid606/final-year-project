import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import RoleRoute from './components/RoleRoute'

// Public pages
import Landing from './pages/public/Landing'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// User pages
import Home from './pages/user/Home'
import Courses from './pages/user/Courses'
import CourseDetail from './pages/user/CourseDetail'
import ArticleReader from './pages/user/ArticleReader'
import Hackathons from './pages/user/Hackathons'
import HackathonDetail from './pages/user/HackathonDetail'
import Bookmarks from './pages/user/Bookmarks'
import Cheatsheets from './pages/user/Cheatsheets'
import CheatsheetDetail from './pages/user/CheatsheetDetail'
import Profile from './pages/user/Profile'

// Organizer pages
import OrganizerDashboard from './pages/organizer/OrganizerDashboard'
import HackathonForm from './pages/organizer/HackathonForm'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import PendingOrganizers from './pages/admin/PendingOrganizers'
import ManageCourses from './pages/admin/ManageCourses'
import ManageArticles from './pages/admin/ManageArticles'
import ManageCheatsheets from './pages/admin/ManageCheatsheets'
import ManageUsers from './pages/admin/ManageUsers'
import ManageHackathons from './pages/admin/ManageHackathons'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          {/* Public routes — no login needed */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected dashboard — logged-in users */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/articles/:id"
            element={
              <ProtectedRoute>
                <ArticleReader />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hackathons"
            element={
              <ProtectedRoute>
                <Hackathons />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hackathons/:id"
            element={
              <ProtectedRoute>
                <HackathonDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cheatsheets"
            element={
              <ProtectedRoute>
                <Cheatsheets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cheatsheets/:slug"
            element={
              <ProtectedRoute>
                <CheatsheetDetail />
              </ProtectedRoute>
            }
          />

          {/* User-only routes */}
          <Route
            path="/bookmarks"
            element={
              <RoleRoute roles={['user']}>
                <Bookmarks />
              </RoleRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Organizer routes */}
          <Route
            path="/organizer/dashboard"
            element={
              <RoleRoute roles={['organizer', 'admin']}>
                <OrganizerDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/organizer/hackathons/new"
            element={
              <RoleRoute roles={['organizer', 'admin']}>
                <HackathonForm />
              </RoleRoute>
            }
          />
          <Route
            path="/organizer/hackathons/:id/edit"
            element={
              <RoleRoute roles={['organizer', 'admin']}>
                <HackathonForm />
              </RoleRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <RoleRoute roles={['admin']}>
                <AdminDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/organizers"
            element={
              <RoleRoute roles={['admin']}>
                <PendingOrganizers />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <RoleRoute roles={['admin']}>
                <ManageCourses />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/courses/:courseId/articles"
            element={
              <RoleRoute roles={['admin']}>
                <ManageArticles />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/cheatsheets"
            element={
              <RoleRoute roles={['admin']}>
                <ManageCheatsheets />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RoleRoute roles={['admin']}>
                <ManageUsers />
              </RoleRoute>
            }
          />
          <Route
            path="/admin/hackathons"
            element={
              <RoleRoute roles={['admin']}>
                <ManageHackathons />
              </RoleRoute>
            }
          />

          {/* Catch-all — 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="bg-white border-top py-3 mt-auto">
        <div className="container text-center text-muted small">
          © {new Date().getFullYear()} DEVSIQ. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
