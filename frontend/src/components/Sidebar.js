import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS_USER = [
  { to: '/dashboard', label: '📊 Dashboard' },
  { to: '/books', label: '📚 Browse Books' },
  { to: '/my-transactions', label: '🔖 My Borrows' },
];

const NAV_LINKS_ADMIN = [
  { to: '/dashboard', label: '📊 Dashboard' },
  { to: '/books', label: '📚 Books' },
  { to: '/admin/books', label: '⚙️ Manage Books' },
  { to: '/admin/transactions', label: '📋 All Transactions' },
  { to: '/admin/overdue', label: '⚠️ Overdue' },
];

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = isAdmin() ? NAV_LINKS_ADMIN : NAV_LINKS_USER;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        📖 LibraryMS
        <span>Management System</span>
      </div>
      <nav>
        {links.map(({ to, label }) => (
          <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : ''}>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <strong>{user?.name}</strong>
        <span>{user?.role}</span>
        <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
      </div>
    </aside>
  );
}
