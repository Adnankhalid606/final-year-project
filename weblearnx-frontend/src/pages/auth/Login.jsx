import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login as loginApi } from '../../api/auth'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await loginApi(form)
      const data = res.data
      const token = data.token
      const user = { id: data.id, name: data.name, email: data.email, role: data.role }
      login(token, user)
      if (user.role === 'admin') navigate('/admin/dashboard')
      else if (user.role === 'organizer') navigate('/organizer/dashboard')
      else navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
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
              <h2 className="fw-bold mb-1" style={{ color: '#0f172a' }}>Welcome back</h2>
              <p className="text-muted">Sign in to your DEVSIQ account</p>
            </div>

            <div className="card border-0" style={{ borderRadius: 16, boxShadow: '0 4px 24px rgba(79,70,229,0.12)' }}>
              <div className="card-body p-4 p-md-5">

                {error && (
                  <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
                    <span>⚠️</span> {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      placeholder="Your password"
                    />
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary py-2" disabled={loading}>
                      {loading ? (
                        <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Signing in...</>
                      ) : 'Sign In →'}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-4">
                  <span className="text-muted">Don't have an account? </span>
                  <Link to="/register" className="fw-semibold" style={{ color: '#4f46e5' }}>Create one free</Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
