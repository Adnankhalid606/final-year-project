import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getArticle } from '../../api/articles'
import { completeArticle } from '../../api/progress'

export default function ArticleReader() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [completing, setCompleting] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await getArticle(id)
        setArticle(res.data.data ?? res.data)
        if ((res.data.data ?? res.data).is_completed) {
          setCompleted(true)
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load article.')
      } finally {
        setLoading(false)
      }
    }
    fetchArticle()
  }, [id])

  const handleComplete = async () => {
    setCompleting(true)
    try {
      await completeArticle(Number(id))
      setCompleted(true)
      setSuccessMsg('Article marked as complete!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark as complete.')
    } finally {
      setCompleting(false)
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

  if (error && !article) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
        <Link to="/courses" className="btn btn-secondary">Back to Courses</Link>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <nav aria-label="breadcrumb" className="mb-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><Link to="/courses">Courses</Link></li>
              {article?.course_id && (
                <li className="breadcrumb-item">
                  <Link to={`/courses/${article.course_id}`}>Course</Link>
                </li>
              )}
              <li className="breadcrumb-item active">{article?.title}</li>
            </ol>
          </nav>

          {error && <div className="alert alert-danger">{error}</div>}
          {successMsg && <div className="alert alert-success">{successMsg}</div>}

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 p-lg-5">
              <h1 className="fw-bold mb-4">{article?.title}</h1>

              {article?.order && (
                <span className="badge bg-secondary mb-3">Article #{article.order}</span>
              )}

              <hr className="mb-4" />

              <div
                className="article-content"
                style={{ lineHeight: 1.8, fontSize: '1.05rem' }}
              >
                {article?.content ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {article.content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-muted">No content available.</p>
                )}
              </div>

              <hr className="mt-4" />

              <div className="d-flex justify-content-between align-items-center mt-4">
                {article?.course_id && (
                  <Link to={`/courses/${article.course_id}`} className="btn btn-outline-secondary">
                    ← Back to Course
                  </Link>
                )}
                {completed ? (
                  <button className="btn btn-success" disabled>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                    </svg>
                    Completed
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={handleComplete}
                    disabled={completing}
                  >
                    {completing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Marking...
                      </>
                    ) : 'Mark as Complete'}
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
