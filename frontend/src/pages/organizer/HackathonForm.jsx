import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { createHackathon, updateHackathon, getHackathon } from '../../api/hackathons'

const emptyForm = {
  title: '',
  description: '',
  banner: '',
  registration_link: '',
  start_date: '',
  end_date: '',
}

export default function HackathonForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [descPreviewMode, setDescPreviewMode] = useState('split')

  useEffect(() => {
    if (!isEdit) return
    const fetchHackathon = async () => {
      try {
        const res = await getHackathon(id)
        const h = res.data.data ?? res.data
        setForm({
          title: h.title || '',
          description: h.description || '',
          banner: h.banner || '',
          registration_link: h.registration_link || '',
          start_date: h.start_date ? h.start_date.substring(0, 10) : '',
          end_date: h.end_date ? h.end_date.substring(0, 10) : '',
        })
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load hackathon.')
      } finally {
        setLoading(false)
      }
    }
    fetchHackathon()
  }, [id, isEdit])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setSubmitting(true)
    try {
      if (isEdit) {
        await updateHackathon(id, form)
        setSuccessMsg('Hackathon updated successfully!')
        setTimeout(() => navigate('/organizer/dashboard'), 1500)
      } else {
        await createHackathon(form)
        setSuccessMsg('Hackathon created successfully!')
        setTimeout(() => navigate('/organizer/dashboard'), 1500)
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} hackathon.`)
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
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="d-flex align-items-center gap-3 mb-4">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => navigate('/organizer/dashboard')}
            >
              ← Back
            </button>
            <h2 className="fw-bold mb-0">
              {isEdit ? 'Edit Hackathon' : 'Create New Hackathon'}
            </h2>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          {successMsg && <div className="alert alert-success">{successMsg}</div>}

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
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
                    placeholder="Hackathon title"
                  />
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label fw-semibold mb-0">Description</label>
                    <div className="btn-group btn-group-sm" role="group" aria-label="Description view">
                      {['split', 'write', 'preview'].map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          className={`btn ${descPreviewMode === mode ? 'btn-primary' : 'btn-outline-secondary'}`}
                          onClick={() => setDescPreviewMode(mode)}
                        >
                          {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border rounded overflow-hidden" style={{ minHeight: 200 }}>
                    <div className="d-flex" style={{ minHeight: 200 }}>
                      {/* Editor pane */}
                      {(descPreviewMode === 'write' || descPreviewMode === 'split') && (
                        <div
                          className={descPreviewMode === 'split' ? 'w-50 border-end' : 'w-100'}
                          style={{ display: 'flex', flexDirection: 'column' }}
                        >
                          {descPreviewMode === 'split' && (
                            <div className="px-3 py-1 bg-light border-bottom small text-muted fw-semibold">
                              Markdown
                            </div>
                          )}
                          <textarea
                            className="form-control border-0 rounded-0 flex-grow-1 font-monospace"
                            id="description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Describe your hackathon... (supports Markdown)"
                            style={{ resize: 'none', minHeight: 170, fontSize: '0.875rem' }}
                          />
                        </div>
                      )}

                      {/* Preview pane */}
                      {(descPreviewMode === 'preview' || descPreviewMode === 'split') && (
                        <div
                          className={descPreviewMode === 'split' ? 'w-50' : 'w-100'}
                          style={{ overflowY: 'auto', minHeight: 170 }}
                        >
                          {descPreviewMode === 'split' && (
                            <div className="px-3 py-1 bg-light border-bottom small text-muted fw-semibold">
                              Preview
                            </div>
                          )}
                          <div className="p-3" style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
                            {form.description.trim() ? (
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {form.description}
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

                <div className="mb-3">
                  <label htmlFor="banner" className="form-label fw-semibold">Banner Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    id="banner"
                    name="banner"
                    value={form.banner}
                    onChange={handleChange}
                    placeholder="https://example.com/banner.jpg"
                  />
                  {form.banner && (
                    <div className="mt-2">
                      <img
                        src={form.banner}
                        alt="Banner preview"
                        className="img-thumbnail"
                        style={{ maxHeight: 120 }}
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="registration_link" className="form-label fw-semibold">Registration Link</label>
                  <input
                    type="url"
                    className="form-control"
                    id="registration_link"
                    name="registration_link"
                    value={form.registration_link}
                    onChange={handleChange}
                    placeholder="https://example.com/register"
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label htmlFor="start_date" className="form-label fw-semibold">
                      Start Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="start_date"
                      name="start_date"
                      value={form.start_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="end_date" className="form-label fw-semibold">
                      End Date <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="end_date"
                      name="end_date"
                      value={form.end_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="d-flex gap-3 mt-4">
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {isEdit ? 'Saving...' : 'Creating...'}
                      </>
                    ) : (isEdit ? 'Save Changes' : 'Create Hackathon')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/organizer/dashboard')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
