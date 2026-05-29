import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isLanding = location.pathname === '/'

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{
      background: isLanding ? 'transparent' : 'rgba(15,23,42,0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: isLanding ? 'none' : '1px solid rgba(255,255,255,0.08)',
      boxShadow: isLanding ? 'none' : '0 1px 40px rgba(0,0,0,0.3)',
      padding: '0.9rem 0',
      position: isLanding ? 'absolute' : 'sticky',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
    }}>
      <div className="container">
        <Link className="navbar-brand" to="/" style={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 800,
          fontSize: '1.4rem',
          background: 'linear-gradient(135deg, #a5b4fc, #818cf8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.5px',
        }}>
          ⚡ DEVSIQ
        </Link>

        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse"
          data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto ms-3">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {user && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/courses">Courses</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/hackathons"> Hackathons</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/cheatsheets">Cheatsheets</Link></li>
                {user.role === 'user' && <li className="nav-item"><Link className="nav-link" to="/bookmarks">Bookmarks</Link></li>}
                {user.role === 'organizer' && <li className="nav-item"><Link className="nav-link" to="/organizer/dashboard">My Hackathons</Link></li>}
                {user.role === 'admin' && (
                  <>
                    <li className="nav-item"><Link className="nav-link" to="/admin/dashboard">Admin</Link></li>
                    <li className="nav-item"><Link className="nav-link" to="/organizer/hackathons/new">Create Hackathon</Link></li>
                  </>
                )}
              </>
            )}
          </ul>

          <ul className="navbar-nav ms-auto align-items-center gap-2">
            {user ? (
              <>
                <li className="nav-item">
                  <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: '0.8rem',
                    }}>
                      {(user.name || user.email)?.[0]?.toUpperCase()}
                    </div>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                      {user.name || user.email}
                    </span>
                    {user.role !== 'user' && (
                      <span className="badge" style={{ background: 'rgba(99,102,241,0.3)', color: '#a5b4fc', fontSize: '0.7rem' }}>{user.role}</span>
                    )}
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-sm px-3 py-2" onClick={handleLogout}
                    style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8 }}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="btn btn-sm px-4 py-2"
                    style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8 }}>
                    Sign In
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="btn btn-primary btn-sm px-4 py-2">
                    Get Started
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
