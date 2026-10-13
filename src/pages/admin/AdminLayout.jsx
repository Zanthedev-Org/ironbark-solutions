import React, { useState } from 'react';
import { Navigate, Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Package, PlusCircle, LogOut, Users, ClipboardList,
  LayoutDashboard, Menu, X, Loader2, Tag, Briefcase, Settings, MapPin
} from 'lucide-react';

export default function AdminLayout() {
  const { user, authLoading, logout } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <Loader2 className="spinner" size={48} color="var(--red)" />
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const navLinks = [
    { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard', end: true },
    { to: '/admin/products', icon: <Package size={18} />, label: 'Products' },
    { to: '/admin/add-product', icon: <PlusCircle size={18} />, label: 'Add Product' },
    { to: '/admin/orders', icon: <ClipboardList size={18} />, label: 'Orders' },
    { to: '/admin/users', icon: <Users size={18} />, label: 'Users' },
    { to: '/admin/categories', icon: <Tag size={18} />, label: 'Categories' },
    { to: '/admin/brands', icon: <Briefcase size={18} />, label: 'Brands' },
    { to: '/admin/locations', icon: <MapPin size={18} />, label: 'Locations' },
    { to: '/admin/settings', icon: <Settings size={18} />, label: 'Site Settings' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', color: 'var(--text-b)' }}>

      {/* Mobile Header */}
      <div style={{
        display: 'none', background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '14px 20px', justifyContent: 'space-between', alignItems: 'center'
      }} className="admin-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: '#fff', borderRadius: '6px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px', boxShadow: 'var(--sh-sm)' }}>
            <img src="/smartchoice-logo.jpeg" alt="Smart Choice" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div style={{ fontFamily: 'var(--font2)', fontWeight: 900, fontSize: '18px' }}>
            <span style={{ color: 'var(--red)' }}>Smart</span><span style={{ color: '#2257C5' }}>Choice</span>
            <span style={{ fontSize: '10px', color: 'var(--text-m)', marginLeft: '6px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin</span>
          </div>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{
          background: 'var(--border)', padding: '6px', borderRadius: 'var(--r-sm)',
          border: 'none', color: 'var(--text-h)', cursor: 'pointer', display: 'flex'
        }}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>

        {/* Sidebar Overlay (Mobile) */}
        {mobileOpen && (
          <div
            className="admin-overlay"
            onClick={() => setMobileOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1999, backdropFilter: 'blur(4px)' }}
          />
        )}

        {/* Sidebar */}
        <aside className={`admin-sidebar ${mobileOpen ? 'open' : ''}`} style={{
          width: '260px',
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', flexShrink: 0,
          position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
          boxShadow: 'var(--sh-md)',
        }}>
          {/* Logo */}
          <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border)' }}>
            <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '10px' }}>
              <div style={{ width: '40px', height: '40px', background: '#fff', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px', flexShrink: 0, boxShadow: 'var(--sh-sm)' }}>
                <img src="/smartchoice-logo.jpeg" alt="Smart Choice" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontFamily: 'var(--font2)', fontWeight: 900, fontSize: '17px', lineHeight: 1.2 }}>
                  <span style={{ color: 'var(--red)' }}>Smart</span><span style={{ color: '#2257C5' }}>Choice</span>
                </div>
                <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-m)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Admin Portal
                </div>
              </div>
            </NavLink>

            {/* Logged-in user chip */}
            <div style={{
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-sm)', padding: '8px 12px',
              fontSize: '11px', color: 'var(--text-m)', wordBreak: 'break-all',
            }}>
              <span style={{ fontWeight: 800, color: 'var(--text-h)' }}>Logged in:</span><br />
              {user.email}
            </div>
          </div>

          {/* Nav Links */}
          <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setMobileOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '11px 14px', borderRadius: 'var(--r-sm)',
                  fontSize: '14px', fontWeight: 700, textDecoration: 'none',
                  transition: 'var(--ease)',
                  background: isActive ? 'rgba(208,2,27,0.08)' : 'transparent',
                  color: isActive ? 'var(--red)' : 'var(--text-b)',
                  borderLeft: `3px solid ${isActive ? 'var(--red)' : 'transparent'}`,
                })}
              >
                {link.icon} {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Sign Out */}
          <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
            <button
              onClick={handleLogout}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '8px', padding: '12px', borderRadius: 'var(--r-sm)',
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text-b)', fontSize: '14px', fontWeight: 700,
                cursor: 'pointer', transition: 'var(--ease)'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.background = 'rgba(208,2,27,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-b)'; e.currentTarget.style.background = 'transparent'; }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{
          flex: 1, minWidth: 0,
          padding: '32px',
          overflowX: 'hidden', overflowY: 'auto',
          background: 'var(--bg)',
          color: 'var(--text-b)',
        }} className="admin-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
