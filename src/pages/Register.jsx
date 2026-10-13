import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, ShieldCheck, Lock, CheckCircle, Loader2 } from 'lucide-react';
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
  
  const navigate = useNavigate();

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
      setError('Please accept both the Terms & Conditions and Privacy Policy.'); 
      return; 
    }
    
    setLoading(true);
    try {
      // 1. Create Firebase Auth user directly
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

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
      setTimeout(() => navigate('/login'), 3000);

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
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <CheckCircle size={64} color="#0A7A32" strokeWidth={1.5} style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontFamily: 'var(--font2)', fontSize: '22px', fontWeight: 900, color: '#0A7A32', marginBottom: '8px' }}>Account Created!</h3>
            <p style={{ color: 'var(--text-m)', marginBottom: '10px', fontSize: '14px', lineHeight: 1.7 }}>
              A <strong style={{ color: 'var(--text-h)' }}>verification email</strong> has been sent to{' '}
              <strong style={{ color: 'var(--text-h)' }}>{formData.email}</strong>.
            </p>
            <p style={{ color: '#8B6914', fontSize: '13px', fontWeight: 700, marginBottom: '20px' }}>
              ⚠️ Please check your inbox (and spam/junk folder) and click the link to verify your account before logging in.
            </p>
            <div style={{ display: 'inline-block', background: 'rgba(10,122,50,0.1)', color: '#0A7A32', border: '1px solid rgba(10,122,50,0.25)', padding: '10px 24px', borderRadius: 'var(--r-md)', fontWeight: 700, fontSize: 14 }}>
              Redirecting to login...
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

            {/* Legal Agreements */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {[
                { key: 'terms', agreed: agreedTerms, setAgreed: setAgreedTerms, label: 'I have read and accept the', link: 'Terms & Conditions', route: '/terms', extra: 'including the No-Return & No-Refund policy.' },
                { key: 'privacy', agreed: agreedPrivacy, setAgreed: setAgreedPrivacy, label: 'I have read and accept the', link: 'Privacy Policy', route: '/privacy', extra: 'and consent to data processing under Nigerian NDPR.' }
              ].map(item => (
                <div key={item.key} onClick={() => !item.agreed && item.setAgreed(true)} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px', border: `1.5px solid ${item.agreed ? 'var(--green)' : 'var(--border)'}`, borderRadius: 'var(--r-sm)', background: item.agreed ? 'rgba(10,122,50,0.05)' : 'var(--surface2)', cursor: 'pointer', transition: 'var(--ease)' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '6px', border: `2px solid ${item.agreed ? 'var(--green)' : 'var(--border)'}`, background: item.agreed ? 'var(--green)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px', transition: 'var(--ease)' }}>
                    {item.agreed && <span style={{ color: '#fff', fontSize: '12px', fontWeight: 900 }}>✓</span>}
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-m)', lineHeight: 1.6 }}>
                    {item.label} <Link to={item.route} onClick={e => e.stopPropagation()} style={{ color: 'var(--red)', fontWeight: 700 }}>{item.link}</Link> {item.extra}
                    {item.agreed && <span style={{ display: 'block', color: 'var(--green)', fontSize: '11px', fontWeight: 700, marginTop: '4px' }}>✓ Accepted</span>}
                  </p>
                </div>
              ))}
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
    </main>
  );
}
