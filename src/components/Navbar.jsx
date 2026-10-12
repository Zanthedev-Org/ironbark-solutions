import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, User, Heart, ShoppingCart,
  LayoutGrid, Armchair, Zap, Wind, Refrigerator, RefreshCcw, Tv, Home as HomeIcon,
  Gamepad2, Menu, PhoneCall, ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../pages/Home';
import ThemeToggle from './ThemeToggle';
import { listenToCategories } from '../utils/catalogService';

export default function Navbar() {
  const { user, cartCount, cartTotal, wishlist } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const [departments, setDepartments] = useState([]);
  useEffect(() => {
    const unsub = listenToCategories(cats => {
      const tree = {};
      cats.forEach(c => {
        const dept = c.department || c.name;
        if (!tree[dept]) tree[dept] = true;
      });
      setDepartments(Object.keys(tree).slice(0, 6));
    });
    return () => unsub();
  }, []);

  const getDeptIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('furnitur')) return <Armchair size={14} />;
    if (n.includes('inverter') || n.includes('solar')) return <Zap size={14} />;
    if (n.includes('ac') || n.includes('condition')) return <Wind size={14} />;
    if (n.includes('fridge') || n.includes('freeze') || n.includes('refrigerat')) return <Refrigerator size={14} />;
    if (n.includes('wash')) return <RefreshCcw size={14} />;
    if (n.includes('tv') || n.includes('audio')) return <Tv size={14} />;
    if (n.includes('gam')) return <Gamepad2 size={14} />;
    if (n.includes('home') || n.includes('appliance')) return <HomeIcon size={14} />;
    return <LayoutGrid size={14} />;
  };

  return (
    <>
      <div className="sc-nav-pill-wrap">
        <nav className="sc-nav-pill">
          
          {/* LOGO */}
          <Link to="/" className="sc-nav-logo">
            <img src="/smartchoice-logo.jpeg" alt="SmartChoice" />
            <div className="sc-nav-logo__text">
              <span className="sc-nav-logo__title">SmartChoice</span>
              <span className="sc-nav-logo__sub desktop-only">ELECTRONICS</span>
            </div>
          </Link>

          {/* SEARCH PILL */}
          <form onSubmit={handleSearch} className="sc-nav-search desktop-only">
            <input
              type="search"
              placeholder="Search furniture, inverters, ACs, fridges, washing machines..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button type="submit">
              <Search size={16} />
            </button>
          </form>

          {/* ACTIONS */}
          <div className="sc-nav-actions desktop-only">
            {/* NEW: Categories Dropdown/Link for Desktop */}
            <div className="sc-nav-dropdown-wrapper" style={{ position: 'relative' }}>
              <Link to="/shop" className="sc-nav-btn" style={{ background: 'linear-gradient(135deg, var(--blue-lt), var(--blue))', color: '#fff', border: 'none' }}>
                <LayoutGrid size={16} /> Shop All
              </Link>
            </div>

            {user?.isAdmin && (
              <Link to="/admin" className="sc-nav-btn">
                <ShieldCheck size={16} color="var(--red)" />
                Admin
              </Link>
            )}

            <Link to={user ? "/profile" : "/login"} className="sc-nav-btn">
              <User size={16} />
              {user ? user.firstName || 'User' : 'Sign In'}
            </Link>

            <Link to="/wishlist" className="sc-nav-btn">
              <Heart size={16} />
              Saved <span className="sc-nav-badge">{wishlist.length}</span>
            </Link>

            <Link to="/cart" className="sc-nav-btn sc-nav-btn--cart">
              <ShoppingCart size={16} />
              <span className="desktop-only">{formatCurrency(cartTotal)}</span>
              <span className="sc-nav-badge">{cartCount}</span>
            </Link>
            
            <ThemeToggle />
          </div>

          {/* MOBILE TOGGLES */}
          <div className="sc-nav-actions mobile-only">
            <Link to="/cart" className="sc-nav-btn sc-nav-btn--cart" style={{ padding: '8px', borderRadius: '50%', position: 'relative' }}>
              <ShoppingCart size={16} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  background: 'var(--red)', color: '#fff',
                  fontSize: '10px', fontWeight: 900,
                  width: '18px', height: '18px',
                  borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  lineHeight: 1, pointerEvents: 'none'
                }}>{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </Link>
            <button className="sc-nav-btn" onClick={() => setIsMobileMenuOpen(true)} style={{ padding: '8px', borderRadius: '50%' }}>
              <Menu size={18} />
            </button>
          </div>
        </nav>
      </div>

      {/* MOBILE MENU MODAL */}
      <div
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={e => { if (e.target === e.currentTarget) setIsMobileMenuOpen(false); }}
      >
        <div className="mobile-menu-content">
          <button className="close-menu-btn" onClick={() => setIsMobileMenuOpen(false)}>×</button>
          <div className="mobile-menu-header">
            <img src="/smartchoice-logo.jpeg" alt="logo" style={{ width:28, height:28, borderRadius:'50%' }} />
            SmartChoice Electronics
          </div>

          <div className="mobile-menu-links">
            <form onSubmit={handleSearch} className="sc-nav-search" style={{ margin: '0 18px 18px', maxWidth: '100%', background: 'var(--surface2)' }}>
              <input type="search" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              <button type="submit"><Search size={16} /></button>
            </form>

            <Link to={user ? "/profile" : "/login"} onClick={() => setIsMobileMenuOpen(false)}>
              <User size={16} /> {user ? `Hi, ${user.name}` : 'Sign In / Account'}
            </Link>
            <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>
              <Heart size={16} /> Saved Items ({wishlist.length})
            </Link>
            <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} style={{ color:'var(--red)', fontWeight:700 }}>
              <ShoppingCart size={16} /> Cart — {formatCurrency(cartTotal)} ({cartCount})
            </Link>
            {user?.isAdmin && (
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} style={{ color:'var(--red)', fontWeight:700 }}>
                <ShieldCheck size={16} /> Admin Dashboard
              </Link>
            )}
            <div style={{ height:1, background:'var(--border)', margin:'4px 0' }} />
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>
              <LayoutGrid size={15} /> All Departments
            </Link>
            {departments.map(dept => (
              <Link key={dept} to={`/shop?dept=${encodeURIComponent(dept)}`} onClick={() => setIsMobileMenuOpen(false)}>
                {getDeptIcon(dept)} {dept}
              </Link>
            ))}
            <div style={{ height:1, background:'var(--border)', margin:'4px 0' }} />
            <div style={{ padding:'12px 18px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:13, color:'var(--text-m)' }}>Theme</span>
              <ThemeToggle />
            </div>
            <div style={{ padding:'12px 18px', background:'var(--surface2, #FFF0F1)', display:'flex', flexDirection:'column', gap:8 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'var(--text-m)', textTransform:'uppercase', letterSpacing:'0.5px' }}>Customer Support Lines</div>
              <a href="tel:+2348165929400" style={{ color:'var(--red)', fontWeight:700, display:'flex', alignItems:'center', gap:6, fontSize:13 }}>
                <PhoneCall size={14} /> 37 NTA Road: +234 816 592 9400
              </a>
              <a href="tel:+2348165896158" style={{ color:'var(--red)', fontWeight:700, display:'flex', alignItems:'center', gap:6, fontSize:13 }}>
                <PhoneCall size={14} /> 71 NTA MTN Rd: +234 816 589 6158
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
