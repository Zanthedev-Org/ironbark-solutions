import React from 'react';
import { CreditCard, Smartphone, Building2, CheckCircle, ShieldCheck, Lock } from 'lucide-react';
import SEO from '../components/SEO';

const methods = [
  {
    icon: <CreditCard size={26} />,
    color: 'var(--blue-lt)',
    bg: 'rgba(34,87,197,0.08)',
    title: 'Card Payment via Paystack',
    badges: ['Visa', 'Mastercard', 'Verve'],
    highlight: 'Instant confirmation',
    highlightColor: '#0A7A32',
    desc: 'Pay securely online using your debit or credit card via Paystack — Nigeria\'s most trusted payment gateway. Your card details are encrypted and never stored on our servers.',
    steps: [
      'Select your items and proceed to checkout',
      'Choose "Card Payment" as your method',
      'Enter your details on the Paystack secure page',
      'Complete OTP verification from your bank',
      'Order confirmed instantly',
    ],
  },
  {
    icon: <Building2 size={26} />,
    color: '#8B6914',
    bg: 'rgba(240,184,0,0.08)',
    title: 'Bank Transfer',
    badges: ['Sterling Bank'],
    highlight: '15–30 mins to confirm',
    highlightColor: '#8B6914',
    desc: 'Transfer directly to our Sterling Bank account. Send us proof of payment via WhatsApp for quick confirmation and order processing.',
    steps: [
      'Get your total at checkout',
      'Transfer to: 8682287868 — Smart Choice Global Resources Ltd — Sterling Bank',
      'Send proof of payment to our WhatsApp: +234 816 592 9400',
      'We confirm payment and process your order',
    ],
  },
  {
    icon: <Smartphone size={26} />,
    color: '#0A7A32',
    bg: 'rgba(10,122,50,0.08)',
    title: 'POS / In-Store / Mobile Transfer',
    badges: ['Moniepoint', 'OPay', 'Kuda', 'All Banks'],
    highlight: 'Available in-store',
    highlightColor: '#0A7A32',
    desc: 'Pay via POS terminal at any of our stores, or use mobile banking transfer from any Nigerian bank to our account. Quick and simple.',
    steps: [
      'Visit either of our two stores in Port Harcourt',
      'Or call to arrange a transfer to our account',
      'Payment confirmed immediately by our staff',
    ],
  },
];

export default function PaymentMethods() {
  return (
    <>
      <SEO
        title="Payment Methods – Smart Choice Electronics | Port Harcourt"
        description="Discover all accepted payment methods at Smart Choice Electronics: card payment via Paystack, bank transfer, POS, and mobile transfer."
        url="/payment-methods"
      />

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--blue) 0%, var(--blue-lt) 60%, var(--red) 100%)',
        padding: '60px 20px 56px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: 'linear-gradient(90deg,#D0021B,#0C2D6B,#F0B800,#2257C5)' }} />
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.3)', borderRadius: 30,
          padding: '6px 18px', marginBottom: 18,
        }}>
          <CreditCard size={13} color="#fff" />
          <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Secure Payments</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font2)', fontSize: 'clamp(28px,5vw,46px)', fontWeight: 900, color: '#fff', margin: '0 0 12px', textShadow: '0 2px 16px rgba(0,0,0,0.25)' }}>
          Payment <span style={{ color: '#F0B800' }}>Methods</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, maxWidth: 480, margin: '0 auto' }}>
          Multiple convenient and secure payment options for a smooth shopping experience.
        </p>
      </div>

      <div className="main-content" style={{ maxWidth: 1000, padding: '40px 20px 60px' }}>

        {/* Trust badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 36 }}>
          {[
            { icon: <Lock size={13} />, text: 'SSL Encrypted', color: '#0A7A32', bg: 'rgba(10,122,50,0.08)', border: 'rgba(10,122,50,0.2)' },
            { icon: <ShieldCheck size={13} />, text: 'PCI-DSS Compliant', color: 'var(--blue-lt)', bg: 'rgba(34,87,197,0.08)', border: 'rgba(34,87,197,0.2)' },
            { icon: <CheckCircle size={13} />, text: '100% Secure', color: '#8B6914', bg: 'rgba(240,184,0,0.08)', border: 'rgba(240,184,0,0.25)' },
          ].map((b, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: b.bg, border: `1px solid ${b.border}`,
              borderRadius: 30, padding: '8px 18px',
              color: b.color, fontSize: 13, fontWeight: 700,
            }}>
              {b.icon} {b.text}
            </div>
          ))}
        </div>

        {/* Bank Account Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(240,184,0,0.07), rgba(240,184,0,0.02))',
          border: '1.5px solid rgba(240,184,0,0.28)',
          borderRadius: 'var(--r-xl)', padding: '24px 28px', marginBottom: 36,
          display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between',
          boxShadow: 'var(--sh-sm)',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#8B6914', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>Bank Account Details</div>
            <div style={{ fontFamily: 'var(--font2)', fontSize: 28, fontWeight: 900, color: 'var(--text-h)', letterSpacing: '2px' }}>8682287868</div>
            <div style={{ color: 'var(--text-m)', fontSize: 13, marginTop: 4 }}>Smart Choice Global Resources Ltd</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--text-m)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Bank</div>
            <div style={{ fontFamily: 'var(--font2)', fontWeight: 900, fontSize: 22, color: '#8B6914' }}>Sterling Bank</div>
          </div>
        </div>

        {/* Payment Method Cards */}
        <div className="section-header" style={{ marginBottom: 20 }}>
          <h2 className="section-title"><span className="title-accent">Accepted Payment Methods</span></h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 36 }}>
          {methods.map((m, i) => (
            <div key={i} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-xl)', overflow: 'hidden',
              boxShadow: 'var(--sh-sm)', transition: 'var(--ease)',
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--sh-md)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--sh-sm)'}
            >
              {/* Method header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '20px 24px',
                background: m.bg,
                borderBottom: '1px solid var(--border)',
                flexWrap: 'wrap',
              }}>
                <div style={{ color: m.color, flexShrink: 0 }}>{m.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'var(--font2)', fontWeight: 900, fontSize: 17, color: 'var(--text-h)', marginBottom: 8 }}>{m.title}</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {m.badges.map((b, j) => (
                      <span key={j} style={{
                        background: 'var(--bg)', border: '1px solid var(--border)',
                        color: 'var(--text-m)', fontSize: 11, fontWeight: 700,
                        padding: '3px 10px', borderRadius: 20,
                      }}>{b}</span>
                    ))}
                  </div>
                </div>
                <div style={{
                  background: 'var(--surface)', border: `1px solid ${m.color}40`,
                  color: m.highlightColor, fontSize: 12, fontWeight: 700,
                  padding: '5px 14px', borderRadius: 20, flexShrink: 0, whiteSpace: 'nowrap',
                }}>
                  {m.highlight}
                </div>
              </div>

              {/* Description + Steps */}
              <div style={{ padding: '22px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24 }}>
                <div style={{ color: 'var(--text-b)', fontSize: 14, lineHeight: 1.8 }}>{m.desc}</div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-m)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Steps</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {m.steps.map((step, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <span style={{
                          background: 'rgba(208,2,27,0.1)', color: 'var(--red)',
                          fontSize: 11, fontWeight: 900, width: 20, height: 20,
                          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, marginTop: 1,
                        }}>{j + 1}</span>
                        <span style={{ color: 'var(--text-b)', fontSize: 13, lineHeight: 1.6 }}>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Security Note */}
        <div style={{
          background: 'rgba(10,122,50,0.05)', border: '1.5px solid rgba(10,122,50,0.2)',
          borderRadius: 'var(--r-lg)', padding: '20px 24px',
          display: 'flex', alignItems: 'flex-start', gap: 14,
        }}>
          <ShieldCheck size={20} color="#0A7A32" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#0A7A32', marginBottom: 6 }}>Your Payment is Secure</div>
            <div style={{ color: 'var(--text-b)', fontSize: 13, lineHeight: 1.7 }}>
              All card transactions are processed via Paystack's PCI-DSS Level 1 compliant gateway. We never store card information. Look for the padlock icon in your browser — this confirms a secure connection.
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
