import { useAuth } from '../../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="fw-bold mb-4">My Profile</h2>
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <div
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center fw-bold fs-2"
                  style={{ width: 80, height: 80 }}
                >
                  {(user?.name || user?.email)?.[0]?.toUpperCase()}
                </div>
                {user?.name && <div className="fw-bold mt-2 fs-5">{user.name}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label text-muted small fw-semibold">EMAIL</label>
                <p className="fw-semibold mb-0">{user?.email}</p>
              </div>
              <hr />
              <div className="mb-3">
                <label className="form-label text-muted small fw-semibold">ROLE</label>
                <p className="mb-0">
                  <span className={`badge ${user?.role === 'admin' ? 'bg-danger' : user?.role === 'organizer' ? 'bg-warning text-dark' : 'bg-primary'}`}>
                    {user?.role}
                  </span>
                </p>
              </div>
              <hr />
              <div className="mb-0">
                <label className="form-label text-muted small fw-semibold">USER ID</label>
                <p className="text-muted mb-0">#{user?.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
