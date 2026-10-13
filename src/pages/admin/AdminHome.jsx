import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, ClipboardList, PlusCircle, Settings, MapPin, Tag, Briefcase, Loader2 } from 'lucide-react';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '../../firebase';

export default function AdminHome() {
  const [counts, setCounts] = useState({ products: null, orders: null, users: null });

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [prodSnap, orderSnap, userSnap] = await Promise.all([
          getCountFromServer(collection(db, 'products')),
          getCountFromServer(collection(db, 'orders')),
          getCountFromServer(collection(db, 'users')),
        ]);
        setCounts({
          products: prodSnap.data().count,
          orders: orderSnap.data().count,
          users: userSnap.data().count,
        });
      } catch (e) {
        console.error('Failed to load counts', e);
        setCounts({ products: '—', orders: '—', users: '—' });
      }
    };
    loadCounts();
  }, []);

  const stats = [
    { label: 'Total Products', icon: <Package size={24} />, value: counts.products, link: '/admin/products', color: 'var(--red)' },
    { label: 'All Orders', icon: <ClipboardList size={24} />, value: counts.orders, link: '/admin/orders', color: '#2257C5' },
    { label: 'Registered Users', icon: <Users size={24} />, value: counts.users, link: '/admin/users', color: '#0A7A32' },
  ];

  const quickActions = [
    { label: 'Add New Product', icon: <PlusCircle size={20} />, link: '/admin/add-product', desc: 'Upload a product to your store', color: 'var(--red)' },
    { label: 'Manage Products', icon: <Package size={20} />, link: '/admin/products', desc: 'Edit, feature, or remove products', color: '#2257C5' },
    { label: 'View Orders', icon: <ClipboardList size={20} />, link: '/admin/orders', desc: 'Review and update customer orders', color: '#0A7A32' },
    { label: 'View Users', icon: <Users size={20} />, link: '/admin/users', desc: 'See all registered customers', color: '#7B2FBE' },
    { label: 'Categories', icon: <Tag size={20} />, link: '/admin/categories', desc: 'Manage product categories', color: '#E65100' },
    { label: 'Brands', icon: <Briefcase size={20} />, link: '/admin/brands', desc: 'Manage product brands', color: '#00796B' },
    { label: 'Visitor Locations', icon: <MapPin size={20} />, link: '/admin/locations', desc: 'Track where visitors are browsing from', color: '#C2185B' },
    { label: 'Site Settings', icon: <Settings size={20} />, link: '/admin/settings', desc: 'Hero slides, ticker, delivery settings', color: '#8B6914' },
  ];

  return (
    <div>
      {/* Branded header */}
      <div style={{
        background: 'linear-gradient(135deg, #0C2D6B 0%, #1A4494 50%, #D0021B 100%)',
        borderRadius: 'var(--r-xl)', padding: '28px 32px', marginBottom: '28px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(90deg,#D0021B,#0C2D6B,#F0B800,#2257C5)' }} />
        <h1 style={{ fontFamily: 'var(--font2)', fontSize: '24px', fontWeight: 900, color: '#fff', marginBottom: '6px' }}>
          Welcome back, Admin ⚡
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px' }}>Manage your Smart Choice Electronics storefront from here.</p>
      </div>

      {/* Live stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {stats.map(s => (
          <Link key={s.label} to={s.link} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-lg)', padding: '22px',
              display: 'flex', alignItems: 'center', gap: '16px',
              transition: 'var(--ease)', boxShadow: 'var(--sh-sm)',
              borderLeft: `4px solid ${s.color}`,
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--sh-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--sh-sm)'; e.currentTarget.style.transform = ''; }}
            >
              <div style={{ width: '50px', height: '50px', borderRadius: 'var(--r-md)', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: '26px', fontWeight: 900, fontFamily: 'var(--font2)', color: s.color, lineHeight: 1 }}>
                  {s.value === null ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : s.value}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-m)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px' }}>{s.label}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 style={{ fontFamily: 'var(--font2)', fontSize: '18px', fontWeight: 900, color: 'var(--text-h)', marginBottom: '16px' }}>
        Quick Actions
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
        {quickActions.map(a => (
          <Link key={a.label} to={a.link} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-lg)', padding: '18px 20px',
              display: 'flex', alignItems: 'center', gap: '14px',
              transition: 'var(--ease)', boxShadow: 'var(--sh-sm)',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.boxShadow = 'var(--sh-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'var(--sh-sm)'; e.currentTarget.style.transform = ''; }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--r-md)', background: `${a.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.color, flexShrink: 0 }}>
                {a.icon}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-h)', marginBottom: '3px' }}>{a.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-m)' }}>{a.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
