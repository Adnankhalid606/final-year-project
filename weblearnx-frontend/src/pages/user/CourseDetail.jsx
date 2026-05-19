import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCourse } from '../../api/courses'
import { getArticlesByCourse } from '../../api/articles'
import { getCourseProgress, completeArticle } from '../../api/progress'

export default function CourseDetail() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [articles, setArticles] = useState([])
  const [progress, setProgress] = useState({ totalArticles: 0, completedCount: 0, progress: 0 })
  const [completedIds, setCompletedIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [completing, setCompleting] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')

  const fetchProgress = async () => {
    try {
      const res = await getCourseProgress(id)
      setProgress(res.data)
      if (res.data.completedArticleIds) {
        setCompletedIds(new Set(res.data.completedArticleIds))
      }
    } catch {
      // ignore progress errors
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, articlesRes] = await Promise.all([
          getCourse(id),
          getArticlesByCourse(id),
        ])
        setCourse(courseRes.data.data ?? courseRes.data)
        setArticles(articlesRes.data.data ?? articlesRes.data)
        await fetchProgress()
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load course.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleComplete = async (articleId) => {
    setCompleting(articleId)
    setSuccessMsg('')
    try {
      await completeArticle(articleId)
      setCompletedIds((prev) => new Set([...prev, articleId]))
      await fetchProgress()
      setSuccessMsg('Article marked as complete!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark article as complete.')
    } finally {
      setCompleting(null)
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

  if (error && !course) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">{error}</div>
        <Link to="/courses" className="btn btn-secondary">Back to Courses</Link>
      </div>
    )
  }

  const pct = Math.round(progress.progress || 0)

  return (
    <div className="container py-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/courses">Courses</Link></li>
          <li className="breadcrumb-item active">{course?.title}</li>
        </ol>
      </nav>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <div className="row">
        <div className="col-lg-8">
          <h2 className="fw-bold mb-2">{course?.title}</h2>
          <p className="text-muted mb-4">{course?.description}</p>

          <h5 className="fw-semibold mb-3">Articles ({articles.length})</h5>

          {articles.length === 0 && (
            <div className="text-muted py-3">No articles in this course yet.</div>
          )}

          <div className="list-group">
            {articles.map((article, idx) => {
              const done = completedIds.has(article.id)
              return (
                <div
                  key={article.id}
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${done ? 'list-group-item-success' : ''}`}
                >
                  <div className="d-flex align-items-center gap-3">
                    <span className={`badge rounded-pill ${done ? 'bg-success' : 'bg-secondary'}`}>
                      {idx + 1}
                    </span>
                    <div>
                      <Link
                        to={`/articles/${article.id}`}
                        className="fw-semibold text-decoration-none text-dark"
                      >
                        {article.title}
                      </Link>
                      {done && (
                        <span className="ms-2 text-success small">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                          </svg>
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <Link to={`/articles/${article.id}`} className="btn btn-outline-primary btn-sm">
                      Read
                    </Link>
                    {!done && (
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => handleComplete(article.id)}
                        disabled={completing === article.id}
                      >
                        {completing === article.id ? (
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : 'Mark Complete'}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="col-lg-4 mt-4 mt-lg-0">
          <div className="card border-0 shadow-sm sticky-top" style={{ top: 80 }}>
            <div className="card-body">
              <h6 className="fw-bold mb-3">Your Progress</h6>
              <div className="d-flex justify-content-between mb-1">
                <span className="text-muted small">Completion</span>
                <span className="fw-bold">{pct}%</span>
              </div>
              <div className="progress mb-3" style={{ height: 12 }}>
                <div
                  className={`progress-bar ${pct === 100 ? 'bg-success' : 'bg-primary'}`}
                  role="progressbar"
                  style={{ width: `${pct}%` }}
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
              <p className="text-muted small mb-0">
                {progress.completedCount} of {progress.totalArticles} articles completed
              </p>
              {pct === 100 && (
                <div className="alert alert-success mt-3 mb-0 py-2 text-center">
                  🎉 Course Complete!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
