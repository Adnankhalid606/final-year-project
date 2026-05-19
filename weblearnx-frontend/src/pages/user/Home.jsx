import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-primary text-white py-5">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <h1 className="display-4 fw-bold mb-3">
                Welcome back, {user?.name || user?.email}!
              </h1>
              <p className="lead mb-4 opacity-75">
                Continue your learning journey. Explore courses, read articles, track your progress, and discover hackathons.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/courses" className="btn btn-light btn-lg fw-semibold">
                  Browse Courses
                </Link>
                <Link to="/hackathons" className="btn btn-outline-light btn-lg">
                  Explore Hackathons
                </Link>
              </div>
            </div>
            <div className="col-lg-5 d-none d-lg-flex justify-content-center">
              <div className="text-center opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="container py-5">
        <h2 className="text-center fw-bold mb-5">What would you like to do today?</h2>
        <div className="row g-4">
          <div className="col-md-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm text-center p-3">
              <div className="card-body">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 64, height: 64 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#0d6efd" viewBox="0 0 16 16">
                    <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/>
                  </svg>
                </div>
                <h5 className="fw-bold">Courses</h5>
                <p className="text-muted small">Structured learning paths with articles and progress tracking.</p>
                <Link to="/courses" className="btn btn-primary btn-sm">View Courses</Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm text-center p-3">
              <div className="card-body">
                <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 64, height: 64 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#198754" viewBox="0 0 16 16">
                    <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                  </svg>
                </div>
                <h5 className="fw-bold">Hackathons</h5>
                <p className="text-muted small">Discover upcoming hackathons and bookmark your favorites.</p>
                <Link to="/hackathons" className="btn btn-success btn-sm">Browse Hackathons</Link>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm text-center p-3">
              <div className="card-body">
                <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 64, height: 64 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#ffc107" viewBox="0 0 16 16">
                    <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                  </svg>
                </div>
                <h5 className="fw-bold">Cheatsheets</h5>
                <p className="text-muted small">Quick reference guides for languages and frameworks.</p>
                <Link to="/cheatsheets" className="btn btn-warning btn-sm">View Cheatsheets</Link>
              </div>
            </div>
          </div>

          {user?.role === 'user' && (
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm text-center p-3">
                <div className="card-body">
                  <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 64, height: 64 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#0dcaf0" viewBox="0 0 16 16">
                      <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>
                    </svg>
                  </div>
                  <h5 className="fw-bold">Bookmarks</h5>
                  <p className="text-muted small">Access your saved hackathons in one place.</p>
                  <Link to="/bookmarks" className="btn btn-info btn-sm text-white">My Bookmarks</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
