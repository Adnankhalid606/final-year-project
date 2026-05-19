import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getHackathons, deleteHackathon } from '../../api/hackathons'
import { useAuth } from '../../context/AuthContext'

function StatusBadge({ status }) {
  const map = {
    upcoming: 'bg-primary',
    active: 'bg-success',
    completed: 'bg-secondary',
  }
  return (
    <span className={`badge ${map[status] || 'bg-secondary'} text-capitalize`}>
      {status}
    </span>
  )
}

export default function OrganizerDashboard() {
  const { user } = useAuth()
  const [hackathons, setHackathons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [deleting, setDeleting] = useState(null)

  const fetchHackathons = async () => {
    try {
      const res = await getHackathons()
      const allHackathons = res.data.data ?? res.data
      const mine = allHackathons.filter((h) => h.organizer_id === user?.id)
      setHackathons(mine)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load hackathons.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHackathons()
  }, [])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return
    }
    setDeleting(id)
    setError('')
    try {
      await deleteHackathon(id)
      setHackathons((prev) => prev.filter((h) => h.id !== id))
      setSuccessMsg('Hackathon deleted successfully.')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete hackathon.')
    } finally {
      setDeleting(null)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">My Hackathons</h2>
          <p className="text-muted mb-0">Manage your hackathon listings</p>
        </div>
        <Link to="/organizer/hackathons/new" className="btn btn-primary">
          + Create Hackathon
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {hackathons.length === 0 && !error && (
        <div className="text-center py-5">
          <p className="text-muted fs-5 mb-3">You haven't created any hackathons yet.</p>
          <Link to="/organizer/hackathons/new" className="btn btn-primary">
            Create Your First Hackathon
          </Link>
        </div>
      )}

      {hackathons.length > 0 && (
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hackathons.map((h) => (
                  <tr key={h.id}>
                    <td>
                      <div className="fw-semibold">{h.title}</div>
                      {h.description && (
                        <small className="text-muted">
                          {h.description.substring(0, 60)}{h.description.length > 60 ? '...' : ''}
                        </small>
                      )}
                    </td>
                    <td><StatusBadge status={h.status} /></td>
                    <td>{formatDate(h.start_date)}</td>
                    <td>{formatDate(h.end_date)}</td>
                    <td className="text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        <Link
                          to={`/organizer/hackathons/${h.id}/edit`}
                          className="btn btn-outline-primary btn-sm"
                        >
                          Edit
                        </Link>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(h.id, h.title)}
                          disabled={deleting === h.id}
                        >
                          {deleting === h.id ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          ) : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
