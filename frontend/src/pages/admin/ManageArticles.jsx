import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { getCourse } from '../../api/courses'
import { createArticle, updateArticle, deleteArticle } from '../../api/articles'
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

const EMPTY_FORM = { title: '', content: ARTICLE_STARTER, order: '' }

export default function ManageArticles() {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Create form
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [previewMode, setPreviewMode] = useState('split')

  // Edit state
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', content: '', order: '' })
  const [editPreview, setEditPreview] = useState('split')
  const [saving, setSaving] = useState(false)

  // Delete state
  const [deleting, setDeleting] = useState(null)

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

  useEffect(() => { fetchData() }, [courseId])

  // ── Create handlers ──────────────────────────────────────────────────────────
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

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
      setForm(EMPTY_FORM)
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

  // ── Edit handlers ─────────────────────────────────────────────────────────────
  const openEdit = (article) => {
    setEditingId(article.id)
    setEditForm({
      title: article.title || '',
      content: article.content || '',
      order: article.order ?? '',
    })
    setEditPreview('split')
    setError('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm({ title: '', content: '', order: '' })
  }

  const handleEditChange = (e) =>
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleEditSave = async (id) => {
    setSaving(true)
    setError('')
    try {
      const payload = {
        title: editForm.title,
        content: editForm.content,
        order: editForm.order !== '' ? Number(editForm.order) : null,
      }
      await updateArticle(id, payload)
      setArticles(prev =>
        prev.map(a => a.id === id ? { ...a, ...payload } : a)
      )
      setSuccessMsg('Article updated successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
      cancelEdit()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update article.')
    } finally {
      setSaving(false)
    }
  }

  // ── Delete handler ────────────────────────────────────────────────────────────
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    setError('')
    try {
      await deleteArticle(id)
      setArticles(prev => prev.filter(a => a.id !== id))
      setSuccessMsg('Article deleted successfully.')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete article.')
    } finally {
      setDeleting(null)
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

      {/* ── Create Article Form ──────────────────────────────────────────────── */}
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
                    type="text" className="form-control" id="title" name="title"
                    value={form.title} onChange={handleChange} required placeholder="Article title"
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="order" className="form-label fw-semibold">Order</label>
                  <input
                    type="number" className="form-control" id="order" name="order"
                    value={form.order} onChange={handleChange} min={1}
                    placeholder={articles.length + 1}
                  />
                </div>
              </div>
              <MarkdownEditor
                value={form.content}
                name="content"
                onChange={handleChange}
                previewMode={previewMode}
                setPreviewMode={setPreviewMode}
              />
              <button type="submit" className="btn btn-primary mt-2" disabled={submitting}>
                {submitting
                  ? <><span className="spinner-border spinner-border-sm me-2" />Creating...</>
                  : 'Create Article'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ── Articles List ────────────────────────────────────────────────────── */}
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
            {[...articles]
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((article) => (
                <div key={article.id}>
                  {/* Main row */}
                  <div className="list-group-item py-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-3">
                        <span className="badge bg-secondary rounded-pill">{article.order || '—'}</span>
                        <div>
                          <div className="fw-semibold">{article.title}</div>
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <Link
                          to={`/articles/${article.id}`}
                          className="btn btn-outline-secondary btn-sm"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Preview
                        </Link>
                        <button
                          className={`btn btn-sm ${editingId === article.id ? 'btn-secondary' : 'btn-outline-primary'}`}
                          onClick={() => editingId === article.id ? cancelEdit() : openEdit(article)}
                          disabled={deleting === article.id}
                        >
                          {editingId === article.id ? 'Cancel' : 'Edit'}
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(article.id, article.title)}
                          disabled={deleting === article.id || editingId === article.id}
                        >
                          {deleting === article.id
                            ? <span className="spinner-border spinner-border-sm" />
                            : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Inline edit panel */}
                  {editingId === article.id && (
                    <div className="list-group-item bg-light p-4">
                      <div className="row g-3 mb-3">
                        <div className="col-md-9">
                          <label className="form-label fw-semibold small">
                            Title <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text" className="form-control form-control-sm"
                            name="title" value={editForm.title} onChange={handleEditChange} required
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-semibold small">Order</label>
                          <input
                            type="number" className="form-control form-control-sm"
                            name="order" value={editForm.order} onChange={handleEditChange} min={1}
                          />
                        </div>
                      </div>
                      <MarkdownEditor
                        value={editForm.content}
                        name="content"
                        onChange={handleEditChange}
                        previewMode={editPreview}
                        setPreviewMode={setEditPreview}
                      />
                      <div className="d-flex gap-2 mt-3">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEditSave(article.id)}
                          disabled={saving}
                        >
                          {saving
                            ? <><span className="spinner-border spinner-border-sm me-1" />Saving...</>
                            : 'Save Changes'}
                        </button>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={cancelEdit}
                          disabled={saving}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Shared split markdown editor ──────────────────────────────────────────────
function MarkdownEditor({ value, name, onChange, previewMode, setPreviewMode }) {
  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <label className="form-label fw-semibold mb-0">
          Content <span className="text-danger">*</span>
        </label>
        <div className="btn-group btn-group-sm" role="group">
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

      <div className="border rounded overflow-hidden" style={{ minHeight: 320 }}>
        <div className="d-flex" style={{ minHeight: 320 }}>
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
                name={name}
                value={value}
                onChange={onChange}
                required
                placeholder="Write the article content here..."
                style={{ resize: 'none', minHeight: 290, fontSize: '0.875rem' }}
              />
            </div>
          )}

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
              <div
                className="article-content markdown-body"
                style={{ lineHeight: 1.8, fontSize: '1.05rem' }}
              >
                {value.trim() ? (
                  <>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '')

                          return !inline && match ? (
                            <SyntaxHighlighter
                              language={match[1]}
                              style={atomOneDark}
                              wrapLongLines={true}
                              PreTag="div"
                              {...props}
                              customStyle={{
                                margin: 0,
                                borderRadius: '10px',
                              }}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          )
                        },
                      }}
                    >
                      {value}
                    </ReactMarkdown>
                  </>
                ) : (
                  <span className="text-muted fst-italic">Nothing to preview yet.</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
