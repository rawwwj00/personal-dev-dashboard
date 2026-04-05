
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const adminNav = [
  { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { to: '/roadmaps', icon: '◎', label: 'Roadmaps' },
  { to: '/projects', icon: '◈', label: 'Projects' },
  { to: '/certificates', icon: '✦', label: 'Certificates' },
  { to: '/tools', icon: '⚙', label: 'Dev Tools' },
];

const guestNav = [
  { to: '/dashboard', icon: '⊞', label: 'Dashboard' },
  { to: '/roadmaps', icon: '◎', label: 'Roadmaps' },
  { to: '/projects', icon: '◈', label: 'Projects' },
  { to: '/certificates', icon: '✦', label: 'Certificates' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const nav = isAdmin ? adminNav : guestNav;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <aside className="sidebar">
      {/* Red top accent bar — signature Adaux element */}
      <div style={{ height: '3px', background: 'var(--accent)', flexShrink: 0 }} />

      <div className="sidebar-logo">
        <div className="logo-text">DevDash</div>
        <div className="logo-sub">Raj's Developer Portfolio</div>
      </div>

      <nav className="sidebar-nav">
        {nav.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span style={{ fontSize: '14px', flexShrink: 0 }}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="role-badge">
          <div className={`role-dot${isAdmin ? '' : ' guest'}`} />
          <span>{isAdmin ? 'Admin' : 'Guest'}</span>
          <span style={{ marginLeft: 'auto' }}>
            {isAdmin ? 'FULL ACCESS' : 'READ-ONLY'}
          </span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <span>↩</span> Logout
        </button>
      </div>
    </aside>
  );
}
