import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getCourse } from '../../api/courses'
import { createArticle } from '../../api/articles'
import { getAdminArticlesByCourse } from '../../api/admin'

const ARTICLE_STARTER = `## Introduction

Write your article content here using **Markdown**.

### Key Points

- Point 1
- Point 2
- Point 3

### Code Example

\`\`\`js
// Your code here
const example = () => {
  return "Hello World"
}
\`\`\`

> **Tip:** Use headings, lists, code blocks, and tables to structure your content.
`

export default function ManageArticles() {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [form, setForm] = useState({ title: '', content: ARTICLE_STARTER, order: '' })
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [previewMode, setPreviewMode] = useState('split')

  const fetchData = async () => {
    try {
      const [courseRes, articlesRes] = await Promise.all([
        getCourse(courseId),
        getAdminArticlesByCourse(courseId),
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
      await createArticle(payload)
      setForm({ title: '', content: ARTICLE_STARTER, order: '' })
      setShowForm(false)
      setSuccessMsg('Article created successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
      await fetchData()
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
              {/* Markdown split editor */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label fw-semibold mb-0">
                    Content <span className="text-danger">*</span>
                  </label>
                  <div className="btn-group btn-group-sm" role="group" aria-label="Editor view">
                    {['split', 'write', 'preview'].map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        className={`btn ${previewMode === mode ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setPreviewMode(mode)}
                      >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  className="border rounded overflow-hidden"
                  style={{ minHeight: 320 }}
                >
                  <div className="d-flex" style={{ minHeight: 320 }}>
                    {/* Editor pane */}
                    {(previewMode === 'write' || previewMode === 'split') && (
                      <div
                        className={previewMode === 'split' ? 'w-50 border-end' : 'w-100'}
                        style={{ display: 'flex', flexDirection: 'column' }}
                      >
                        {previewMode === 'split' && (
                          <div className="px-3 py-1 bg-light border-bottom small text-muted fw-semibold">
                            Markdown
                          </div>
                        )}
                        <textarea
                          className="form-control border-0 rounded-0 flex-grow-1 font-monospace"
                          id="content"
                          name="content"
                          value={form.content}
                          onChange={handleChange}
                          required
                          placeholder="Write the article content here..."
                          style={{ resize: 'none', minHeight: 290, fontSize: '0.875rem' }}
                        />
                      </div>
                    )}

                    {/* Preview pane */}
                    {(previewMode === 'preview' || previewMode === 'split') && (
                      <div
                        className={previewMode === 'split' ? 'w-50' : 'w-100'}
                        style={{ overflowY: 'auto', minHeight: 290 }}
                      >
                        {previewMode === 'split' && (
                          <div className="px-3 py-1 bg-light border-bottom small text-muted fw-semibold">
                            Preview
                          </div>
                        )}
                        <div className="p-3" style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
                          {form.content.trim() ? (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {form.content}
                            </ReactMarkdown>
                          ) : (
                            <span className="text-muted fst-italic">Nothing to preview yet.</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
