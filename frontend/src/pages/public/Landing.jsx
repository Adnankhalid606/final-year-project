import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getHackathons } from '../../api/hackathons'
import { getPublicCourses } from '../../api/courses'
import { useAuth } from '../../context/AuthContext'

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }
const stagger = { visible: { transition: { staggerChildren: 0.12 } } }

function StatusBadge({ status }) {
  const map = { upcoming: '#6366f1', active: '#10b981', completed: '#64748b' }
  return (
    <span className="badge" style={{ background: map[status] || '#64748b', color: 'white' }}>
      {status}
    </span>
  )
}

export default function Landing() {
  const { user } = useAuth()
  const [hackathons, setHackathons] = useState([])
  const [courses, setCourses] = useState([])

  useEffect(() => {
    getHackathons({}).then(res => {
      const data = res.data.data ?? res.data
      setHackathons(data.slice(0, 3))
    }).catch(() => {})
    getPublicCourses().then(res => {
      const data = res.data.data ?? res.data
      setCourses(data.slice(0, 3))
    }).catch(() => {})
  }, [])

  if (user) return <Navigate to="/dashboard" replace />

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD'

  const features = [
    { icon: '📚', title: 'Structured Courses', desc: 'Step-by-step learning paths with articles, quizzes, and progress tracking built for web developers.', color: 'rgba(99,102,241,0.12)', iconColor: '#6366f1' },
    { icon: '🏆', title: 'Hackathon Discovery', desc: 'Find and join the best hackathons worldwide. Filter by status, bookmark favorites, and register in one click.', color: 'rgba(16,185,129,0.12)', iconColor: '#10b981' },
    { icon: '⚡', title: 'Quick Cheatsheets', desc: 'Instant access to beautifully formatted reference guides for HTML, CSS, JavaScript, React, SQL and more.', color: 'rgba(245,158,11,0.12)', iconColor: '#f59e0b' },
  ]

  const testimonials = [
    { name: 'Sarah Ahmed', role: 'Frontend Developer', avatar: 'SA', text: 'DEVSIQ completely changed how I learn. The structured courses and hackathon discovery in one place is a game changer.', rating: 5 },
    { name: 'Ali Hassan', role: 'Full Stack Dev', avatar: 'AH', text: 'The cheatsheets alone are worth it. I use them daily. The hackathon section helped me find 3 competitions I won.', rating: 5 },
    { name: 'Zara Khan', role: 'CS Student', avatar: 'ZK', text: 'As a student, having courses, cheatsheets, and hackathons in one platform saves me so much time. Absolutely love it.', rating: 5 },
  ]

  return (
    <div style={{ background: '#fafafa' }}>

      {/* ── HERO ── */}
      <section className="bg-hero" style={{ minHeight: '92vh', display: 'flex', alignItems: 'center', paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <motion.div initial="hidden" animate="visible" variants={stagger}>
                <motion.div variants={fadeUp}>
                  <span className="section-label">🚀 The Future of Learning</span>
                </motion.div>
                <motion.h1 variants={fadeUp} className="display-3 fw-bold text-white mb-4" style={{ lineHeight: 1.1 }}>
                  Learn. Build.{' '}
                  <span style={{ background: 'linear-gradient(135deg, #a5b4fc, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Compete.
                  </span>
                </motion.h1>
                <motion.p variants={fadeUp} className="fs-5 mb-5" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, maxWidth: 480 }}>
                  DEVSIQ is your all-in-one platform for structured web development courses, quick-reference cheatsheets, and discovering the world's best hackathons.
                </motion.p>
                <motion.div variants={fadeUp} className="d-flex gap-3 flex-wrap">
                  <Link to="/register" className="btn btn-light btn-lg px-4 py-3">
                    Get Started Free →
                  </Link>
                  <Link to="/login" className="btn btn-outline-light btn-lg px-4 py-3">
                    Sign In
                  </Link>
                </motion.div>
                <motion.div variants={fadeUp} className="d-flex gap-4 mt-5">
                  {[['500+', 'Students'], ['50+', 'Courses'], ['100+', 'Hackathons']].map(([num, label]) => (
                    <div key={label}>
                      <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.5rem', color: '#a5b4fc' }}>{num}</div>
                      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: 500 }}>{label}</div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
            <div className="col-lg-6 d-none d-lg-block">
              <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.3 }}>
                <div className="glass-card p-4" style={{ borderRadius: 24 }}>
                  <div className="d-flex align-items-center gap-2 mb-4">
                    {['#ef4444','#f59e0b','#10b981'].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
                    <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4, marginLeft: 8 }} />
                  </div>
                  {[['HTML & CSS Fundamentals', 85, '#6366f1'], ['JavaScript Basics', 60, '#8b5cf6'], ['React.js for Beginners', 30, '#06b6d4']].map(([title, pct, color]) => (
                    <div key={title} className="mb-3 p-3" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12 }}>
                      <div className="d-flex justify-content-between mb-2">
                        <span style={{ color: 'white', fontWeight: 600, fontSize: '0.85rem' }}>{title}</span>
                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{pct}%</span>
                      </div>
                      <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 50 }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 50, transition: 'width 1s ease' }} />
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 p-3" style={{ background: 'rgba(99,102,241,0.2)', borderRadius: 12, border: '1px solid rgba(99,102,241,0.3)' }}>
                    <div style={{ color: '#a5b4fc', fontWeight: 700, fontSize: '0.85rem' }}>🏆 AI Innovation Hackathon 2026</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginTop: 4 }}>Starts Jun 15 · Prize: $10,000</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <hr className="gradient-divider" />

      {/* ── FEATURES ── */}
      <section style={{ padding: '6rem 0', background: 'white' }}>
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-5">
            <motion.span variants={fadeUp} className="section-label">✨ Why DEVSIQ</motion.span>
            <motion.h2 variants={fadeUp} className="display-5 fw-bold mb-3">Everything you need to grow</motion.h2>
            <motion.p variants={fadeUp} className="text-muted fs-5" style={{ maxWidth: 500, margin: '0 auto' }}>
              One platform for learning, reference, and competition
            </motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="row g-4">
            {features.map((f) => (
              <div key={f.title} className="col-md-4">
                <motion.div variants={fadeUp}>
                  <div className="card h-100 p-4" style={{ border: '1px solid #f1f5f9' }}>
                    <div className="feature-icon mb-4" style={{ background: f.color }}>
                      <span style={{ fontSize: '1.5rem' }}>{f.icon}</span>
                    </div>
                    <h5 className="fw-bold mb-2">{f.title}</h5>
                    <p className="text-muted mb-0" style={{ lineHeight: 1.7 }}>{f.desc}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <hr className="gradient-divider" />

      {/* ── COURSES ── */}
      {courses.length > 0 && (
        <section style={{ padding: '6rem 0', background: '#fafafa' }}>
          <div className="container">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-3">
              <div>
                <motion.span variants={fadeUp} className="section-label">📚 Learn</motion.span>
                <motion.h2 variants={fadeUp} className="display-5 fw-bold mb-2">Popular Courses</motion.h2>
                <motion.p variants={fadeUp} className="text-muted mb-0">Start with our most loved learning paths</motion.p>
              </div>
              <motion.div variants={fadeUp}>
                <Link to="/login" className="btn btn-outline-primary px-4">View All Courses →</Link>
              </motion.div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="row g-4">
              {courses.map((course, i) => {
                const colors = ['#6366f1','#8b5cf6','#06b6d4']
                const levels = ['Beginner','Intermediate','Advanced']
                return (
                  <div key={course.id} className="col-md-4">
                    <motion.div variants={fadeUp}>
                      <div className="card h-100">
                        <div style={{ height: 8, background: `linear-gradient(90deg, ${colors[i % 3]}, ${colors[(i+1) % 3]})` }} />
                        <div className="card-body p-4">
                          <div className="d-flex justify-content-between align-items-start mb-3">
                            <div className="feature-icon" style={{ background: `${colors[i % 3]}18`, width: 44, height: 44, borderRadius: 10 }}>
                              <span>📖</span>
                            </div>
                            <span className="badge" style={{ background: `${colors[i % 3]}18`, color: colors[i % 3] }}>{levels[i % 3]}</span>
                          </div>
                          <h5 className="fw-bold mb-2">{course.title}</h5>
                          <p className="text-muted small mb-4" style={{ lineHeight: 1.6 }}>
                            {course.description?.substring(0, 80)}{course.description?.length > 80 ? '...' : ''}
                          </p>
                          <div className="mb-3">
                            <div className="d-flex justify-content-between mb-1">
                              <span className="text-muted" style={{ fontSize: '0.8rem' }}>Course Progress</span>
                              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: colors[i % 3] }}>0%</span>
                            </div>
                            <div style={{ height: 6, background: '#f1f5f9', borderRadius: 50 }}>
                              <div style={{ width: '0%', height: '100%', background: colors[i % 3], borderRadius: 50 }} />
                            </div>
                          </div>
                          <Link to="/register" className="btn btn-primary w-100">Start Learning →</Link>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )
              })}
            </motion.div>
          </div>
        </section>
      )}

      <hr className="gradient-divider" />

      {/* ── HACKATHONS ── */}
      {hackathons.length > 0 && (
        <section style={{ padding: '6rem 0', background: 'white' }}>
          <div className="container">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="d-flex justify-content-between align-items-end mb-5 flex-wrap gap-3">
              <div>
                <motion.span variants={fadeUp} className="section-label">🏆 Compete</motion.span>
                <motion.h2 variants={fadeUp} className="display-5 fw-bold mb-2">Upcoming Hackathons</motion.h2>
                <motion.p variants={fadeUp} className="text-muted mb-0">Join competitions and win prizes</motion.p>
              </div>
              <motion.div variants={fadeUp}>
                <Link to="/login" className="btn btn-outline-primary px-4">View All →</Link>
              </motion.div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="row g-4">
              {hackathons.map((h) => (
                <div key={h.id} className="col-md-4">
                  <motion.div variants={fadeUp}>
                    <div className="card h-100">
                      {h.banner && (
                        <img src={h.banner} className="card-img-top" alt={h.title}
                          style={{ height: 160, objectFit: 'cover' }}
                          onError={(e) => { e.target.style.display = 'none' }} />
                      )}
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <StatusBadge status={h.status} />
                          {h.organizer_name && <span className="text-muted" style={{ fontSize: '0.8rem' }}>by {h.organizer_name}</span>}
                        </div>
                        <h5 className="fw-bold mb-2">{h.title}</h5>
                        <p className="text-muted small mb-3" style={{ lineHeight: 1.6 }}>
                          {h.description?.substring(0, 80)}{h.description?.length > 80 ? '...' : ''}
                        </p>
                        <div className="d-flex gap-3 mb-4" style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          <span>📅 {formatDate(h.start_date)}</span>
                          <span>🏁 {formatDate(h.end_date)}</span>
                        </div>
                        <Link to="/register" className="btn btn-primary w-100">Join Now →</Link>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      <hr className="gradient-divider" />

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '6rem 0', background: '#fafafa' }}>
        <div className="container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-5">
            <motion.span variants={fadeUp} className="section-label">💬 Testimonials</motion.span>
            <motion.h2 variants={fadeUp} className="display-5 fw-bold mb-3">Loved by developers</motion.h2>
            <motion.p variants={fadeUp} className="text-muted fs-5">See what our community says</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="row g-4">
            {testimonials.map((t) => (
              <div key={t.name} className="col-md-4">
                <motion.div variants={fadeUp}>
                  <div className="card h-100 p-4">
                    <div className="mb-3" style={{ color: '#f59e0b', fontSize: '1rem' }}>{'★'.repeat(t.rating)}</div>
                    <p className="text-muted mb-4" style={{ lineHeight: 1.8, fontStyle: 'italic' }}>"{t.text}"</p>
                    <div className="d-flex align-items-center gap-3 mt-auto">
                      <div className="d-flex align-items-center justify-content-center rounded-circle fw-bold text-white"
                        style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', fontSize: '0.85rem', flexShrink: 0 }}>
                        {t.avatar}
                      </div>
                      <div>
                        <div className="fw-bold" style={{ fontSize: '0.9rem' }}>{t.name}</div>
                        <div className="text-muted" style={{ fontSize: '0.8rem' }}>{t.role}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-hero" style={{ padding: '6rem 0' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center">
            <motion.span variants={fadeUp} className="section-label" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
              🎯 Get Started Today
            </motion.span>
            <motion.h2 variants={fadeUp} className="display-4 fw-bold text-white mb-4 mt-3">
              Ready to level up your skills?
            </motion.h2>
            <motion.p variants={fadeUp} className="fs-5 mb-5" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 500, margin: '0 auto 2rem' }}>
              Join thousands of developers learning, building, and competing on DEVSIQ. It's completely free to get started.
            </motion.p>
            <motion.div variants={fadeUp} className="d-flex gap-3 justify-content-center flex-wrap">
              <Link to="/register" className="btn btn-light btn-lg px-5 py-3">
                Create Free Account →
              </Link>
              <Link to="/login" className="btn btn-outline-light btn-lg px-5 py-3">
                Sign In
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0f172a', padding: '3rem 0 2rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container">
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.3rem', background: 'linear-gradient(135deg, #a5b4fc, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: '0.75rem' }}>
                ⚡ DEVSIQ
              </div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', lineHeight: 1.7 }}>
                Your all-in-one platform for web development learning, cheatsheets, and hackathon discovery.
              </p>
            </div>
            <div className="col-md-2">
              <div style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Platform</div>
              {['Courses', 'Hackathons', 'Cheatsheets'].map(l => (
                <div key={l} style={{ marginBottom: '0.5rem' }}>
                  <Link to="/login" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'white'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}>
                    {l}
                  </Link>
                </div>
              ))}
            </div>
            <div className="col-md-2">
              <div style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Account</div>
              {[['Login', '/login'], ['Register', '/register']].map(([l, href]) => (
                <div key={l} style={{ marginBottom: '0.5rem' }}>
                  <Link to={href} style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = 'white'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.45)'}>
                    {l}
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>
              © {new Date().getFullYear()} DEVSIQ. All rights reserved.
            </span>
            <div className="d-flex gap-3">
              {['GitHub', 'Twitter', 'LinkedIn'].map(s => (
                <span key={s} style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'white'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
