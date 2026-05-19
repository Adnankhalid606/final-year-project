import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register as registerApi } from '../../api/auth'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await registerApi(form)
      if (form.role === 'organizer') {
        setSuccess(
          'Registration successful! Your organizer account is pending admin approval. You\'ll be notified once approved.'
        )
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
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4 fw-bold text-primary">
                Create an Account
              </h2>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              {!success && (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                    />
                  </div>
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
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      placeholder="At least 6 characters"
                      minLength={6}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">Account Type</label>
                    <select
                      className="form-select"
                      id="role"
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                    >
                      <option value="user">User — Browse courses &amp; hackathons</option>
                      <option value="organizer">Organizer — Host hackathons</option>
                    </select>
                  </div>

                  {form.role === 'organizer' && (
                    <div className="alert alert-info" role="alert">
                      <strong>Note:</strong> Organizer accounts require admin approval before you can create hackathons. You'll be notified once your account is approved.
                    </div>
                  )}

                  <div className="d-grid mt-4">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating account...
                        </>
                      ) : 'Create Account'}
                    </button>
                  </div>
                </form>
              )}

              {!success && (
                <>
                  <hr />
                  <p className="text-center mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary fw-semibold">Sign in</Link>
                  </p>
                </>
              )}

              {success && (
                <div className="text-center mt-3">
                  <Link to="/login" className="btn btn-outline-primary">Go to Login</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
