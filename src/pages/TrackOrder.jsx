import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, AlertCircle, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { formatCurrency } from './Home';

export default function TrackOrder() {
  const [queryInput, setQueryInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    const qTerm = queryInput.trim();
    if (!qTerm) {
      setError('Please enter your Order ID or phone number.');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      // 1. Try finding by Document ID directly
      if (qTerm.length >= 10) {
        try {
          const docRef = doc(db, 'orders', qTerm);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setOrder({ id: docSnap.id, ...docSnap.data() });
            setLoading(false);
            return;
          }
        } catch {}
      }

      // 2. Try querying by phone or partial ID
      const ordersRef = collection(db, 'orders');
      
      // Query by phone
      const phoneQ = query(ordersRef, where('customerPhone', '==', qTerm));
      const phoneSnap = await getDocs(phoneQ);
      if (!phoneSnap.empty) {
        const found = phoneSnap.docs[0];
        setOrder({ id: found.id, ...found.data() });
        setLoading(false);
        return;
      }

      // Try searching all recent orders for matching prefix ID or phone
      const allSnap = await getDocs(ordersRef);
      const matched = allSnap.docs.find(d => {
        const idMatch = d.id.toLowerCase().includes(qTerm.toLowerCase());
        const data = d.data();
        const pMatch = data.customerPhone && data.customerPhone.includes(qTerm);
        return idMatch || pMatch;
      });

      if (matched) {
        setOrder({ id: matched.id, ...matched.data() });
      } else {
        setError(`No order found matching "${qTerm}". Please check your Order ID or phone number.`);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while tracking your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('deliver')) return 4;
    if (s.includes('transit') || s.includes('shipped') || s.includes('dispatch')) return 3;
    if (s.includes('process') || s.includes('confirm')) return 2;
    return 1; // Pending
  };

  const steps = [
    { title: 'Order Placed', desc: 'Received & pending verification' },
    { title: 'Processing', desc: 'Verified & packaged in store' },
    { title: 'In Transit', desc: 'Out for city dispatch / haulage' },
    { title: 'Delivered', desc: 'Verified & handed over' },
  ];

  const currentStep = order ? getStatusStep(order.status) : 1;

  return (
    <main style={{ minHeight: '80vh', padding: '0 0 60px', background: 'var(--bg)', color: 'var(--text-b)' }}>
      <SEO
        title="Track Your Order | Smart Choice Electronics"
        description="Track your Smart Choice Electronics order delivery status in Port Harcourt and across Nigeria."
        url="/track-order"
      />

      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--blue) 0%, var(--blue-lt) 60%, var(--red) 100%)',
        padding: '60px 20px 56px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 0,
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: 'linear-gradient(90deg,#D0021B,#0C2D6B,#F0B800,#2257C5)' }} />
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.3)', borderRadius: 30,
          padding: '6px 18px', marginBottom: 18,
        }}>
          <Truck size={13} color="#fff" />
          <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Dispatch & Delivery Tracking</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font2)', fontSize: 'clamp(28px,5vw,46px)', fontWeight: 900, color: '#fff', margin: '0 0 12px', textShadow: '0 2px 16px rgba(0,0,0,0.25)' }}>
          Track Your <span style={{ color: '#F0B800' }}>Order</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, maxWidth: 500, margin: '0 auto' }}>
          Enter your Order ID (from your confirmation receipt) or your registered phone number to view live progress.
        </p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 16px 0' }}>

        {/* Search Box */}
        <form onSubmit={handleTrack} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '24px', boxShadow: 'var(--sh-md)', marginBottom: '36px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search size={18} color="var(--text-m)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={queryInput}
                onChange={e => setQueryInput(e.target.value)}
                placeholder="Enter Order ID (e.g. 7k8Q1a...) or Phone (+234...)"
                className="form-input"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  paddingLeft: '44px',
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'var(--red)', color: '#fff',
                border: 'none', borderRadius: 'var(--r-sm)',
                padding: '0 28px', fontSize: '14px', fontWeight: 800,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                height: '48px', boxShadow: 'var(--sh-red)', opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Tracking...' : 'Track Order'}
            </button>
          </div>

          {error && (
            <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(208,2,27,0.07)', border: '1px solid rgba(208,2,27,0.25)', borderRadius: 'var(--r-sm)', color: 'var(--red)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}
        </form>

        {/* Results Card */}
        {order && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-xl)', padding: '28px', boxShadow: 'var(--sh-lg)', animation: 'fadeIn 0.3s ease' }}>
            
            {/* Order Meta Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--text-m)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Order ID</span>
                <h2 style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: 900, fontFamily: 'monospace', color: 'var(--text-h)' }}>
                  #{order.id.slice(0, 10).toUpperCase()}
                </h2>
                <div style={{ fontSize: '12px', color: 'var(--text-m)', marginTop: '4px' }}>
                  Customer: <strong style={{ color: 'var(--text-h)' }}>{order.customerName || 'Valued Customer'}</strong> ({order.customerPhone})
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{
                  display: 'inline-block',
                  background: currentStep === 4 ? 'rgba(10,122,50,0.12)' : 'rgba(208,2,27,0.1)',
                  color: currentStep === 4 ? '#0A7A32' : 'var(--red)',
                  border: `1px solid ${currentStep === 4 ? 'rgba(10,122,50,0.3)' : 'rgba(208,2,27,0.3)'}`,
                  borderRadius: '20px', padding: '6px 16px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em'
                }}>
                  {order.status || 'Pending Verification'}
                </span>
                <div style={{ fontSize: '12px', color: 'var(--text-m)', marginTop: '6px' }}>
                  Total: <strong style={{ color: 'var(--text-h)' }}>{formatCurrency(order.total)}</strong>
                </div>
              </div>
            </div>

            {/* Stepper */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', position: 'relative' }}>
                {steps.map((st, i) => {
                  const stepNum = i + 1;
                  const isDone = stepNum <= currentStep;
                  const isCurrent = stepNum === currentStep;

                  return (
                    <div key={st.title} style={{ textAlign: 'center' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%', margin: '0 auto 8px',
                        background: isDone ? (isCurrent ? 'var(--red)' : 'rgba(10,122,50,0.15)') : 'var(--bg)',
                        border: `2px solid ${isDone ? (isCurrent ? 'var(--red)' : '#0A7A32') : 'var(--border)'}`,
                        color: isDone ? (isCurrent ? '#fff' : '#0A7A32') : 'var(--text-m)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px',
                        boxShadow: isCurrent ? 'var(--sh-red)' : 'none'
                      }}>
                        {isDone && !isCurrent ? <CheckCircle2 size={18} /> : stepNum}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: isCurrent ? 800 : 600, color: isDone ? 'var(--text-h)' : 'var(--text-m)' }}>
                        {st.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-m)', marginTop: '2px', lineHeight: 1.3 }}>
                        {st.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery & Items Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              {/* Delivery Address */}
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                  <MapPin size={13} /> Destination Address
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-h)', lineHeight: 1.6 }}>
                  {order.deliveryAddress || 'Port Harcourt, Rivers State'}
                </p>
                <div style={{ fontSize: '12px', color: 'var(--text-m)', marginTop: '8px' }}>
                  Standard Fee: <strong style={{ color: 'var(--text-h)' }}>{formatCurrency(order.deliveryFee || 7000)}</strong>
                </div>
              </div>

              {/* Items Summary */}
              <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                  <Package size={13} /> Items Ordered ({(order.items || []).length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {(order.items || []).map((it, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: 'var(--text-h)' }}>{it.name} (x{it.qty || 1})</span>
                      <span style={{ color: 'var(--text-m)' }}>{formatCurrency((it.price || 0) * (it.qty || 1))}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Help Callout */}
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-m)' }}>
                Need assistance with this delivery? Contact dispatch directly:
              </div>
              <a
                href="tel:+2348165929400"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: 'var(--red)', color: '#fff',
                  padding: '8px 16px', borderRadius: 'var(--r-sm)',
                  fontSize: '12px', fontWeight: 700, textDecoration: 'none'
                }}
              >
                <Phone size={13} /> Call Dispatch (+234 816 592 9400)
              </a>
            </div>

          </div>
        )}

        {/* Quick Guidelines */}
        <div style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '18px', boxShadow: 'var(--sh-sm)' }}>
            <Clock size={20} color="var(--red)" style={{ marginBottom: '8px' }} />
            <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 800, color: 'var(--text-h)' }}>Dispatch Timelines</h4>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-m)', lineHeight: 1.5 }}>
              Orders verified before 12:00 PM are dispatched same-day within Port Harcourt.
            </p>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '18px', boxShadow: 'var(--sh-sm)' }}>
            <ShieldCheck size={20} color="#0A7A32" style={{ marginBottom: '8px' }} />
            <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 800, color: 'var(--text-h)' }}>Delivery Inspection</h4>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-m)', lineHeight: 1.5 }}>
              Inspect seals and physical conditions in the presence of our courier before sign-off.
            </p>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '18px', boxShadow: 'var(--sh-sm)' }}>
            <AlertCircle size={20} color="#8B6914" style={{ marginBottom: '8px' }} />
            <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 800, color: 'var(--text-h)' }}>Special Logistics</h4>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-m)', lineHeight: 1.5 }}>
              Oversized solar inverters &amp; chest freezers require customized freight arrangement.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
