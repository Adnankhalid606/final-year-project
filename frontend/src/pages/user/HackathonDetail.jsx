import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getHackathon, bookmarkHackathon, getMyBookmarks } from '../../api/hackathons'
import { useAuth } from '../../context/AuthContext'

function StatusBadge({ status }) {
  const map = {
    upcoming: 'bg-primary',
    active: 'bg-success',
    completed: 'bg-secondary',
  }
  return (
    <span className={`badge ${map[status] || 'bg-secondary'} text-capitalize fs-6`}>
      {status}
    </span>
  )
}

export default function HackathonDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [hackathon, setHackathon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [bookmarked, setBookmarked] = useState(false)
  const [bookmarking, setBookmarking] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHackathon(id)
        setHackathon(res.data.data ?? res.data)

        if (user?.role === 'user') {
          const bmRes = await getMyBookmarks()
          const data = bmRes.data.data ?? bmRes.data
          const ids = new Set(data.map((b) => b.id || b.hackathon_id))
          setBookmarked(ids.has(Number(id)))
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load hackathon.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, user])

  const handleBookmark = async () => {
    if (user?.role !== 'user') return
    setBookmarking(true)
    try {
      await bookmarkHackathon(Number(id))
      setBookmarked((prev) => !prev)
      setSuccessMsg(bookmarked ? 'Bookmark removed.' : 'Hackathon bookmarked!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to bookmark.')
    } finally {
      setBookmarking(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
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

  if (error && !hackathon) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
        <Link to="/hackathons" className="btn btn-secondary">← Back to Hackathons</Link>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">

          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/hackathons">Hackathons</Link></li>
              <li className="breadcrumb-item active">{hackathon?.title}</li>
            </ol>
          </nav>

          {error && <div className="alert alert-danger">{error}</div>}
          {successMsg && <div className="alert alert-success">{successMsg}</div>}

          {/* Banner */}
          {hackathon?.banner && (
            <img
              src={hackathon.banner}
              alt={hackathon.title}
              className="w-100 rounded-3 mb-4 shadow-sm"
              style={{ maxHeight: 300, objectFit: 'cover' }}
              onError={(e) => { e.target.style.display = 'none' }}
            />
          )}

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-lg-5">

              {/* Header */}
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                <h1 className="fw-bold mb-0" style={{ fontSize: '1.75rem' }}>{hackathon?.title}</h1>
                <StatusBadge status={hackathon?.status} />
              </div>

              {hackathon?.organizer_name && (
                <p className="text-muted mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="me-1" viewBox="0 0 16 16">
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                  </svg>
                  Organized by <strong>{hackathon.organizer_name}</strong>
                </p>
              )}

              {/* Dates */}
              <div className="d-flex gap-4 mb-4 flex-wrap">
                <div className="d-flex align-items-center gap-2 text-muted">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                  </svg>
                  <span><strong>Start:</strong> {formatDate(hackathon?.start_date)}</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-muted">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                  </svg>
                  <span><strong>End:</strong> {formatDate(hackathon?.end_date)}</span>
                </div>
              </div>

              <hr className="mb-4" />

              {/* Description — rendered as markdown */}
              <div style={{ lineHeight: 1.8, fontSize: '1.05rem' }}>
                {hackathon?.description ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {hackathon.description}
                  </ReactMarkdown>
                ) : (
                  <p className="text-muted">No description provided.</p>
                )}
              </div>

              <hr className="mt-4" />

              {/* Actions */}
              <div className="d-flex gap-3 align-items-center flex-wrap mt-4">
                <Link to="/hackathons" className="btn btn-outline-secondary">
                  ← Back to Hackathons
                </Link>

                {hackathon?.registration_link && (
                  <a
                    href={hackathon.registration_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Register Now ↗
                  </a>
                )}

                {user?.role === 'user' && (
                  <button
                    className={`btn ${bookmarked ? 'btn-warning' : 'btn-outline-warning'}`}
                    onClick={handleBookmark}
                    disabled={bookmarking}
                    title={bookmarked ? 'Remove bookmark' : 'Bookmark this hackathon'}
                  >
                    {bookmarking ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                        <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>
                      </svg>
                    )}
                    {bookmarked ? 'Bookmarked' : 'Bookmark'}
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
