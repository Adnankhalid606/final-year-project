import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getCheatsheet } from '../../api/cheatsheets'

export default function CheatsheetDetail() {
  const { slug } = useParams()
  const [cheatsheet, setCheatsheet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCheatsheet = async () => {
      try {
        const res = await getCheatsheet(slug)
        setCheatsheet(res.data.data ?? res.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load cheatsheet.')
      } finally {
        setLoading(false)
      }
    }
    fetchCheatsheet()
  }, [slug])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
        <Link to="/cheatsheets" className="btn btn-secondary">Back to Cheatsheets</Link>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-9">
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/cheatsheets">Cheatsheets</Link></li>
              <li className="breadcrumb-item active">{cheatsheet?.title}</li>
            </ol>
          </nav>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-lg-5">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h1 className="fw-bold">{cheatsheet?.title}</h1>
                {cheatsheet?.category && (
                  <span className="badge bg-primary">{cheatsheet.category}</span>
                )}
              </div>
              <p className="text-muted small mb-4">/{cheatsheet?.slug}</p>

              <hr />

              {/* Markdown rendered content */}
              <div className="mt-4 markdown-body" style={{ lineHeight: 1.8 }}>
                {cheatsheet?.content ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {cheatsheet.content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-muted">No content available.</p>
                )}
              </div>

              <div className="mt-5">
                <Link to="/cheatsheets" className="btn btn-outline-secondary">
                  ← Back to Cheatsheets
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
