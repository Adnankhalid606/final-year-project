import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCourse } from '../../api/courses'
import { getArticlesByCourse, createArticle } from '../../api/articles'

export default function ManageArticles() {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [form, setForm] = useState({ title: '', content: '', order: '' })
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const fetchData = async () => {
    try {
      const [courseRes, articlesRes] = await Promise.all([
        getCourse(courseId),
        getArticlesByCourse(courseId),
      ])
      setCourse(courseRes.data.data ?? courseRes.data)
      setArticles(articlesRes.data.data ?? articlesRes.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [courseId])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setSubmitting(true)
    try {
      const payload = {
        title: form.title,
        content: form.content,
        courseId: Number(courseId),
        order: form.order ? Number(form.order) : articles.length + 1,
      }
      const res = await createArticle(payload)
      setArticles((prev) => [...prev, res.data.data ?? res.data])
      setForm({ title: '', content: '', order: '' })
      setShowForm(false)
      setSuccessMsg('Article created successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create article.')
    } finally {
      setSubmitting(false)
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
        <Link to="/admin/courses" className="btn btn-outline-secondary btn-sm">← Courses</Link>
        <div>
          <h2 className="fw-bold mb-0">Articles: {course?.title}</h2>
          <p className="text-muted mb-0 small">Manage articles for this course</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {/* Create Article Form */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
          <h6 className="fw-bold mb-0">Add New Article</h6>
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ New Article'}
          </button>
        </div>
        {showForm && (
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-md-9">
                  <label htmlFor="title" className="form-label fw-semibold">
                    Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder="Article title"
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="order" className="form-label fw-semibold">Order</label>
                  <input
                    type="number"
                    className="form-control"
                    id="order"
                    name="order"
                    value={form.order}
                    onChange={handleChange}
                    min={1}
                    placeholder={articles.length + 1}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="content" className="form-label fw-semibold">
                  Content <span className="text-danger">*</span>
                </label>
                <textarea
                  className="form-control"
                  id="content"
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows={8}
                  required
                  placeholder="Write the article content here..."
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating...
                  </>
                ) : 'Create Article'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Articles List */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <h6 className="fw-bold mb-0">Articles ({articles.length})</h6>
        </div>
        {articles.length === 0 ? (
          <div className="card-body text-center py-5 text-muted">
            No articles yet. Add your first article above.
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {articles
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((article) => (
                <div key={article.id} className="list-group-item d-flex justify-content-between align-items-center py-3">
                  <div className="d-flex align-items-center gap-3">
                    <span className="badge bg-secondary rounded-pill">{article.order || '—'}</span>
                    <div>
                      <div className="fw-semibold">{article.title}</div>
                      <small className="text-muted">
                        {article.content
                          ? article.content.substring(0, 80) + (article.content.length > 80 ? '...' : '')
                          : 'No content'}
                      </small>
                    </div>
                  </div>
                  <Link
                    to={`/articles/${article.id}`}
                    className="btn btn-outline-secondary btn-sm"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Preview
                  </Link>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
