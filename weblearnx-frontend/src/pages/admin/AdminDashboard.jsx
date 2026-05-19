import { Link } from 'react-router-dom'

export default function AdminDashboard() {
  const sections = [
    {
      title: 'Pending Organizers',
      description: 'Review and approve or reject organizer account requests.',
      link: '/admin/organizers',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
          <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
          <path fillRule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z"/>
          <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"/>
        </svg>
      ),
      color: 'warning',
      btnLabel: 'Manage Organizers',
    },
    {
      title: 'Courses',
      description: 'Create and manage learning courses available on the platform.',
      link: '/admin/courses',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
          <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/>
        </svg>
      ),
      color: 'primary',
      btnLabel: 'Manage Courses',
    },
    {
      title: 'Cheatsheets',
      description: 'Add and manage quick reference cheatsheets for users.',
      link: '/admin/cheatsheets',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
          <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
        </svg>
      ),
      color: 'success',
      btnLabel: 'Manage Cheatsheets',
    },
    {
      title: 'Hackathons',
      description: 'Browse all hackathons across the platform.',
      link: '/hackathons',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
          <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
        </svg>
      ),
      color: 'info',
      btnLabel: 'View Hackathons',
    },
  ]

  return (
    <div className="container py-5">
      <div className="mb-5">
        <h2 className="fw-bold mb-1">Admin Dashboard</h2>
        <p className="text-muted">Manage all platform content and users from here.</p>
      </div>

      <div className="row g-4">
        {sections.map((section) => (
          <div key={section.title} className="col-md-6">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex align-items-start gap-3">
                  <div className={`text-${section.color} flex-shrink-0`}>
                    {section.icon}
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="fw-bold mb-1">{section.title}</h5>
                    <p className="text-muted mb-3">{section.description}</p>
                    <Link to={section.link} className={`btn btn-${section.color} btn-sm`}>
                      {section.btnLabel} →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
