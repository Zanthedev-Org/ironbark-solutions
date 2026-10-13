import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, ShieldCheck, Lock, CheckCircle, Loader2, X, Mail, ArrowRight, AlertTriangle } from 'lucide-react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function Register() {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', phone: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState('');

  // Legal Modal State (terms | privacy | null)
  const [activeLegalModal, setActiveLegalModal] = useState(null);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const legalScrollRef = useRef(null);
  
  const navigate = useNavigate();

  // Reset scroll detection when legal modal opens
  useEffect(() => {
    if (activeLegalModal) {
      setScrolledToBottom(false);
      // If content is already fully visible on large viewport, enable immediately
      setTimeout(() => {
        if (legalScrollRef.current) {
          const el = legalScrollRef.current;
          if (el.scrollHeight <= el.clientHeight + 15) {
            setScrolledToBottom(true);
          }
        }
      }, 100);
    }
  }, [activeLegalModal]);

  const handleLegalScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 25) {
      setScrolledToBottom(true);
    }
  };

  const handleAcceptLegal = () => {
    if (activeLegalModal === 'terms') setAgreedTerms(true);
    if (activeLegalModal === 'privacy') setAgreedPrivacy(true);
    setActiveLegalModal(null);
  };

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === 'phone') value = value.replace(/\D/g, '');
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) { 
      setError('Passwords do not match.'); 
      return; 
    }
    
    if (!agreedTerms || !agreedPrivacy) { 
      setError('Please review and accept both the Terms & Conditions and Privacy Policy.'); 
      return; 
    }
    
    setLoading(true);
    try {
      // 1. Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;
      setRegisteredUser(user);

      // 2. Save user profile to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        isAdmin: false,
        emailVerified: false,
        createdAt: new Date().toISOString()
      });

      // 3. Send verification email via Firebase
      await sendEmailVerification(user);

      setSuccess(true);
      // NOTE: Removed rushed 3-second auto-redirect so customer has ample time to read!

    } catch (err) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please sign in.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak. Please use at least 6 characters.');
      } else {
        setError(err.message || 'An error occurred during registration.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendFromSuccess = async () => {
    const target = registeredUser || auth.currentUser;
    if (!target) return;
    setIsResending(true);
    setResendStatus('');
    try {
      await sendEmailVerification(target);
      setResendStatus('Verification email sent! Please check your inbox & spam folder.');
    } catch (err) {
      if (err.code === 'auth/too-many-requests') {
        setResendStatus('Please wait a moment before requesting another email.');
      } else {
        setResendStatus(err.message || 'Failed to send email. Please try signing in.');
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card" style={{ maxWidth: '520px' }}>

        <div className="auth-logo" style={{ flexDirection: 'column', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '44px', height: '44px', background: '#fff', borderRadius: '8px', overflow: 'hidden', padding: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--sh-sm)' }}>
              <img src="/smartchoice-logo.jpeg" alt="Smart Choice" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px' }}>
              <span style={{ color: 'var(--red)' }}>Smart</span><span style={{ color: '#2257C5' }}>Choice</span>
            </div>
          </Link>
          <p style={{ color: 'var(--text-m)', fontSize: '13px', marginTop: '10px' }}>Create your account</p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ width: '76px', height: '76px', borderRadius: '50%', background: 'rgba(10,122,50,0.1)', border: '2.5px solid var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              <CheckCircle size={44} color="var(--green)" strokeWidth={2} />
            </div>
            <h3 style={{ fontFamily: 'var(--font2)', fontSize: '22px', fontWeight: 900, color: 'var(--text-h)', marginBottom: '8px' }}>
              Account Created Successfully!
            </h3>
            
            <p style={{ color: 'var(--text-m)', marginBottom: '14px', fontSize: '14px', lineHeight: 1.6 }}>
              A verification link has been sent to:<br />
              <strong style={{ color: 'var(--text-h)', fontSize: '15px' }}>{formData.email}</strong>
            </p>

            <div style={{ background: 'rgba(255,152,0,0.08)', border: '1px solid rgba(255,152,0,0.3)', borderRadius: 'var(--r-md)', padding: '14px 16px', marginBottom: '22px', textAlign: 'left', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <AlertTriangle size={18} color="#FF9800" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '12.5px', color: 'var(--text-h)', lineHeight: 1.5 }}>
                <strong>Important:</strong> Please check your inbox (and your spam / junk folder) and click the link to verify your account before logging in.
              </div>
            </div>

            {resendStatus && (
              <p style={{ fontSize: '12.5px', color: resendStatus.includes('sent') ? 'var(--green)' : 'var(--red)', fontWeight: 700, marginBottom: '14px' }}>
                {resendStatus}
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                type="button" 
                onClick={() => navigate('/login')} 
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, var(--blue), var(--red))',
                  color: '#fff',
                  padding: '14px',
                  borderRadius: 'var(--r-md)',
                  fontWeight: 800,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(208,2,27,0.3)'
                }}
              >
                Proceed to Sign In <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={handleResendFromSuccess}
                disabled={isResending}
                style={{
                  width: '100%',
                  background: 'var(--surface2)',
                  border: '1.5px solid var(--border)',
                  color: 'var(--text-h)',
                  padding: '12px',
                  borderRadius: 'var(--r-md)',
                  fontWeight: 700,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: isResending ? 'not-allowed' : 'pointer'
                }}
              >
                {isResending ? <Loader2 size={14} className="spinner" /> : <Mail size={14} />}
                Didn't get the email? Resend link
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister}>
            {error && <div style={{ background: 'rgba(208,2,27,0.1)', border: '1px solid var(--red)', color: 'var(--red)', fontSize: '13px', padding: '12px 16px', borderRadius: 'var(--r-sm)', marginBottom: '20px' }}>{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input type="text" className="form-input" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="Hassan" />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input type="text" className="form-input" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Doe" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div style={{ display: 'flex' }}>
                <span style={{ display: 'flex', alignItems: 'center', padding: '0 14px', background: 'var(--surface2)', border: '1.5px solid var(--border)', borderRight: 'none', borderRadius: 'var(--r-sm) 0 0 var(--r-sm)', fontSize: '14px', fontWeight: 700, color: 'var(--text-h)', whiteSpace: 'nowrap' }}>+234</span>
                <input type="tel" className="form-input" name="phone" value={formData.phone} onChange={handleChange} required placeholder="800 000 0000" maxLength="11" style={{ borderRadius: '0 var(--r-sm) var(--r-sm) 0' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} className="form-input" name="password" value={formData.password} onChange={handleChange} required minLength="6" placeholder="Create a strong password" style={{ paddingRight: '40px' }} />
                <button type="button" onClick={() => setShowPassword(v => !v)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-m)', background: 'none', border: 'none', cursor: 'pointer' }}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showConfirm ? 'text' : 'password'} className="form-input" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Repeat your password" style={{ paddingRight: '40px' }} />
                <button type="button" onClick={() => setShowConfirm(v => !v)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-m)', background: 'none', border: 'none', cursor: 'pointer' }}>{showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && <p style={{ color: 'var(--red)', fontSize: '12px', marginTop: '6px' }}>✗ Passwords do not match</p>}
              {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password.length >= 6 && <p style={{ color: 'var(--green)', fontSize: '12px', marginTop: '6px' }}>✓ Passwords match</p>}
            </div>

            {/* Legal Agreements — Opens Compliance Modal with Scroll-to-Bottom */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {/* Terms */}
              <div 
                onClick={() => {
                  if (!agreedTerms) {
                    setActiveLegalModal('terms');
                  } else {
                    setAgreedTerms(false);
                  }
                }} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '12px', 
                  padding: '14px 16px', 
                  border: `1.5px solid ${agreedTerms ? 'var(--green)' : 'var(--border)'}`, 
                  borderRadius: 'var(--r-sm)', 
                  background: agreedTerms ? 'rgba(10,122,50,0.05)' : 'var(--surface2)', 
                  cursor: 'pointer', 
                  transition: 'var(--ease)' 
                }}
              >
                <div style={{ width: '20px', height: '20px', borderRadius: '6px', border: `2px solid ${agreedTerms ? 'var(--green)' : 'var(--border)'}`, background: agreedTerms ? 'var(--green)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px', transition: 'var(--ease)' }}>
                  {agreedTerms && <span style={{ color: '#fff', fontSize: '12px', fontWeight: 900 }}>✓</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-h)', lineHeight: 1.5, margin: 0 }}>
                    I have read and accept the <span style={{ color: 'var(--red)', fontWeight: 700, textDecoration: 'underline' }}>Terms &amp; Conditions</span> including the No-Return &amp; No-Refund policy.
                  </p>
                  {agreedTerms ? (
                    <span style={{ display: 'block', color: 'var(--green)', fontSize: '11px', fontWeight: 800, marginTop: '3px', textTransform: 'uppercase' }}>✓ Accepted</span>
                  ) : (
                    <span style={{ display: 'block', color: 'var(--primary)', fontSize: '11px', fontWeight: 700, marginTop: '3px' }}>Click to read &amp; accept</span>
                  )}
                </div>
              </div>

              {/* Privacy */}
              <div 
                onClick={() => {
                  if (!agreedPrivacy) {
                    setActiveLegalModal('privacy');
                  } else {
                    setAgreedPrivacy(false);
                  }
                }} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '12px', 
                  padding: '14px 16px', 
                  border: `1.5px solid ${agreedPrivacy ? 'var(--green)' : 'var(--border)'}`, 
                  borderRadius: 'var(--r-sm)', 
                  background: agreedPrivacy ? 'rgba(10,122,50,0.05)' : 'var(--surface2)', 
                  cursor: 'pointer', 
                  transition: 'var(--ease)' 
                }}
              >
                <div style={{ width: '20px', height: '20px', borderRadius: '6px', border: `2px solid ${agreedPrivacy ? 'var(--green)' : 'var(--border)'}`, background: agreedPrivacy ? 'var(--green)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px', transition: 'var(--ease)' }}>
                  {agreedPrivacy && <span style={{ color: '#fff', fontSize: '12px', fontWeight: 900 }}>✓</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-h)', lineHeight: 1.5, margin: 0 }}>
                    I have read and accept the <span style={{ color: 'var(--red)', fontWeight: 700, textDecoration: 'underline' }}>Privacy Policy</span> and consent to data processing under Nigerian NDPR.
                  </p>
                  {agreedPrivacy ? (
                    <span style={{ display: 'block', color: 'var(--green)', fontSize: '11px', fontWeight: 800, marginTop: '3px', textTransform: 'uppercase' }}>✓ Accepted</span>
                  ) : (
                    <span style={{ display: 'block', color: 'var(--primary)', fontSize: '11px', fontWeight: 700, marginTop: '3px' }}>Click to read &amp; accept</span>
                  )}
                </div>
              </div>
            </div>

            <button type="submit" className="btn-auth" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading ? <><Loader2 size={16} className="spinner" /> Creating Account...</> : <><UserPlus size={16} /> Create Account</>}
            </button>

            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-m)' }}>Already have an account? <Link to="/login" style={{ color: 'var(--red)', fontWeight: 700 }}>Sign In</Link></p>
            </div>
          </form>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '24px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-l)' }}><Lock size={12} color="var(--green)" /> Secure Registration</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-l)' }}><ShieldCheck size={12} color="var(--blue-md)" /> 100% Safe</span>
        </div>
      </div>

      {/* Full Compliance Modal with Scroll-to-Bottom Requirement */}
      {activeLegalModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(5px)' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '28px', width: '100%', maxWidth: '620px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 60px rgba(0,0,0,0.4)', position: 'relative' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--border)', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font2)', fontSize: '20px', fontWeight: 900, color: 'var(--text-h)', margin: 0 }}>
                {activeLegalModal === 'terms' ? 'Terms & Conditions' : 'Privacy Policy & NDPR Consent'}
              </h3>
              <button 
                type="button" 
                onClick={() => setActiveLegalModal(null)} 
                style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text-h)', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Text Body */}
            <div 
              ref={legalScrollRef}
              onScroll={handleLegalScroll}
              style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', color: 'var(--text-b)', fontSize: '13.5px', lineHeight: 1.65, marginBottom: '20px' }}
            >
              {activeLegalModal === 'terms' ? (
                <>
                  <p style={{ marginBottom: '16px', fontWeight: 600 }}>
                    Welcome to Smart Choice Global Resources Ltd. By creating an account and placing orders on our platform, you acknowledge that you have read, understood, and agreed to the following legal terms and conditions:
                  </p>

                  <h4 style={{ color: 'var(--text-h)', fontWeight: 800, fontSize: '15px', marginBottom: '8px' }}>
                    1. Strict No-Return &amp; No-Refund Policy
                  </h4>
                  <p style={{ marginBottom: '14px' }}>
                    Smart Choice operates under a strict <strong>No-Return and No-Refund policy</strong>. Due to the high value, electrical sensitivity, and logistics requirements of electronics, appliances, and air conditioning systems, all sales are final once an item is purchased, inspected, and delivered or picked up.
                  </p>
                  <p style={{ marginBottom: '14px' }}>
                    Items cannot be returned for a refund or exchanged due to change of mind, incorrect sizing choices by the customer, or subjective preference.
                  </p>

                  <h4 style={{ color: 'var(--text-h)', fontWeight: 800, fontSize: '15px', marginBottom: '8px' }}>
                    2. Dead On Arrival (DOA) &amp; Factory Defects
                  </h4>
                  <p style={{ marginBottom: '14px' }}>
                    In the rare event that a product is certified Dead On Arrival (DOA) or suffers a manufacturer defect immediately upon unboxing, the defect must be reported to Smart Choice customer care within <strong>24 hours of delivery</strong>. Our certified technicians will verify the condition before any authorized replacement is processed.
                  </p>

                  <h4 style={{ color: 'var(--text-h)', fontWeight: 800, fontSize: '15px', marginBottom: '8px' }}>
                    3. Delivery &amp; Special Handling Charges
                  </h4>
                  <p style={{ marginBottom: '14px' }}>
                    Standard delivery applies within Port Harcourt, Rivers State. Extra-heavy or oversized equipment (such as standing air conditioners, commercial generators, multi-door refrigerators) may require specialized dispatch equipment and handling, which will be communicated prior to final fulfillment.
                  </p>

                  <h4 style={{ color: 'var(--text-h)', fontWeight: 800, fontSize: '15px', marginBottom: '8px' }}>
                    4. Warranty &amp; Service Coverage
                  </h4>
                  <p style={{ marginBottom: '14px' }}>
                    All products are 100% genuine and covered by authorized Nigerian manufacturer warranties (LG, Hisense, Samsung, Haier Thermocool, etc.). Warranty claims must follow official manufacturer service center protocols.
                  </p>
                </>
              ) : (
                <>
                  <p style={{ marginBottom: '16px', fontWeight: 600 }}>
                    Smart Choice Global Resources Ltd takes your data privacy seriously and is committed to compliance with the <strong>Nigeria Data Protection Regulation (NDPR)</strong> and the <strong>Nigeria Data Protection Act (NDPA)</strong>:
                  </p>

                  <h4 style={{ color: 'var(--text-h)', fontWeight: 800, fontSize: '15px', marginBottom: '8px' }}>
                    1. Data We Collect
                  </h4>
                  <p style={{ marginBottom: '14px' }}>
                    When registering an account, we collect your full name, telephone number, email address, delivery address, and transaction logs. This data is required solely for customer account management, order fulfillment, delivery tracking, and warranty verification.
                  </p>

                  <h4 style={{ color: 'var(--text-h)', fontWeight: 800, fontSize: '15px', marginBottom: '8px' }}>
                    2. Lawful Basis &amp; Use of Personal Data
                  </h4>
                  <p style={{ marginBottom: '14px' }}>
                    By accepting this agreement, you grant consent for Smart Choice to process your personal details to:
                    <br />• Communicate status updates regarding your orders and delivery dispatch.
                    <br />• Prevent fraud and ensure security of corporate transactions.
                    <br />• Maintain accurate customer warranty records.
                  </p>

                  <h4 style={{ color: 'var(--text-h)', fontWeight: 800, fontSize: '15px', marginBottom: '8px' }}>
                    3. Third-Party Sharing &amp; Data Security
                  </h4>
                  <p style={{ marginBottom: '14px' }}>
                    We never sell, rent, or lease your personal information to third-party marketing firms. Your data is stored on encrypted, access-controlled cloud infrastructure conforming to international security standards.
                  </p>

                  <h4 style={{ color: 'var(--text-h)', fontWeight: 800, fontSize: '15px', marginBottom: '8px' }}>
                    4. Your Rights Under NDPR
                  </h4>
                  <p style={{ marginBottom: '14px' }}>
                    You have the right to request access to your stored personal data, request correction of erroneous details, or request account closure at any time through your Profile dashboard or by contacting our Data Protection Officer.
                  </p>
                </>
              )}
            </div>

            {/* Scroll Progress Notice */}
            {!scrolledToBottom && (
              <div style={{ background: 'rgba(255,152,0,0.1)', border: '1px solid rgba(255,152,0,0.3)', borderRadius: 'var(--r-sm)', padding: '8px 12px', marginBottom: '12px', fontSize: '12px', color: '#B36B00', textAlign: 'center', fontWeight: 700 }}>
                ↓ Please scroll to the bottom of the document to unlock the accept button.
              </div>
            )}

            {/* Accept Button — Unlocked only after scrolling to bottom */}
            <button
              type="button"
              disabled={!scrolledToBottom}
              onClick={handleAcceptLegal}
              style={{
                width: '100%',
                padding: '14px',
                background: scrolledToBottom ? 'var(--primary)' : 'var(--border)',
                color: scrolledToBottom ? '#fff' : 'var(--text-m)',
                border: 'none',
                borderRadius: 'var(--r-md)',
                fontWeight: 800,
                fontSize: '14.5px',
                cursor: scrolledToBottom ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                boxShadow: scrolledToBottom ? '0 4px 16px rgba(208,2,27,0.35)' : 'none'
              }}
            >
              {scrolledToBottom ? 'I Understand & Accept' : 'Scroll Down to Accept'}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
