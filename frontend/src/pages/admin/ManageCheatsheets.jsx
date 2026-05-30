import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { getCheatsheets, createCheatsheet, updateCheatsheet, deleteCheatsheet } from '../../api/cheatsheets'

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

const EMPTY_FORM = { title: '', slug: '', category: '', content: STARTER_MD }

const slugify = (val) =>
  val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function ManageCheatsheets() {
  const [cheatsheets, setCheatsheets] = useState([])
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
  const [editForm, setEditForm] = useState(EMPTY_FORM)
  const [editPreview, setEditPreview] = useState('split')
  const [saving, setSaving] = useState(false)

  // Delete state
  const [deleting, setDeleting] = useState(null)

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

  // ── Create handlers ──────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'title') {
      setForm({ ...form, title: value, slug: slugify(value) })
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
      await createCheatsheet(form)
      setForm(EMPTY_FORM)
      setShowForm(false)
      setSuccessMsg('Cheatsheet created successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
      await fetchCheatsheets()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create cheatsheet.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Edit handlers ─────────────────────────────────────────────────────────────
  const openEdit = (cs) => {
    setEditingId(cs.id)
    setEditForm({
      title: cs.title || '',
      slug: cs.slug || '',
      category: cs.category || '',
      content: cs.content || '',
    })
    setEditPreview('split')
    setError('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm(EMPTY_FORM)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    if (name === 'title') {
      setEditForm(prev => ({ ...prev, title: value, slug: slugify(value) }))
    } else {
      setEditForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleEditSave = async (id) => {
    setSaving(true)
    setError('')
    try {
      await updateCheatsheet(id, editForm)
      setCheatsheets(prev =>
        prev.map(cs => cs.id === id ? { ...cs, ...editForm } : cs)
      )
      setSuccessMsg('Cheatsheet updated successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
      cancelEdit()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update cheatsheet.')
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
      await deleteCheatsheet(id)
      setCheatsheets(prev => prev.filter(cs => cs.id !== id))
      setSuccessMsg('Cheatsheet deleted successfully.')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete cheatsheet.')
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
        <Link to="/admin/dashboard" className="btn btn-outline-secondary btn-sm">← Dashboard</Link>
        <div>
          <h2 className="fw-bold mb-0">Manage Cheatsheets</h2>
          <p className="text-muted mb-0 small">Create, edit, and remove quick reference guides</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      {/* ── Create Form ─────────────────────────────────────────────────────── */}
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

              <MarkdownEditor
                value={form.content}
                name="content"
                onChange={handleChange}
                previewMode={previewMode}
                setPreviewMode={setPreviewMode}
              />

              <button type="submit" className="btn btn-primary mt-3" disabled={submitting}>
                {submitting
                  ? <><span className="spinner-border spinner-border-sm me-2" />Creating...</>
                  : 'Create Cheatsheet'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ── Cheatsheets List ─────────────────────────────────────────────────── */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <h6 className="fw-bold mb-0">All Cheatsheets ({cheatsheets.length})</h6>
        </div>
        {cheatsheets.length === 0 ? (
          <div className="card-body text-center py-5 text-muted">
            No cheatsheets yet. Create your first one above.
          </div>
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
                  <>
                    {/* Main row */}
                    <tr key={cs.id}>
                      <td className="fw-semibold">{cs.title}</td>
                      <td><code className="text-muted">{cs.slug}</code></td>
                      <td>
                        {cs.category
                          ? <span className="badge bg-secondary">{cs.category}</span>
                          : '—'}
                      </td>
                      <td className="text-end">
                        <div className="d-flex gap-2 justify-content-end">
                          <Link
                            to={`/cheatsheets/${cs.slug}`}
                            className="btn btn-outline-secondary btn-sm"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View
                          </Link>
                          <button
                            className={`btn btn-sm ${editingId === cs.id ? 'btn-secondary' : 'btn-outline-primary'}`}
                            onClick={() => editingId === cs.id ? cancelEdit() : openEdit(cs)}
                            disabled={deleting === cs.id}
                          >
                            {editingId === cs.id ? 'Cancel' : 'Edit'}
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(cs.id, cs.title)}
                            disabled={deleting === cs.id || editingId === cs.id}
                          >
                            {deleting === cs.id
                              ? <span className="spinner-border spinner-border-sm" />
                              : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Inline edit row */}
                    {editingId === cs.id && (
                      <tr key={`edit-${cs.id}`} className="table-light">
                        <td colSpan={4} className="p-4">
                          <div className="row g-3 mb-3">
                            <div className="col-md-4">
                              <label className="form-label fw-semibold small">Title <span className="text-danger">*</span></label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                name="title"
                                value={editForm.title}
                                onChange={handleEditChange}
                                required
                              />
                            </div>
                            <div className="col-md-4">
                              <label className="form-label fw-semibold small">Slug <span className="text-danger">*</span></label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                name="slug"
                                value={editForm.slug}
                                onChange={handleEditChange}
                                required
                              />
                            </div>
                            <div className="col-md-4">
                              <label className="form-label fw-semibold small">Category</label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                name="category"
                                value={editForm.category}
                                onChange={handleEditChange}
                                placeholder="e.g. JavaScript, CSS"
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
                              onClick={() => handleEditSave(cs.id)}
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
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Shared Markdown editor component ─────────────────────────────────────────
function MarkdownEditor({ value, name, onChange, previewMode, setPreviewMode }) {
  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <label className="form-label fw-semibold mb-0">
          Content <span className="text-danger">*</span>
          <span className="badge bg-primary ms-2" style={{ fontSize: '0.7rem' }}>Markdown</span>
        </label>
        <div className="btn-group btn-group-sm">
          {['write', 'split', 'preview'].map(mode => (
            <button
              key={mode}
              type="button"
              className={`btn ${previewMode === mode ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setPreviewMode(mode)}
              style={{ textTransform: 'capitalize', fontSize: '0.75rem' }}
            >
              {mode === 'split' ? '⬛ Split' : mode === 'write' ? '✏️ Write' : '👁 Preview'}
            </button>
          ))}
        </div>
      </div>

      <div className="d-flex gap-2" style={{ minHeight: 400 }}>
        {(previewMode === 'write' || previewMode === 'split') && (
          <div style={{ flex: 1 }}>
            <textarea
              className="form-control h-100"
              name={name}
              value={value}
              onChange={onChange}
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
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')

                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
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
                {value || '*Nothing to preview yet...*'}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      <div className="form-text mt-1">
        Supports: **bold**, *italic*, `code`, ```code blocks```, tables, lists, headings, blockquotes
      </div>
    </div>
  )
}
