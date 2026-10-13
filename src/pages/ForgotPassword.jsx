import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, SendHorizonal, Zap } from 'lucide-react';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err) {
      console.error(err);
      setError('Failed to send reset email. Please verify your email address and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">

        {/* Logo — identical to Login & Register */}
        <div className="auth-logo" style={{ flexDirection: 'column', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '44px', height: '44px', background: '#fff', borderRadius: '8px', overflow: 'hidden', padding: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--sh-sm)' }}>
              <img src="/smartchoice-logo.jpeg" alt="Smart Choice" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 900, letterSpacing: '-0.5px' }}>
              <span style={{ color: 'var(--red)' }}>Smart</span><span style={{ color: '#2257C5' }}>Choice</span>
            </div>
          </Link>
          <p style={{ color: 'var(--text-m)', fontSize: '13px', marginTop: '10px' }}>Reset your password</p>
        </div>

        {/* Mail icon header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: 60, height: 60,
            background: 'rgba(208,2,27,0.08)', border: '2px solid rgba(208,2,27,0.2)',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 14px',
          }}>
            <Mail size={26} color="var(--red)" />
          </div>
          <h1 style={{ fontFamily: 'var(--font2)', fontSize: '20px', fontWeight: 900, color: 'var(--text-h)', margin: '0 0 6px' }}>
            Forgot Password?
          </h1>
          <p style={{ color: 'var(--text-m)', fontSize: '13px' }}>
            No worries! Enter your email and we'll send you a reset link.
          </p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <SendHorizonal size={52} color="#0A7A32" strokeWidth={1.5} style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontFamily: 'var(--font2)', fontSize: '20px', fontWeight: 900, color: '#0A7A32', marginBottom: '8px' }}>
              Reset Link Sent!
            </h3>
            <p style={{ color: 'var(--text-m)', marginBottom: '8px', fontSize: '14px', lineHeight: 1.7 }}>
              Check your inbox at <strong style={{ color: 'var(--text-h)' }}>{email}</strong>.
            </p>
            <p style={{ color: '#8B6914', fontSize: '13px', fontWeight: 700, marginBottom: '24px' }}>
              ⚠️ Check your spam/junk folder if you don't see it!
            </p>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--red)', fontWeight: 700, fontSize: 14 }}>
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {error && (
              <div style={{ background: 'rgba(208,2,27,0.07)', border: '1px solid rgba(208,2,27,0.25)', color: 'var(--red)', padding: '12px 16px', borderRadius: 'var(--r-sm)', fontSize: '13px', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                required placeholder="you@example.com"
                className="form-input"
                style={{ width: '100%' }}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-auth"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading ? 0.7 : 1 }}>
              {loading ? <><Zap size={16} /> Sending...</> : <><SendHorizonal size={16} /> Send Reset Link</>}
            </button>

            <div style={{ textAlign: 'center' }}>
              <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-m)', fontSize: '14px', fontWeight: 600 }}>
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </div>
          </form>
        )}

      </div>
    </main>
  );
}
