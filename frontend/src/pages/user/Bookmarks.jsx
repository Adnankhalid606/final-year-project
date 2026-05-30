import { useState, useEffect } from 'react'
import { getMyBookmarks, removeBookmark } from '../../api/hackathons'

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

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [removing, setRemoving] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  const fetchBookmarks = async () => {
    try {
      const res = await getMyBookmarks()
      setBookmarks(res.data.data ?? res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookmarks.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookmarks()
  }, [])

  const handleRemove = async (hackathonId) => {
    setRemoving(hackathonId)
    try {
      await removeBookmark(hackathonId)
      setBookmarks((prev) => prev.filter((b) => b.id !== hackathonId && b.hackathon_id !== hackathonId))
      setSuccessMsg('Bookmark removed.')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove bookmark.')
    } finally {
      setRemoving(null)
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
      <h2 className="fw-bold mb-4">My Bookmarked Hackathons</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {bookmarks.length === 0 && !error && (
        <div className="text-center py-5">
          <div className="text-muted mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>
            </svg>
          </div>
          <p className="fs-5 text-muted">No bookmarks yet.</p>
          <a href="/hackathons" className="btn btn-primary">Browse Hackathons</a>
        </div>
      )}

      <div className="row g-4">
        {bookmarks.map((h) => (
          <div key={h.id} className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0">
              {h.banner && (
                <img
                  src={h.banner}
                  className="card-img-top"
                  alt={h.title}
                  style={{ height: 160, objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="card-title fw-bold mb-0">{h.title}</h5>
                  <StatusBadge status={h.status} />
                </div>
                {h.organizer_name && (
                  <p className="text-muted small mb-2">by {h.organizer_name}</p>
                )}
                <div className="mt-2 mb-3 text-muted small">
                  <div><strong>Start:</strong> {formatDate(h.start_date)}</div>
                  <div><strong>End:</strong> {formatDate(h.end_date)}</div>
                </div>
                <div className="d-flex gap-2 mt-auto">
                  {h.registration_link && (
                    <a
                      href={h.registration_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm flex-grow-1"
                    >
                      Register
                    </a>
                  )}
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleRemove(h.id)}
                    disabled={removing === h.id}
                    title="Remove bookmark"
                  >
                    {removing === h.id ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
