import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }
const stagger = { visible: { transition: { staggerChildren: 0.1 } } }

export default function Home() {
  const { user } = useAuth()

  const quickLinks = [
    {
      icon: '📚', title: 'Courses', desc: 'Structured learning paths with progress tracking.',
      link: '/courses', btnLabel: 'Browse Courses', color: '#6366f1', bg: 'rgba(99,102,241,0.1)',
    },
    {
      icon: '🏆', title: 'Hackathons', desc: 'Discover and join the best hackathons worldwide.',
      link: '/hackathons', btnLabel: 'Explore Hackathons', color: '#10b981', bg: 'rgba(16,185,129,0.1)',
    },
    {
      icon: '⚡', title: 'Cheatsheets', desc: 'Quick-reference guides for every language and framework.',
      link: '/cheatsheets', btnLabel: 'View Cheatsheets', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',
    },
    ...(user?.role === 'user' ? [{
      icon: '🔖', title: 'Bookmarks', desc: 'All your saved hackathons in one place.',
      link: '/bookmarks', btnLabel: 'My Bookmarks', color: '#06b6d4', bg: 'rgba(6,182,212,0.1)',
    }] : []),
    ...(user?.role === 'organizer' ? [{
      icon: '🎯', title: 'My Hackathons', desc: 'Manage your hackathon listings and track registrations.',
      link: '/organizer/dashboard', btnLabel: 'Go to Dashboard', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',
    }] : []),
    ...(user?.role === 'admin' ? [{
      icon: '⚙️', title: 'Admin Panel', desc: 'Manage users, courses, cheatsheets, and organizers.',
      link: '/admin/dashboard', btnLabel: 'Open Admin', color: '#ef4444', bg: 'rgba(239,68,68,0.1)',
    }] : []),
  ]

  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'there'

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh' }}>

      {/* ── HERO BANNER ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
        padding: '4rem 0 5rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow blobs */}
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(99,102,241,0.2)', color: '#a5b4fc',
                border: '1px solid rgba(99,102,241,0.3)', borderRadius: 50,
                padding: '0.3rem 1rem', fontSize: '0.8rem', fontWeight: 600,
                letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '1.25rem',
              }}>
                👋 Welcome back
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} style={{
              fontFamily: 'Poppins, sans-serif', fontWeight: 800,
              fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'white',
              lineHeight: 1.1, marginBottom: '1rem', letterSpacing: '-0.03em',
            }}>
              Hey, <span style={{ background: 'linear-gradient(135deg, #a5b4fc, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{firstName}</span>! 👋
            </motion.h1>

            <motion.p variants={fadeUp} style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.1rem', maxWidth: 520, lineHeight: 1.7, marginBottom: '2rem' }}>
              Continue your learning journey. Explore courses, track your progress, and discover the latest hackathons.
            </motion.p>

            <motion.div variants={fadeUp} className="d-flex gap-3 flex-wrap">
              <Link to="/courses" className="btn btn-light btn-lg px-4 py-2">
                Continue Learning →
              </Link>
              <Link to="/hackathons" className="btn btn-outline-light btn-lg px-4 py-2">
                Browse Hackathons
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── QUICK LINKS ── */}
      <div className="container" style={{ marginTop: '-2rem', position: 'relative', zIndex: 2, paddingBottom: '4rem' }}>
        <motion.div initial="hidden" animate="visible" variants={stagger} className="row g-4">
          {quickLinks.map((item) => (
            <div key={item.title} className={`col-md-6 col-lg-${quickLinks.length <= 3 ? '4' : '3'}`}>
              <motion.div variants={fadeUp}>
                <div className="card h-100 p-4" style={{ borderTop: `3px solid ${item.color}` }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: item.bg, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', marginBottom: '1rem',
                  }}>
                    {item.icon}
                  </div>
                  <h5 className="fw-bold mb-2">{item.title}</h5>
                  <p className="text-muted small mb-4" style={{ lineHeight: 1.6 }}>{item.desc}</p>
                  <Link to={item.link} className="btn btn-sm mt-auto" style={{
                    background: item.bg, color: item.color,
                    border: `1px solid ${item.color}30`,
                    fontWeight: 600, borderRadius: 8,
                  }}>
                    {item.btnLabel} →
                  </Link>
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>

        {/* ── TIPS BANNER ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="mt-5 p-4 d-flex align-items-center gap-4 flex-wrap"
          style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))', borderRadius: 16, border: '1px solid rgba(99,102,241,0.15)' }}>
          <div style={{ fontSize: '2.5rem' }}>💡</div>
          <div className="flex-grow-1">
            <div className="fw-bold mb-1" style={{ color: '#1e293b' }}>Pro Tip</div>
            <div className="text-muted small">Use the Cheatsheets section for quick reference while coding. Mark articles as complete to track your course progress.</div>
          </div>
          <Link to="/cheatsheets" className="btn btn-primary btn-sm px-4">
            Open Cheatsheets
          </Link>
        </motion.div>
      </div>

    </div>
  )
}
