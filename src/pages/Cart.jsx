import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Tag, Truck, ShieldCheck, AlertTriangle, X } from 'lucide-react';
import { formatCurrency } from './Home';
import { useApp } from '../context/AppContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Cart() {
  const { cart: items, updateCartQty: updateQty, removeFromCart: removeItem, clearCart } = useApp();
  const [coupon, setCoupon] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(7000);
  const [deliveryNoticeTemplate, setDeliveryNoticeTemplate] = useState(
    "This item may incur additional delivery charges due to its size, weight, or fragility."
  );
  const [showDeliveryPopup, setShowDeliveryPopup] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'site_settings'));
        if (snap.exists()) {
          const d = snap.data();
          if (d.deliveryFee !== undefined) setDeliveryFee(Number(d.deliveryFee) || 7000);
          if (d.deliveryNoticeTemplate) setDeliveryNoticeTemplate(d.deliveryNoticeTemplate);
        }
      } catch {}
    };
    fetchSettings();
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * parseInt(item.qty || 1, 10), 0);
  const shipping = deliveryFee;
  const total = subtotal + shipping;

  const specialDeliveryItems = items.filter(item =>
    item.requiresSpecialDelivery ||
    (Array.isArray(item.deliveryCriteria) && item.deliveryCriteria.length > 0) ||
    item.customDeliveryNotice
  );
  const hasSpecialDelivery = specialDeliveryItems.length > 0;

  return (
    <main className="cart-page-main">
      <div className="cart-page-container">

        {/* Page Header */}
        <div className="cart-page-header">
          <div className="cart-page-title-wrap">
            <ShoppingCart size={26} color="var(--red)" />
            <h1 className="cart-page-title">Shopping Cart</h1>
            <span className="cart-page-count">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-m)',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--red)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-m)'}
              >
                <Trash2 size={13} /> Clear Cart
              </button>
            )}
            <Link to="/shop" className="cart-continue-link">
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-lg)',
            padding: '64px 24px',
            textAlign: 'center',
            maxWidth: '560px',
            margin: '40px auto',
            boxShadow: 'var(--sh-md)'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--surface2)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <ShoppingCart size={38} color="var(--red)" strokeWidth={1.75} />
            </div>
            <h2 style={{ fontFamily: 'var(--font2)', fontSize: '24px', fontWeight: 900, marginBottom: '10px', color: 'var(--text-h)' }}>
              Your shopping cart is empty
            </h2>
            <p style={{ color: 'var(--text-m)', marginBottom: '28px', fontSize: '14px', maxWidth: '380px', margin: '0 auto 28px', lineHeight: 1.6 }}>
              Looks like you haven't added anything yet. Discover our latest arrivals, smart home deals, and premium products!
            </p>
            <Link to="/shop" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, var(--blue), var(--red))',
              color: '#fff',
              padding: '14px 28px',
              borderRadius: 'var(--r-md)',
              fontWeight: 800,
              fontSize: '14px',
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(208,2,27,0.3)',
              transition: 'transform 0.15s ease'
            }}>
              Start Shopping <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          /* Cart 2-Col Layout */
          <div className="cart-page-layout">

            {/* LEFT: Cart Items */}
            <div className="cart-items-col">
              {/* Desktop Column Header */}
              <div className="cart-table-head">
                <span>Item</span>
                <span>Description</span>
                <span style={{ textAlign: 'center' }}>Quantity</span>
                <span style={{ textAlign: 'right' }}>Total</span>
                <span style={{ textAlign: 'right' }}>Action</span>
              </div>

              {items.map(item => (
                <div key={item.id} className="cart-item-card">
                  {/* Image */}
                  <Link to={`/product/${item.id}`} className="cart-item-img">
                    <img
                      src={item.imgUrl || item.image || (item.images && item.images[0]) || '/placeholder.jpg'}
                      alt={item.name}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  </Link>

                  {/* Info */}
                  <div className="cart-item-details">
                    {item.brand && <span className="cart-item-brand">{item.brand}</span>}
                    <Link to={`/product/${item.id}`} className="cart-item-name">{item.name}</Link>
                    <span className="cart-item-unit-price">{formatCurrency(item.price)} each</span>
                    {(item.requiresSpecialDelivery || (Array.isArray(item.deliveryCriteria) && item.deliveryCriteria.length > 0) || item.customDeliveryNotice) && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--primary)', fontWeight: 700, marginTop: '3px' }}>
                        <AlertTriangle size={11} /> Surcharge Item
                      </span>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="cart-item-qty-col">
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => updateQty(item.id, -1)} aria-label="Decrease quantity">
                        <Minus size={13} />
                      </button>
                      <span className="qty-val">{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.id, 1)} aria-label="Increase quantity">
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="cart-item-price-col">
                    <div className="cart-item-price">{formatCurrency(item.price * parseInt(item.qty || 1, 10))}</div>
                  </div>

                  {/* Remove */}
                  <div className="cart-item-remove-col">
                    <button
                      className="cart-item-remove-btn"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={14} />
                      <span className="cart-item-remove-label">Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: Order Summary */}
            <div className="cart-summary-col">
              <div className="cart-summary-box">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
                  <h3 style={{ fontFamily: 'var(--font2)', fontSize: '18px', fontWeight: 900, color: 'var(--text-h)', margin: 0 }}>
                    Order Summary
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-m)', fontWeight: 600 }}>{items.length} {items.length === 1 ? 'item' : 'items'}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginBottom: '16px' }}>
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span style={{ color: 'var(--text-h)', fontWeight: 700 }}>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="summary-row">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Delivery
                      {hasSpecialDelivery && (
                        <button
                          type="button"
                          onClick={() => setShowDeliveryPopup(true)}
                          style={{
                            background: 'rgba(255,94,0,0.15)',
                            border: '1px solid var(--primary)',
                            color: 'var(--primary)',
                            borderRadius: '12px',
                            padding: '1px 8px',
                            fontSize: '11px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}
                        >
                          <AlertTriangle size={11} /> Surcharge Notice
                        </button>
                      )}
                    </span>
                    <span style={{ color: 'var(--text-h)', fontWeight: 700 }}>
                      {formatCurrency(shipping)}
                    </span>
                  </div>
                </div>

                {hasSpecialDelivery && (
                  <div
                    onClick={() => setShowDeliveryPopup(true)}
                    style={{
                      background: 'rgba(255,94,0,0.08)',
                      border: '1px solid rgba(255,94,0,0.3)',
                      borderRadius: 'var(--r-sm)',
                      padding: '10px 12px',
                      marginBottom: '16px',
                      fontSize: '12px',
                      color: 'var(--primary)',
                      display: 'flex',
                      gap: '8px',
                      alignItems: 'flex-start',
                      cursor: 'pointer'
                    }}
                  >
                    <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ lineHeight: 1.4 }}>
                      <strong>Notice:</strong> One or more items in your cart may incur extra delivery charges.{' '}
                      <span style={{ textDecoration: 'underline', fontWeight: 700 }}>View Details</span>
                    </div>
                  </div>
                )}

                {/* Coupon */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <div style={{
                    flex: 1, display: 'flex', alignItems: 'center', gap: '8px',
                    background: 'var(--surface2)', border: '1px solid var(--border)',
                    borderRadius: 'var(--r-sm)', padding: '0 12px', minWidth: 0
                  }}>
                    <Tag size={13} color="var(--text-m)" style={{ flexShrink: 0 }} />
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={coupon}
                      onChange={e => setCoupon(e.target.value)}
                      style={{ background: 'none', color: 'var(--text-h)', fontSize: '13px', border: 'none', flex: 1, padding: '10px 0', minWidth: 0, outline: 'none', width: '100%' }}
                    />
                  </div>
                  <button style={{
                    padding: '0 14px', background: 'var(--surface2)', border: '1.5px solid var(--border)',
                    borderRadius: 'var(--r-sm)', fontWeight: 700, fontSize: '13px', color: 'var(--text-h)',
                    cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0
                  }}>Apply</button>
                </div>

                {/* Total */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  padding: '16px 0', borderTop: '1px solid var(--border)', marginBottom: '16px'
                }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font2)', fontSize: '16px', fontWeight: 900, color: 'var(--text-h)', display: 'block' }}>Total</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-m)' }}>Including VAT</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font2)', fontSize: '22px', fontWeight: 900, color: 'var(--red)' }}>{formatCurrency(total)}</span>
                </div>

                <Link to="/checkout" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  background: 'linear-gradient(135deg, var(--blue), var(--red))',
                  color: '#fff', padding: '15px', borderRadius: 'var(--r-md)',
                  fontWeight: 800, fontSize: '14.5px', textDecoration: 'none',
                  marginBottom: '16px', boxShadow: '0 4px 16px rgba(208,2,27,0.3)',
                  transition: 'transform 0.15s, box-shadow 0.15s'
                }}>
                  Proceed to Checkout <ArrowRight size={16} />
                </Link>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-m)' }}>
                    <ShieldCheck size={14} color="var(--green)" /> 100% Secure Checkout Guarantee
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-m)' }}>
                    <Truck size={14} color="var(--blue-md)" /> Fast Delivery within Port Harcourt
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Special Delivery Notice Popup Modal */}
      {showDeliveryPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(5px)' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '28px', width: '100%', maxWidth: '520px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.6)', position: 'relative' }}>
            <button
              onClick={() => setShowDeliveryPopup(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text-h)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={16} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(255,94,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                <Truck size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'var(--font2)', fontSize: '18px', fontWeight: 900, color: 'var(--text-h)' }}>
                  Special Delivery Surcharge Notice
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-m)' }}>Base Delivery Fee: {formatCurrency(shipping)}</span>
              </div>
            </div>

            <div style={{ background: 'rgba(255,94,0,0.08)', border: '1px solid rgba(255,94,0,0.3)', borderRadius: 'var(--r-sm)', padding: '16px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <AlertTriangle size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-h)', lineHeight: 1.5, fontWeight: 600 }}>
                  "{deliveryNoticeTemplate}"
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <h4 style={{ margin: '0 0 10px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-m)' }}>
                Item(s) with Special Delivery Criteria:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {specialDeliveryItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '6px', padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '4px', overflow: 'hidden', background: '#000', flexShrink: 0 }}>
                        <img src={item.imgUrl || item.image || item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-h)' }}>{item.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-m)' }}>Qty: {item.qty}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {(item.deliveryCriteria && item.deliveryCriteria.length > 0 ? item.deliveryCriteria : ['Special Handling']).map(c => (
                        <span key={c} style={{ fontSize: '10px', fontWeight: 800, background: 'rgba(255,94,0,0.15)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '10px', textTransform: 'capitalize' }}>
                          {c === 'sizing' ? '📏 Oversized' : c === 'weight' ? '⚖️ Heavy' : c === 'fragile' ? '🛡️ Fragile' : c}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '12px 14px', marginBottom: '22px', fontSize: '12px', color: 'var(--text-m)', lineHeight: 1.6 }}>
              ℹ️ <strong>Logistics Notice:</strong> Standard delivery fee is <strong>{formatCurrency(shipping)}</strong>. For items that require special transport equipment, crate handling, or 2-man lifting, our dispatch supervisor will contact you to coordinate delivery arrangements.
            </div>

            <button
              onClick={() => setShowDeliveryPopup(false)}
              style={{ width: '100%', padding: '14px', background: 'var(--primary)', color: 'var(--black)', border: 'none', borderRadius: 'var(--r-sm)', fontWeight: 800, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 16px var(--primary-glow)' }}
            >
              I Understand &amp; Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
