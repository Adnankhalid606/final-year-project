import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import RoleRoute from './components/RoleRoute'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// User pages
import Home from './pages/user/Home'
import Courses from './pages/user/Courses'
import CourseDetail from './pages/user/CourseDetail'
import ArticleReader from './pages/user/ArticleReader'
import Hackathons from './pages/user/Hackathons'
import Bookmarks from './pages/user/Bookmarks'
import Cheatsheets from './pages/user/Cheatsheets'
import CheatsheetDetail from './pages/user/CheatsheetDetail'

// Organizer pages
import OrganizerDashboard from './pages/organizer/OrganizerDashboard'
import HackathonForm from './pages/organizer/HackathonForm'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import PendingOrganizers from './pages/admin/PendingOrganizers'
import ManageCourses from './pages/admin/ManageCourses'
import ManageArticles from './pages/admin/ManageArticles'
import ManageCheatsheets from './pages/admin/ManageCheatsheets'

export default function App() {
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes — any authenticated user */}
          <Route
            path="/"
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

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="bg-white border-top py-3 mt-auto">
        <div className="container text-center text-muted small">
          © {new Date().getFullYear()} WebLearnX. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
