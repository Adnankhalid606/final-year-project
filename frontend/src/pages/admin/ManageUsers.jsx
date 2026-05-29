import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllUsers, deleteUser } from '../../api/admin'

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [deleting, setDeleting] = useState(null)

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers()
      setUsers(res.data.data ?? res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleDelete = async (userId, email) => {
    if (!window.confirm(`Delete user ${email}? This cannot be undone.`)) return
    setDeleting(userId)
    try {
      await deleteUser(userId)
      setUsers(prev => prev.filter(u => u.id !== userId))
      setSuccessMsg('User deleted successfully.')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.')
    } finally {
      setDeleting(null)
    }
  }

  const roleBadge = (role) => {
    const map = { admin: 'bg-danger', organizer: 'bg-warning text-dark', user: 'bg-primary' }
    return <span className={`badge ${map[role] || 'bg-secondary'}`}>{role}</span>
  }

  const statusBadge = (status) => {
    const map = { approved: 'bg-success', pending: 'bg-warning text-dark', rejected: 'bg-danger' }
    return <span className={`badge ${map[status] || 'bg-secondary'}`}>{status}</span>
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link to="/admin/dashboard" className="btn btn-outline-secondary btn-sm">← Dashboard</Link>
        <div>
          <h2 className="fw-bold mb-0">Manage Users</h2>
          <p className="text-muted mb-0 small">View and manage all platform users</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <h6 className="fw-bold mb-0">All Users ({users.length})</h6>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={u.id}>
                  <td className="text-muted">{idx + 1}</td>
                  <td className="fw-semibold">{u.name || '—'}</td>
                  <td className="text-muted">{u.email}</td>
                  <td>{roleBadge(u.role)}</td>
                  <td>{statusBadge(u.account_status)}</td>
                  <td className="text-muted small">
                    {u.created_at ? new Date(u.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                  </td>
                  <td className="text-end">
                    {u.role !== 'admin' && (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(u.id, u.email)}
                        disabled={deleting === u.id}
                      >
                        {deleting === u.id ? <span className="spinner-border spinner-border-sm" /> : 'Delete'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
