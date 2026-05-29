import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAdminHackathons, updateHackathonStatus } from '../../api/admin'
import { deleteHackathon, updateHackathon } from '../../api/hackathons'

const STATUS_OPTIONS = ['upcoming', 'active', 'completed']

const statusBadge = (status) => {
  const map = {
    upcoming:  'bg-warning text-dark',
    active:    'bg-success',
    completed: 'bg-secondary',
  }
  return <span className={`badge ${map[status] || 'bg-secondary'}`}>{status}</span>
}

const EMPTY_FORM = {
  title: '',
  description: '',
  banner: '',
  registration_link: '',
  start_date: '',
  end_date: '',
  status: 'upcoming',
}

// Format a date string or Date to YYYY-MM-DD for <input type="date">
const toDateInput = (val) => {
  if (!val) return ''
  const d = new Date(val)
  if (isNaN(d)) return ''
  return d.toISOString().slice(0, 10)
}

export default function ManageHackathons() {
  const [hackathons, setHackathons] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [updating, setUpdating]     = useState(null)  // id being status-updated
  const [deleting, setDeleting]     = useState(null)  // id being deleted
  const [editingId, setEditingId]   = useState(null)  // id whose edit form is open
  const [editForm, setEditForm]     = useState(EMPTY_FORM)
  const [saving, setSaving]         = useState(false)

  const fetchHackathons = async () => {
    try {
      const res = await getAdminHackathons()
      const list = res.data.data ?? res.data
      setHackathons(Array.isArray(list) ? list : [])
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to load hackathons.'
      setError(`Error ${err.response?.status ?? ''}: ${msg}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchHackathons() }, [])

  const handleStatusChange = async (hackathonId, newStatus) => {
    setUpdating(hackathonId)
    setError('')
    try {
      await updateHackathonStatus(hackathonId, newStatus)
      setHackathons(prev =>
        prev.map(h => h.id === hackathonId ? { ...h, status: newStatus } : h)
      )
      setSuccessMsg('Status updated successfully.')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status.')
    } finally {
      setUpdating(null)
    }
  }

  const handleDelete = async (hackathonId, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(hackathonId)
    setError('')
    try {
      await deleteHackathon(hackathonId)
      setHackathons(prev => prev.filter(h => h.id !== hackathonId))
      setSuccessMsg('Hackathon deleted successfully.')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete hackathon.')
    } finally {
      setDeleting(null)
    }
  }

  const openEdit = (h) => {
    setEditingId(h.id)
    setEditForm({
      title:             h.title || '',
      description:       h.description || '',
      banner:            h.banner || '',
      registration_link: h.registration_link || '',
      start_date:        toDateInput(h.start_date),
      end_date:          toDateInput(h.end_date),
      status:            h.status || 'upcoming',
    })
    setError('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm(EMPTY_FORM)
  }

  const handleEditChange = (e) => {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleEditSave = async (hackathonId) => {
    setSaving(true)
    setError('')
    try {
      await updateHackathon(hackathonId, editForm)
      setHackathons(prev =>
        prev.map(h =>
          h.id === hackathonId
            ? { ...h, ...editForm }
            : h
        )
      )
      setSuccessMsg('Hackathon updated successfully.')
      setTimeout(() => setSuccessMsg(''), 3000)
      cancelEdit()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update hackathon.')
    } finally {
      setSaving(false)
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
          <h2 className="fw-bold mb-0">Manage Hackathons</h2>
          <p className="text-muted mb-0 small">Edit, change status, and remove hackathon listings</p>
        </div>
      </div>

      {error      && <div className="alert alert-danger">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <h6 className="fw-bold mb-0">All Hackathons ({hackathons.length})</h6>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Organizer</th>
                <th>Dates</th>
                <th>Current Status</th>
                <th>Change Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hackathons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-muted py-4">
                    {error ? 'Could not load hackathons — see error above.' : 'No hackathons found.'}
                  </td>
                </tr>
              ) : (
                hackathons.map((h, idx) => (
                  <>
                    {/* Main row */}
                    <tr key={h.id}>
                      <td className="text-muted">{idx + 1}</td>
                      <td className="fw-semibold" style={{ maxWidth: 220 }}>
                        <span className="d-block text-truncate" title={h.title}>{h.title}</span>
                      </td>
                      <td className="text-muted small">{h.organizer_name || '—'}</td>
                      <td className="text-muted small">
                        <div>{new Date(h.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        <div className="text-muted">→ {new Date(h.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      </td>
                      <td>{statusBadge(h.status)}</td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          style={{ width: 130 }}
                          value={h.status}
                          disabled={updating === h.id || editingId === h.id}
                          onChange={(e) => handleStatusChange(h.id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        {updating === h.id && (
                          <span className="spinner-border spinner-border-sm ms-2 text-primary" />
                        )}
                      </td>
                      <td className="text-end">
                        <div className="d-flex gap-2 justify-content-end">
                          <button
                            className={`btn btn-sm ${editingId === h.id ? 'btn-secondary' : 'btn-outline-primary'}`}
                            onClick={() => editingId === h.id ? cancelEdit() : openEdit(h)}
                            disabled={deleting === h.id}
                          >
                            {editingId === h.id ? 'Cancel' : 'Edit'}
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(h.id, h.title)}
                            disabled={deleting === h.id || editingId === h.id}
                          >
                            {deleting === h.id
                              ? <span className="spinner-border spinner-border-sm" />
                              : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Inline edit row */}
                    {editingId === h.id && (
                      <tr key={`edit-${h.id}`} className="table-light">
                        <td colSpan={7} className="p-4">
                          <div className="row g-3">
                            <div className="col-md-6">
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
                            <div className="col-md-6">
                              <label className="form-label fw-semibold small">Registration Link <span className="text-danger">*</span></label>
                              <input
                                type="url"
                                className="form-control form-control-sm"
                                name="registration_link"
                                value={editForm.registration_link}
                                onChange={handleEditChange}
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label fw-semibold small">Description</label>
                              <textarea
                                className="form-control form-control-sm"
                                name="description"
                                rows={3}
                                value={editForm.description}
                                onChange={handleEditChange}
                              />
                            </div>
                            <div className="col-md-4">
                              <label className="form-label fw-semibold small">Banner URL</label>
                              <input
                                type="url"
                                className="form-control form-control-sm"
                                name="banner"
                                value={editForm.banner}
                                onChange={handleEditChange}
                                placeholder="https://..."
                              />
                            </div>
                            <div className="col-md-3">
                              <label className="form-label fw-semibold small">Start Date <span className="text-danger">*</span></label>
                              <input
                                type="date"
                                className="form-control form-control-sm"
                                name="start_date"
                                value={editForm.start_date}
                                onChange={handleEditChange}
                              />
                            </div>
                            <div className="col-md-3">
                              <label className="form-label fw-semibold small">End Date <span className="text-danger">*</span></label>
                              <input
                                type="date"
                                className="form-control form-control-sm"
                                name="end_date"
                                value={editForm.end_date}
                                onChange={handleEditChange}
                              />
                            </div>
                            <div className="col-md-2">
                              <label className="form-label fw-semibold small">Status</label>
                              <select
                                className="form-select form-select-sm"
                                name="status"
                                value={editForm.status}
                                onChange={handleEditChange}
                              >
                                {STATUS_OPTIONS.map(s => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </div>
                            <div className="col-12 d-flex gap-2">
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleEditSave(h.id)}
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
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
