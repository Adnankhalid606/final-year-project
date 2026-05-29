import { useState, useEffect, useCallback } from 'react'
import { getHackathons, bookmarkHackathon, getMyBookmarks } from '../../api/hackathons'
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

export default function Hackathons() {
  const { user } = useAuth()
  const [hackathons, setHackathons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [bookmarking, setBookmarking] = useState(null)
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set())
  const [successMsg, setSuccessMsg] = useState('')

  const fetchHackathons = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter
      const res = await getHackathons(params)
      setHackathons(res.data.data ?? res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load hackathons.')
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter])

  useEffect(() => {
    fetchHackathons()
    if (user?.role === 'user') {
      getMyBookmarks().then(res => {
        const data = res.data.data ?? res.data
        const ids = new Set(data.map(b => b.id || b.hackathon_id))
        setBookmarkedIds(ids)
      }).catch(() => {})
    }
  }, [fetchHackathons])

  const handleBookmark = async (hackathonId) => {
    if (user?.role !== 'user') return
    setBookmarking(hackathonId)
    try {
      await bookmarkHackathon(hackathonId)
      setBookmarkedIds((prev) => {
        const next = new Set(prev)
        if (next.has(hackathonId)) {
          next.delete(hackathonId)
          setSuccessMsg('Bookmark removed.')
        } else {
          next.add(hackathonId)
          setSuccessMsg('Hackathon bookmarked!')
        }
        return next
      })
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to bookmark.')
    } finally {
      setBookmarking(null)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    })
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Hackathons</h2>

      {/* Search & Filter */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
              </svg>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search hackathons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="col-md-3">
          <button className="btn btn-outline-secondary w-100" onClick={() => { setSearch(''); setStatusFilter('') }}>
            Clear Filters
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : hackathons.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p className="fs-5">No hackathons found.</p>
        </div>
      ) : (
        <div className="row g-4">
          {hackathons.map((h) => (
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
                    <p className="text-muted small mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="me-1" viewBox="0 0 16 16">
                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                      </svg>
                      {h.organizer_name}
                    </p>
                  )}
                  <p className="card-text text-muted small flex-grow-1">
                    {h.description?.substring(0, 120)}{h.description?.length > 120 ? '...' : ''}
                  </p>
                  <div className="mt-2 mb-3">
                    <div className="d-flex gap-3 text-muted small">
                      <span>
                        <strong>Start:</strong> {formatDate(h.start_date)}
                      </span>
                      <span>
                        <strong>End:</strong> {formatDate(h.end_date)}
                      </span>
                    </div>
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
                    {user?.role === 'user' && (
                      <button
                        className={`btn btn-sm ${bookmarkedIds.has(h.id) ? 'btn-warning' : 'btn-outline-warning'}`}
                        onClick={() => handleBookmark(h.id)}
                        disabled={bookmarking === h.id}
                        title={bookmarkedIds.has(h.id) ? 'Remove bookmark' : 'Bookmark'}
                      >
                        {bookmarking === h.id ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
