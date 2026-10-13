import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, MapPin, Truck, ShieldCheck, ChevronRight, CheckCircle, Zap, Upload, AlertCircle, Loader2, X, AlertTriangle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from './Home';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { uploadImage } from '../utils/cloudinaryService';

const steps = ['Delivery', 'Payment', 'Review'];

const INSTALLMENT_OPTIONS = [
  ...Array.from({ length: 11 }, (_, i) => ({
    id: `${i + 2}_weeks`,
    label: `${i + 2} Weeks`,
    type: 'weekly',
    duration: i + 2,
    interestRate: (i + 2) * 0.015 // 1.5% per week
  })),
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `${i + 2}_months`,
    label: `${i + 2} Months`,
    type: 'monthly',
    duration: i + 2,
    interestRate: (i + 2) * 0.05 // 5% per month
  }))
];

export default function Checkout() {
  const { user, authLoading, cart, cartTotal, clearCart, showToast } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [placed, setPlaced] = useState(false);
  const [finalTotal, setFinalTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({ 
    fullName: user?.firstName ? `${user.firstName} ${user.lastName || ''}` : '', 
    phone: user?.phone || '', 
    address: '', 
    city: 'Port Harcourt', 
    state: 'Rivers State', 
    payMethod: 'bank_transfer',
    installmentPlan: '4_weeks'
  });

  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [activeLegal, setActiveLegal] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState({ terms: false, privacy: false });

  const DEFAULT_DELIVERY_NOTICE = "This item may incur additional delivery charges due to its size, weight, or fragility.";
  const [deliveryFee, setDeliveryFee] = useState(7000);
  const [deliveryNoticeTemplate, setDeliveryNoticeTemplate] = useState(DEFAULT_DELIVERY_NOTICE);
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
      } catch (err) {
        console.error("Error loading delivery settings", err);
      }
    };
    fetchSettings();
  }, []);

  const delivery = deliveryFee;
  const subTotal = cartTotal + delivery;

  // Check if any cart item has special delivery criteria
  const specialDeliveryItems = cart.filter(item =>
    item.requiresSpecialDelivery ||
    (Array.isArray(item.deliveryCriteria) && item.deliveryCriteria.length > 0) ||
    item.customDeliveryNotice
  );
  const hasSpecialDelivery = specialDeliveryItems.length > 0;

  const activePlan = INSTALLMENT_OPTIONS.find(p => p.id === formData.installmentPlan) || INSTALLMENT_OPTIONS[0];
  const installmentInterest = formData.payMethod === 'installment' ? Math.floor(subTotal * activePlan.interestRate) : 0;
  const grandTotal = subTotal + installmentInterest;
  const depositAmount = formData.payMethod === 'installment' ? Math.floor(grandTotal * 0.30) : grandTotal;
  const recurringAmount = formData.payMethod === 'installment' ? Math.floor((grandTotal - depositAmount) / activePlan.duration) : 0;

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        showToast('Please log in to proceed to checkout.', 'error');
        navigate('/login?redirect=/checkout');
      } else if (cart.length === 0 && !placed) {
        navigate('/cart');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, cart, navigate, placed]);

  const handleReceiptChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setReceiptPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePlaceOrderClick = () => {
    if ((formData.payMethod === 'bank_transfer' || formData.payMethod === 'installment') && !receiptFile) {
      setError('Please upload your payment receipt before placing the order.');
      return;
    }
    if (!termsAccepted.terms || !termsAccepted.privacy) {
      setError('Please read and accept both the Terms & Conditions and Privacy Policy.');
      return;
    }
    setError('');
    submitOrder();
  };

  const submitOrder = async () => {
    setLoading(true);
    setError('');

    try {
      let receiptUrl = '';
      if (receiptFile) {
        receiptUrl = await uploadImage(receiptFile);
      }

      const orderData = {
        userId: user?.uid || 'guest',
        customerName: formData.fullName,
        customerPhone: formData.phone,
        customerEmail: user?.email || '',
        deliveryAddress: `${formData.address}, ${formData.city}, ${formData.state}`,
        items: cart,
        total: grandTotal,
        subTotal: subTotal,
        deliveryFee: delivery,
        hasSpecialDeliveryItems: hasSpecialDelivery,
        specialDeliveryNotice: hasSpecialDelivery ? deliveryNoticeTemplate : null,
        specialDeliveryCriteria: hasSpecialDelivery ? specialDeliveryItems.flatMap(i => i.deliveryCriteria || []) : [],
        installmentInterest,
        payMethod: formData.payMethod,
        installmentPlan: formData.payMethod === 'installment' ? formData.installmentPlan : null,
        depositAmount: formData.payMethod === 'installment' ? depositAmount : null,
        recurringAmount: formData.payMethod === 'installment' ? recurringAmount : null,
        installmentsTotal: formData.payMethod === 'installment' ? activePlan.duration : null,
        installmentInterval: formData.payMethod === 'installment' ? activePlan.type : null,
        installmentsPaid: formData.payMethod === 'installment' ? 1 : null,
        installmentReceipts: formData.payMethod === 'installment' ? [] : null,
        status: 'Pending Verification',
        initialPaymentStatus: 'Pending',
        receiptUrl: receiptUrl,
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'orders'), orderData);
      
      setFinalTotal(grandTotal);
      clearCart();
      setPlaced(true);
    } catch (err) {
      console.error(err);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--text-h)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontSize: '14px' };

  if (authLoading || (!user && !placed)) {
    return (
      <main className="main-content" style={{ padding: '28px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Loader2 className="spinner" size={32} color="var(--primary)" />
      </main>
    );
  }

  if (cart.length === 0 && !placed) return null;

  return (
    <main className="main-content" style={{ padding: '28px 20px' }}>
      {placed ? (
        <div style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center' }}>
          <div style={{ width: '100px', height: '100px', background: 'rgba(0,230,118,0.1)', border: '3px solid var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <CheckCircle size={52} color="var(--success)" strokeWidth={1.5} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 900, color: 'var(--success)', marginBottom: '12px' }}>Order Placed!</h1>
          <p style={{ color: 'var(--text-m)', fontSize: '16px', marginBottom: '8px' }}>Thank you for your purchase. We are currently verifying your payment receipt.</p>
          <p style={{ color: 'var(--text-m)', fontSize: '14px', marginBottom: '24px' }}>You will receive an email notification once your order is confirmed and processing.</p>
          <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '20px', marginBottom: '32px' }}>Order Total: {formatCurrency(finalTotal)}</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/profile" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--primary)', color: '#fff', padding: '14px 28px', borderRadius: 'var(--radius-md)', fontWeight: 800 }}>Track Order <ChevronRight size={16} /></Link>
            <Link to="/shop" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--text-h)', padding: '14px 28px', borderRadius: 'var(--radius-md)', fontWeight: 700 }}>Continue Shopping</Link>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, marginBottom: '28px' }}>Checkout</h1>

          {/* Step Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', gap: '0' }}>
            {steps.map((s, i) => (
              <React.Fragment key={s}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '14px', background: i <= step ? 'var(--primary)' : 'var(--surface2)', color: i <= step ? '#fff' : 'var(--text-m)', border: `2px solid ${i <= step ? 'var(--primary)' : 'var(--border)'}`, transition: 'var(--transition)' }}>{i < step ? '✓' : i + 1}</div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: i === step ? 'var(--primary)' : 'var(--text-m)' }}>{s}</span>
                </div>
                {i < steps.length - 1 && <div style={{ flex: 1, height: '2px', background: i < step ? 'var(--primary)' : 'var(--border)', margin: '0 8px', marginBottom: '20px', transition: 'var(--transition)' }}></div>}
              </React.Fragment>
            ))}
          </div>

          <div className="cart-grid" style={{ gridTemplateColumns: '1fr 360px', alignItems: 'start' }}>
            {/* Steps Content */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px' }}>
              {step === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}><MapPin size={20} color="var(--primary)" /> Delivery Details</h3>

                  {/* Port Harcourt Only Notice */}
                  <div style={{ background: 'rgba(255,206,30,0.08)', border: '1px solid rgba(255,206,30,0.3)', borderRadius: 'var(--radius-sm)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 700 }}>Delivery is currently available within Port Harcourt, Rivers State only.</span>
                  </div>

                  {[['Full Name', 'fullName', 'text', 'e.g., Hassan Doe'], ['Phone', 'phone', 'tel', 'e.g., +234 800 000 0000'], ['Delivery Address', 'address', 'text', 'e.g., 5 Ada George Road, Rumuola']].map(([label, key, type, placeholder]) => (
                    <div key={key}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-m)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>{label}</label>
                      <input type={type} placeholder={placeholder} value={formData[key]} onChange={e => setFormData(p => ({ ...p, [key]: e.target.value }))} style={inputStyle} onFocus={e => e.target.style.borderColor='var(--primary)'} onBlur={e => e.target.style.borderColor='var(--border)'} required />
                    </div>
                  ))}

                  {/* Locked City & State */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-m)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>City</label>
                      <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.9 }}>
                        <span>Port Harcourt</span>
                        <span style={{ fontSize: '10px', background: 'var(--primary)', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>LOCKED</span>
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-m)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>State</label>
                      <div style={{ ...inputStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: 0.9 }}>
                        <span>Rivers State</span>
                        <span style={{ fontSize: '10px', background: 'var(--primary)', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>LOCKED</span>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => {
                    if (!formData.fullName || !formData.phone || !formData.address) {
                      setError('Please fill in all delivery details.');
                      return;
                    }
                    setError('');
                    setStep(1);
                  }} style={{ background: 'var(--primary)', color: '#fff', padding: '14px', borderRadius: 'var(--radius-md)', fontWeight: 800, fontSize: '15px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px' }}>Continue to Payment <ChevronRight size={18} /></button>
                  {error && <p style={{ color: 'var(--danger)', fontSize: '13px', marginTop: '-10px', textAlign: 'center' }}>{error}</p>}
                </div>
              )}

              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}><Building2 size={20} color="var(--primary)" /> Payment Method</h3>
                  {[
                    { id: 'bank_transfer', label: 'Direct Bank Transfer', icon: Building2, desc: 'Pay directly to our Sterling Bank corporate account' },
                    { id: 'installment', label: 'Installment Payment', icon: Truck, desc: 'Pay in structured installments (30% down payment)' },
                    ...(user?.isAdmin ? [{ id: 'admin_cash', label: 'Admin POS / Cash', icon: Zap, desc: 'Direct order placement (Admin only)' }] : []),
                  ].map(method => (
                    <div 
                      key={method.id} 
                      onClick={() => !method.disabled && setFormData(p => ({ ...p, payMethod: method.id }))} 
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', 
                        border: `2px solid ${formData.payMethod === method.id ? 'var(--primary)' : 'var(--border)'}`, 
                        borderRadius: 'var(--radius-md)', 
                        cursor: method.disabled ? 'not-allowed' : 'pointer', 
                        background: formData.payMethod === method.id ? 'rgba(208,2,27,0.05)' : 'var(--surface)', 
                        opacity: method.disabled ? 0.5 : 1,
                        transition: 'var(--transition)' 
                      }}
                    >
                      <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(208,2,27,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <method.icon size={20} color="var(--primary)" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {method.label}
                          {method.disabled && <span style={{ fontSize: '10px', background: 'var(--danger)', color: '#fff', padding: '2px 6px', borderRadius: '10px' }}>Soon</span>}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-m)' }}>{method.desc}</div>
                      </div>
                      <div style={{ marginLeft: 'auto', width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${formData.payMethod === method.id ? 'var(--primary)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {formData.payMethod === method.id && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }}></div>}
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                    <button onClick={() => setStep(0)} style={{ flex: 1, background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--text-h)', padding: '14px', borderRadius: 'var(--radius-md)', fontWeight: 700, cursor: 'pointer' }}>Back</button>
                    <button onClick={() => setStep(2)} style={{ flex: 2, background: 'var(--primary)', color: '#fff', padding: '14px', borderRadius: 'var(--radius-md)', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>Review Order <ChevronRight size={18} /></button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--text-h)' }}>Review & Pay</h3>
                  
                  {formData.payMethod === 'bank_transfer' && (
                    <div style={{ background: 'var(--surface)', border: '1px solid var(--primary)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '8px' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Building2 size={18} /> Bank Account Details
                      </h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-m)', marginBottom: '16px' }}>
                        Please transfer the exact amount of <strong style={{ color: 'var(--text-h)' }}>{formatCurrency(grandTotal)}</strong> to the account below. Your order will not ship until we receive payment.
                      </p>
                      
                      <div style={{ background: 'var(--surface2)', padding: '16px', borderRadius: 'var(--radius-sm)', display: 'grid', gap: '12px', border: '1px solid var(--border)', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-m)', fontSize: '13px' }}>Bank Name</span>
                          <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-h)' }}>Sterling Bank</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-m)', fontSize: '13px' }}>Account Name</span>
                          <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-h)' }}>Smart Choice Global Resources Ltd</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: 'var(--text-m)', fontSize: '13px' }}>Account Number</span>
                          <span style={{ fontWeight: 800, fontSize: '18px', color: 'var(--primary)', letterSpacing: '1px' }}>8682287868</span>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-h)', marginBottom: '8px' }}>Upload Payment Receipt <span style={{ color: 'var(--danger)' }}>*</span></label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <label style={{ flex: 1, background: 'var(--surface2)', border: '1.5px dashed var(--border)', padding: '16px', borderRadius: 'var(--radius-sm)', textAlign: 'center', cursor: 'pointer', transition: 'var(--transition)' }}>
                            <Upload size={20} color="var(--primary)" style={{ margin: '0 auto 8px' }} />
                            <span style={{ fontSize: '13px', color: 'var(--text-m)' }}>Click to upload screenshot</span>
                            <input type="file" accept="image/*" onChange={handleReceiptChange} style={{ display: 'none' }} />
                          </label>
                          {receiptPreview && (
                            <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                              <img src={receiptPreview} alt="Receipt preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.payMethod === 'installment' && (
                    <div style={{ background: 'var(--surface)', border: '1px solid var(--primary)', borderRadius: 'var(--radius-md)', padding: '20px', marginBottom: '8px' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Truck size={18} /> Installment Plan Details
                      </h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-m)', marginBottom: '16px' }}>
                        Choose a payment plan that works for you. 30% Down payment.
                      </p>

                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-h)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Select Duration</label>
                        <select 
                          value={formData.installmentPlan}
                          onChange={(e) => setFormData(p => ({ ...p, installmentPlan: e.target.value }))}
                          style={{ width: '100%', background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', fontSize: '14px', color: 'var(--text-h)', outline: 'none' }}
                        >
                          <optgroup label="Weekly Plans (2% interest/week)">
                            {INSTALLMENT_OPTIONS.filter(o => o.type === 'weekly').map(opt => (
                              <option key={opt.id} value={opt.id}>{opt.label} ({(opt.interestRate * 100).toFixed(0)}% Interest)</option>
                            ))}
                          </optgroup>
                          <optgroup label="Monthly Plans (5% interest/month)">
                            {INSTALLMENT_OPTIONS.filter(o => o.type === 'monthly').map(opt => (
                              <option key={opt.id} value={opt.id}>{opt.label} ({(opt.interestRate * 100).toFixed(0)}% Interest)</option>
                            ))}
                          </optgroup>
                        </select>
                      </div>
                      
                      <div style={{ background: 'var(--surface2)', padding: '16px', borderRadius: 'var(--radius-sm)', display: 'grid', gap: '12px', border: '1px solid var(--border)', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-m)', fontSize: '13px' }}>Subtotal (inc. Delivery)</span>
                          <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-h)' }}>{formatCurrency(subTotal)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--warning)', fontSize: '13px', fontWeight: 600 }}>Interest ({(activePlan.interestRate * 100).toFixed(0)}%)</span>
                          <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--warning)' }}>+{formatCurrency(installmentInterest)}</span>
                        </div>
                        <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }}></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-h)', fontSize: '14px', fontWeight: 800 }}>Total Payable</span>
                          <span style={{ fontWeight: 800, fontSize: '16px', color: 'var(--primary)' }}>{formatCurrency(grandTotal)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                          <span style={{ color: 'var(--success)', fontSize: '13px', fontWeight: 700 }}>Down Payment (30%)</span>
                          <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--success)' }}>{formatCurrency(depositAmount)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-m)', fontSize: '13px' }}>Remaining ({activePlan.duration} payments)</span>
                          <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-h)' }}>{formatCurrency(recurringAmount)} / {activePlan.type === 'weekly' ? 'week' : 'month'}</span>
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'var(--text-h)', marginBottom: '8px' }}>Upload Initial Down Payment Receipt <span style={{ color: 'var(--danger)' }}>*</span></label>
                        <p style={{ fontSize: '12px', color: 'var(--text-m)', marginBottom: '12px' }}>Please transfer your down payment of <strong style={{ color: 'var(--text-h)' }}>{formatCurrency(depositAmount)}</strong> to Sterling Bank (8682287868) — Smart Choice Global Resources Ltd.</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <label style={{ flex: 1, background: 'var(--surface2)', border: '1.5px dashed var(--border)', padding: '16px', borderRadius: 'var(--radius-sm)', textAlign: 'center', cursor: 'pointer', transition: 'var(--transition)' }}>
                            <Upload size={20} color="var(--primary)" style={{ margin: '0 auto 8px' }} />
                            <span style={{ fontSize: '13px', color: 'var(--text-m)' }}>Click to upload screenshot</span>
                            <input type="file" accept="image/*" onChange={handleReceiptChange} style={{ display: 'none' }} />
                          </label>
                          {receiptPreview && (
                            <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                              <img src={receiptPreview} alt="Receipt preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Terms Checkboxes */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px', marginBottom: '16px' }}>
                    {/* Terms */}
                    <div onClick={() => !termsAccepted.terms && setActiveLegal('terms')} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', borderRadius: 'var(--radius-md)', border: termsAccepted.terms ? '2px solid rgba(0,230,118,0.4)' : '1.5px solid var(--border)', background: termsAccepted.terms ? 'rgba(0,230,118,0.08)' : 'var(--surface2)', cursor: termsAccepted.terms ? 'default' : 'pointer', transition: 'var(--transition)' }}>
                      <div style={{ flexShrink: 0, marginTop: '2px', width: '20px', height: '20px', borderRadius: '4px', border: termsAccepted.terms ? '2px solid var(--success)' : '2px solid var(--gray-2)', background: termsAccepted.terms ? 'var(--success)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {termsAccepted.terms && <CheckCircle size={14} color="#fff" strokeWidth={3} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: termsAccepted.terms ? 'var(--success)' : 'var(--text-h)', margin: 0, lineHeight: 1.5 }}>
                          I have read and accept the <span style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }} onClick={e => { e.stopPropagation(); setActiveLegal('terms'); }}>Terms & Conditions</span> including the No-Return & No-Refund policy.
                        </p>
                        {termsAccepted.terms ? (
                          <p style={{ fontSize: '11px', color: 'var(--success)', marginTop: '4px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>✓ Accepted</p>
                        ) : (
                          <p style={{ fontSize: '11px', color: 'var(--text-m)', marginTop: '4px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Click to read & accept</p>
                        )}
                      </div>
                    </div>

                    {/* Privacy */}
                    <div onClick={() => !termsAccepted.privacy && setActiveLegal('privacy')} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', borderRadius: 'var(--radius-md)', border: termsAccepted.privacy ? '2px solid rgba(0,230,118,0.4)' : '1.5px solid var(--border)', background: termsAccepted.privacy ? 'rgba(0,230,118,0.08)' : 'var(--surface2)', cursor: termsAccepted.privacy ? 'default' : 'pointer', transition: 'var(--transition)' }}>
                      <div style={{ flexShrink: 0, marginTop: '2px', width: '20px', height: '20px', borderRadius: '4px', border: termsAccepted.privacy ? '2px solid var(--success)' : '2px solid var(--gray-2)', background: termsAccepted.privacy ? 'var(--success)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {termsAccepted.privacy && <CheckCircle size={14} color="#fff" strokeWidth={3} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: termsAccepted.privacy ? 'var(--success)' : 'var(--text-h)', margin: 0, lineHeight: 1.5 }}>
                          I have read and accept the <span style={{ color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }} onClick={e => { e.stopPropagation(); setActiveLegal('privacy'); }}>Privacy Policy</span> and consent to data processing under Nigerian NDPR.
                        </p>
                        {termsAccepted.privacy ? (
                          <p style={{ fontSize: '11px', color: 'var(--success)', marginTop: '4px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>✓ Accepted</p>
                        ) : (
                          <p style={{ fontSize: '11px', color: 'var(--text-m)', marginTop: '4px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Click to read & accept</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div style={{ background: 'rgba(255,61,0,0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '12px', borderRadius: 'var(--radius-sm)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setStep(1)} disabled={loading} style={{ flex: 1, background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--text-h)', padding: '14px', borderRadius: 'var(--radius-md)', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>Back</button>
                    <button onClick={handlePlaceOrderClick} disabled={loading} style={{ flex: 2, background: 'var(--primary)', color: '#fff', padding: '14px', borderRadius: 'var(--radius-md)', fontWeight: 800, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 24px var(--primary-glow)' }}>
                      {loading ? <><Loader2 className="spinner" size={18} /> Processing...</> : <><Zap size={18} /> Place Order — {formatCurrency(formData.payMethod === 'installment' ? depositAmount : grandTotal)}</>}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', position: 'sticky', top: '90px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 800, color: 'var(--text-h)', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>Order Summary</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto', marginBottom: '16px' }}>
                {cart.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
                    <div style={{ width: '48px', height: '48px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={item.imgUrl || item.image || item.img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-h)', marginBottom: '2px', lineHeight: 1.3 }}>{item.name}</div>
                      <div style={{ color: 'var(--text-m)', fontSize: '11px' }}>Qty: {item.qty}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--text-h)' }}>{formatCurrency(item.price * item.qty)}</div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-m)' }}><span>Subtotal</span><span style={{ color: 'var(--text-h)', fontWeight: 600 }}>{formatCurrency(cartTotal)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: 'var(--text-m)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Delivery</span>
                    {hasSpecialDelivery && (
                      <button
                        type="button"
                        onClick={() => setShowDeliveryPopup(true)}
                        style={{
                          background: 'rgba(255,94,0,0.15)',
                          border: '1px solid var(--primary)',
                          color: 'var(--primary)',
                          borderRadius: '12px',
                          padding: '2px 8px',
                          fontSize: '11px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        title="Click to view special delivery notice"
                      >
                        <AlertTriangle size={11} /> Surcharge Notice
                      </button>
                    )}
                  </div>
                  <span style={{ color: 'var(--text-h)', fontWeight: 600 }}>{formatCurrency(delivery)}</span>
                </div>

                {hasSpecialDelivery && (
                  <div
                    onClick={() => setShowDeliveryPopup(true)}
                    style={{
                      background: 'rgba(255,94,0,0.08)',
                      border: '1px solid rgba(255,94,0,0.3)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '8px 10px',
                      fontSize: '11.5px',
                      color: 'var(--primary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ lineHeight: 1.4 }}>
                      <strong>Notice:</strong> One or more items in your cart may incur additional delivery charges.{' '}
                      <span style={{ textDecoration: 'underline', fontWeight: 700 }}>Click for details</span>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 800, paddingTop: '12px', borderTop: '1px solid var(--border)', marginTop: '4px' }}><span style={{ color: 'var(--text-h)' }}>Total</span><span style={{ color: 'var(--primary)' }}>{formatCurrency(grandTotal)}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legal Modal */}
      {activeLegal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '32px', width: '100%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 40px rgba(0,0,0,0.25)', position: 'relative' }}>
            <button onClick={() => setActiveLegal(null)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text-h)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={16} />
            </button>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 800, marginBottom: '20px', color: 'var(--text-h)' }}>
              {activeLegal === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
            </h3>
            <div style={{ color: 'var(--text-b)', fontSize: '14px', lineHeight: 1.6, marginBottom: '32px' }}>
              {activeLegal === 'terms' ? (
                <>
                  <p style={{ marginBottom: '16px' }}>By proceeding, you agree to Smart Choice Electronics' terms of service. All purchases are final once delivered and verified in good condition.</p>
                  <h4 style={{ color: 'var(--text-h)', fontWeight: 700, marginBottom: '8px' }}>Strict No-Return &amp; No-Refund Policy</h4>
                  <p>Please note that Smart Choice Global Resources Ltd operates a strict No-Return and No-Refund policy. Once an item is purchased and collected or delivered, it cannot be returned for a refund or exchanged unless it is Dead On Arrival (DOA) and verified by our certified technicians within 24 hours of delivery.</p>
                </>
              ) : (
                <>
                  <p style={{ marginBottom: '16px' }}>We value your privacy and are committed to safeguarding your personal data in full compliance with the <strong>Nigeria Data Protection Regulation (NDPR)</strong> and the <strong>Nigeria Data Protection Act (NDPA)</strong>.</p>
                  <h4 style={{ color: 'var(--text-h)', fontWeight: 700, marginBottom: '8px' }}>NDPR / NDPA Data Protection Consent</h4>
                  <p style={{ marginBottom: '12px' }}>By accepting this policy, you consent to Smart Choice Global Resources Ltd collecting, storing, and processing your personal data (name, phone number, delivery address, and payment confirmation) exclusively for order fulfillment, fraud prevention, and necessary logistics communication.</p>
                  <p>Your data is processed securely, never sold or leased to third-party advertisers, and retained strictly in accordance with Nigerian data protection statutory standards.</p>
                </>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => {
                  if (activeLegal === 'terms') setTermsAccepted(p => ({...p, terms: true}));
                  if (activeLegal === 'privacy') setTermsAccepted(p => ({...p, privacy: true}));
                  setActiveLegal(null);
                }} 
                style={{ width: '100%', padding: '14px', background: 'var(--primary)', border: 'none', borderRadius: 'var(--radius-md)', color: '#fff', fontWeight: 800, cursor: 'pointer', transition: 'var(--transition)', boxShadow: '0 8px 24px var(--primary-glow)' }}
              >
                I Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Special Delivery Notice Popup Modal */}
      {showDeliveryPopup && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(5px)' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px', width: '100%', maxWidth: '520px', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', position: 'relative' }}>
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
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 800, color: 'var(--text-h)' }}>
                  Special Delivery Surcharge Notice
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-m)' }}>Base Delivery Fee: {formatCurrency(delivery)}</span>
              </div>
            </div>

            <div style={{ background: 'rgba(255,94,0,0.08)', border: '1px solid rgba(255,94,0,0.3)', borderRadius: 'var(--radius-sm)', padding: '16px', marginBottom: '18px' }}>
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
                      <div style={{ width: '36px', height: '36px', borderRadius: '4px', overflow: 'hidden', background: 'var(--surface)', border: '1px solid var(--border)', flexShrink: 0 }}>
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

            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', marginBottom: '22px', fontSize: '12px', color: 'var(--text-m)', lineHeight: 1.6 }}>
              ℹ️ <strong style={{ color: 'var(--text-h)' }}>Logistics Policy:</strong> Your checkout includes our base city delivery fee of <strong>{formatCurrency(delivery)}</strong>. For items with heavy weight, large cubic dimensions, or fragile handling requirements, our logistics team may coordinate specialized freight or haulage arrangements upon confirming your order.
            </div>

            <button
              onClick={() => setShowDeliveryPopup(false)}
              style={{ width: '100%', padding: '14px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 800, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 16px var(--primary-glow)' }}
            >
              I Understand &amp; Continue
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
