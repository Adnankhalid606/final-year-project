import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          WebLearnX
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/courses">Courses</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/hackathons">Hackathons</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/cheatsheets">Cheatsheets</Link>
                </li>
                {user.role === 'user' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/bookmarks">Bookmarks</Link>
                  </li>
                )}
                {user.role === 'organizer' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/organizer/dashboard">My Hackathons</Link>
                  </li>
                )}
                {user.role === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin/dashboard">Admin Dashboard</Link>
                  </li>
                )}
              </>
            )}
          </ul>

          <ul className="navbar-nav ms-auto align-items-center">
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link text-light opacity-75">
                    <small>{user.email}</small>
                    {user.role !== 'user' && (
                      <span className="badge bg-warning text-dark ms-2">{user.role}</span>
                    )}
                  </span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
