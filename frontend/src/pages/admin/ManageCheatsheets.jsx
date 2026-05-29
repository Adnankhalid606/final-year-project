import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { getCheatsheets, createCheatsheet } from '../../api/cheatsheets'

const STARTER_MD = `# Cheatsheet Title

## Section 1

| Syntax | Description |
|--------|-------------|
| \`code\` | Inline code |
| **bold** | Bold text |

## Section 2

\`\`\`js
// Code block example
const greet = (name) => \`Hello \${name}\`
\`\`\`

- Bullet point 1
- Bullet point 2

> Tip: Use markdown for rich formatting
`

export default function ManageCheatsheets() {
  const [cheatsheets, setCheatsheets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [form, setForm] = useState({ title: '', slug: '', category: '', content: STARTER_MD })
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [previewMode, setPreviewMode] = useState('split') // 'write' | 'preview' | 'split'

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

  useEffect(() => { fetchCheatsheets() }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'title') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      setForm({ ...form, title: value, slug })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setSubmitting(true)
    try {
      const res = await createCheatsheet(form)
      setCheatsheets((prev) => [...prev, res.data.data ?? res.data])
      setForm({ title: '', slug: '', category: '', content: STARTER_MD })
      setShowForm(false)
      setSuccessMsg('Cheatsheet created successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create cheatsheet.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
      </div>
    )
  }

  return (
    <div className="container py-5">
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link to="/admin/dashboard" className="btn btn-outline-secondary btn-sm">← Dashboard</Link>
        <div>
          <h2 className="fw-bold mb-0">Manage Cheatsheets</h2>
          <p className="text-muted mb-0 small">Create and manage quick reference guides in Markdown</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {/* Create Cheatsheet Form */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
          <h6 className="fw-bold mb-0">Create New Cheatsheet</h6>
          <button className="btn btn-sm btn-outline-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : '+ New Cheatsheet'}
          </button>
        </div>

        {showForm && (
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* Title + Slug + Category */}
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Title <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" name="title" value={form.title}
                    onChange={handleChange} required placeholder="e.g. JavaScript ES6" />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Slug <span className="text-danger">*</span></label>
                  <input type="text" className="form-control" name="slug" value={form.slug}
                    onChange={handleChange} required placeholder="e.g. javascript-es6" />
                  <div className="form-text">Auto-generated. Must be unique.</div>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Category</label>
                  <input type="text" className="form-control" name="category" value={form.category}
                    onChange={handleChange} placeholder="e.g. JavaScript, CSS" />
                </div>
              </div>

              {/* Markdown Editor */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="form-label fw-semibold mb-0">
                    Content <span className="text-danger">*</span>
                    <span className="badge bg-primary ms-2" style={{ fontSize: '0.7rem' }}>Markdown</span>
                  </label>
                  {/* View toggle */}
                  <div className="btn-group btn-group-sm">
                    {['write', 'split', 'preview'].map(mode => (
                      <button key={mode} type="button"
                        className={`btn ${previewMode === mode ? 'btn-primary' : 'btn-outline-secondary'}`}
                        onClick={() => setPreviewMode(mode)}
                        style={{ textTransform: 'capitalize', fontSize: '0.75rem' }}>
                        {mode === 'split' ? '⬛ Split' : mode === 'write' ? '✏️ Write' : '👁 Preview'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="d-flex gap-2" style={{ minHeight: 400 }}>
                  {/* Editor pane */}
                  {(previewMode === 'write' || previewMode === 'split') && (
                    <div style={{ flex: 1 }}>
                      <textarea
                        className="form-control h-100"
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        required
                        placeholder="Write markdown here..."
                        style={{
                          fontFamily: "'Fira Code', 'Courier New', monospace",
                          fontSize: '0.875rem',
                          lineHeight: 1.7,
                          minHeight: 400,
                          resize: 'vertical',
                          background: '#ffffff',
                          color: '#1e293b',
                          border: '1.5px solid #e2e8f0',
                          borderRadius: 8,
                        }}
                      />
                    </div>
                  )}

                  {/* Preview pane */}
                  {(previewMode === 'preview' || previewMode === 'split') && (
                    <div style={{
                      flex: 1,
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                      padding: '1rem 1.5rem',
                      overflowY: 'auto',
                      minHeight: 400,
                      background: 'white',
                    }}>
                      <div className="markdown-body">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {form.content || '*Nothing to preview yet...*'}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-text mt-1">
                  Supports: **bold**, *italic*, `code`, ```code blocks```, tables, lists, headings, blockquotes
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Creating...</>
                ) : 'Create Cheatsheet'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Cheatsheets List */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <h6 className="fw-bold mb-0">All Cheatsheets ({cheatsheets.length})</h6>
        </div>
        {cheatsheets.length === 0 ? (
          <div className="card-body text-center py-5 text-muted">No cheatsheets yet. Create your first one above.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Category</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cheatsheets.map((cs) => (
                  <tr key={cs.id}>
                    <td className="fw-semibold">{cs.title}</td>
                    <td><code className="text-muted">{cs.slug}</code></td>
                    <td>{cs.category ? <span className="badge bg-secondary">{cs.category}</span> : '—'}</td>
                    <td className="text-end">
                      <Link to={`/cheatsheets/${cs.slug}`} className="btn btn-outline-primary btn-sm"
                        target="_blank" rel="noopener noreferrer">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
