import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCheatsheets } from '../../api/cheatsheets'

export default function Cheatsheets() {
  const [cheatsheets, setCheatsheets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchCheatsheets = async () => {
      try {
        const res = await getCheatsheets()
        setCheatsheets(res.data.data ?? res.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load cheatsheets.')
      } finally {
        setLoading(false)
      }
    }
    fetchCheatsheets()
  }, [])

  const filtered = cheatsheets.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.category && c.category.toLowerCase().includes(search.toLowerCase()))
  )

  // Group by category
  const grouped = filtered.reduce((acc, cs) => {
    const cat = cs.category || 'General'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(cs)
    return acc
  }, {})

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
        <h2 className="fw-bold mb-0">Cheatsheets</h2>
        <span className="badge bg-secondary fs-6">{cheatsheets.length} total</span>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 && !error && (
        <div className="text-center py-5 text-muted">
          <p className="fs-5">No cheatsheets found.</p>
        </div>
      )}

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="mb-5">
          <h5 className="fw-semibold text-muted mb-3 border-bottom pb-2">{category}</h5>
          <div className="row g-3">
            {items.map((cs) => (
              <div key={cs.id} className="col-md-6 col-lg-4">
                <Link
                  to={`/cheatsheets/${cs.slug}`}
                  className="card h-100 text-decoration-none border-0 shadow-sm card-hover"
                >
                  <div className="card-body">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: 44, height: 44 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#0d6efd" viewBox="0 0 16 16">
                          <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                        </svg>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0 text-dark">{cs.title}</h6>
                        <small className="text-muted">{cs.slug}</small>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
