import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register as registerApi } from '../../api/auth'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await registerApi(form)
      if (form.role === 'organizer') {
        setSuccess("Registration successful! Your organizer account is pending admin approval. You'll be notified once approved.")
      } else {
        setSuccess('Registration successful! Redirecting to login...')
        setTimeout(() => navigate('/login'), 2000)
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #ede9fe 100%)' }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-5">

            {/* Logo */}
            <div className="text-center mb-4">
              <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                <span className="text-white fs-4">⚡</span>
              </div>
              <h2 className="fw-bold mb-1" style={{ color: '#0f172a' }}>Create your account</h2>
              <p className="text-muted">Join DEVSIQ — it's free</p>
            </div>

            <div className="card border-0" style={{ borderRadius: 16, boxShadow: '0 4px 24px rgba(79,70,229,0.12)' }}>
              <div className="card-body p-4 p-md-5">

                {error && <div className="alert alert-danger d-flex align-items-center gap-2" role="alert"><span>⚠️</span> {error}</div>}
                {success && <div className="alert alert-success d-flex align-items-center gap-2" role="alert"><span>✅</span> {success}</div>}

                {!success && (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Full Name</label>
                      <input type="text" className="form-control" id="name" name="name"
                        value={form.name} onChange={handleChange} required placeholder="John Doe" />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email address</label>
                      <input type="email" className="form-control" id="email" name="email"
                        value={form.email} onChange={handleChange} required placeholder="you@example.com" />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <div className="input-group">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-control"
                          id="password"
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          required
                          placeholder="At least 6 characters"
                          minLength={6}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowPassword(v => !v)}
                          tabIndex={-1}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? '🙈' : '👁'}
                        </button>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Account Type</label>
                      <div className="row g-2">
                        <div className="col-6">
                          <div
                            className={`p-3 rounded-3 border-2 cursor-pointer text-center ${form.role === 'user' ? 'border border-primary bg-primary bg-opacity-10' : 'border'}`}
                            style={{ cursor: 'pointer', borderColor: form.role === 'user' ? '#4f46e5' : '#e2e8f0' }}
                            onClick={() => setForm({ ...form, role: 'user' })}
                          >
                            <div className="fs-4 mb-1">👤</div>
                            <div className="fw-semibold small">User</div>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Browse & learn</div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div
                            className={`p-3 rounded-3 border-2 cursor-pointer text-center ${form.role === 'organizer' ? 'border border-primary bg-primary bg-opacity-10' : 'border'}`}
                            style={{ cursor: 'pointer', borderColor: form.role === 'organizer' ? '#4f46e5' : '#e2e8f0' }}
                            onClick={() => setForm({ ...form, role: 'organizer' })}
                          >
                            <div className="fs-4 mb-1">🏆</div>
                            <div className="fw-semibold small">Organizer</div>
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>Host hackathons</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {form.role === 'organizer' && (
                      <div className="alert alert-info py-2 small">
                        <strong>Note:</strong> Organizer accounts need admin approval before you can create hackathons.
                      </div>
                    )}

                    <div className="d-grid mt-4">
                      <button type="submit" className="btn btn-primary py-2" disabled={loading}>
                        {loading ? (
                          <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Creating account...</>
                        ) : 'Create Account →'}
                      </button>
                    </div>
                  </form>
                )}

                {success && (
                  <div className="text-center mt-3">
                    <Link to="/login" className="btn btn-primary">Go to Login →</Link>
                  </div>
                )}

                {!success && (
                  <div className="text-center mt-4">
                    <span className="text-muted">Already have an account? </span>
                    <Link to="/login" className="fw-semibold" style={{ color: '#4f46e5' }}>Sign in</Link>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
