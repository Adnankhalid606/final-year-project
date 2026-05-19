import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getPendingOrganizers, approveOrganizer, rejectOrganizer } from '../../api/admin'

export default function PendingOrganizers() {
  const [organizers, setOrganizers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [processing, setProcessing] = useState(null)

  const fetchOrganizers = async () => {
    try {
      const res = await getPendingOrganizers()
      setOrganizers(res.data.data ?? res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load pending organizers.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrganizers()
  }, [])

  const handleApprove = async (userId, name) => {
    setProcessing(`approve-${userId}`)
    setError('')
    try {
      await approveOrganizer(userId)
      setOrganizers((prev) => prev.filter((o) => o.id !== userId))
      setSuccessMsg(`${name} has been approved as an organizer.`)
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve organizer.')
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to reject ${name}'s organizer request?`)) return
    setProcessing(`reject-${userId}`)
    setError('')
    try {
      await rejectOrganizer(userId)
      setOrganizers((prev) => prev.filter((o) => o.id !== userId))
      setSuccessMsg(`${name}'s organizer request has been rejected.`)
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject organizer.')
    } finally {
      setProcessing(null)
    }
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
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link to="/admin/dashboard" className="btn btn-outline-secondary btn-sm">← Dashboard</Link>
        <div>
          <h2 className="fw-bold mb-0">Pending Organizers</h2>
          <p className="text-muted mb-0 small">Review organizer account requests</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {organizers.length === 0 && !error && (
        <div className="text-center py-5">
          <div className="text-success mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
          </div>
          <p className="fs-5 text-muted">No pending organizer requests.</p>
        </div>
      )}

      {organizers.length > 0 && (
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Registered</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {organizers.map((org) => (
                  <tr key={org.id}>
                    <td className="fw-semibold">{org.name}</td>
                    <td className="text-muted">{org.email}</td>
                    <td className="text-muted small">
                      {org.created_at
                        ? new Date(org.created_at).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleApprove(org.id, org.name)}
                          disabled={processing !== null}
                        >
                          {processing === `approve-${org.id}` ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          ) : 'Approve'}
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleReject(org.id, org.name)}
                          disabled={processing !== null}
                        >
                          {processing === `reject-${org.id}` ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          ) : 'Reject'}
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
