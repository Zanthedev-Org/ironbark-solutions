import React from 'react';
import { ShieldCheck, CheckCircle, AlertTriangle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const warrantyHighlights = [
  { icon: '✅', title: '100% Genuine Products', desc: 'We source exclusively from authorised distributors. No refurbished or clone products — ever.' },
  { icon: '📅', title: 'Standard Warranty Period', desc: 'Minimum 1-year manufacturer warranty on most electronics. Select brands (LG, Samsung, Haier) offer up to 2 years.' },
  { icon: '🔍', title: 'What Warranty Covers', desc: 'Manufacturing defects and component failures under normal use. Does NOT cover physical damage, water damage, power surge, or misuse.' },
  { icon: '⚠️', title: 'Warranty Void Conditions', desc: 'Warranty is void if tampered with, repaired by an unauthorised technician, or if the serial number is removed/defaced.' },
];

const claimSteps = [
  { num: '01', title: 'Contact Us', desc: 'Reach out via WhatsApp, call, or email with your Order ID and a description of the fault.' },
  { num: '02', title: 'Verification', desc: 'Our team verifies your purchase and confirms the fault qualifies under warranty.' },
  { num: '03', title: 'Assessment', desc: 'Item is assessed by our technical team or sent to the manufacturer\'s authorised service centre.' },
  { num: '04', title: 'Resolution', desc: 'Item is repaired or replaced and returned to you at no extra cost.' },
];

export default function Warranty() {
  return (
    <>
      <SEO
        title="Warranty Policy – Smart Choice Electronics | Port Harcourt"
        description="Learn about our product warranty terms, what is covered, how to claim warranty, and our after-sales support at Smart Choice Electronics."
        url="/warranty"
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
          <ShieldCheck size={13} color="#fff" />
          <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Your Protection</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font2)', fontSize: 'clamp(28px,5vw,46px)', fontWeight: 900, color: '#fff', margin: '0 0 12px', textShadow: '0 2px 16px rgba(0,0,0,0.25)' }}>
          Warranty <span style={{ color: '#F0B800' }}>Policy</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, maxWidth: 500, margin: '0 auto' }}>
          We stand behind every product we sell. All items are 100% genuine with full manufacturer warranty support.
        </p>
      </div>

      <div className="main-content" style={{ maxWidth: 1000, padding: '40px 20px 60px' }}>

        {/* Highlights grid */}
        <div className="section-header" style={{ marginBottom: 20 }}>
          <h2 className="section-title"><span className="title-accent">Warranty Overview</span></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, marginBottom: 48 }}>
          {warrantyHighlights.map((w, i) => (
            <div key={i} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-lg)', padding: '24px 20px',
              boxShadow: 'var(--sh-sm)', transition: 'var(--ease)',
            }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--sh-md)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--sh-sm)'; e.currentTarget.style.transform = ''; }}
            >
              <div style={{ fontSize: 28, marginBottom: 14 }}>{w.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-h)', marginBottom: 8, lineHeight: 1.4 }}>{w.title}</div>
              <div style={{ color: 'var(--text-b)', fontSize: 13, lineHeight: 1.7 }}>{w.desc}</div>
            </div>
          ))}
        </div>

        {/* How to Claim */}
        <div className="section-header" style={{ marginBottom: 24 }}>
          <h2 className="section-title"><span className="title-accent">How to Claim Warranty</span></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 48 }}>
          {claimSteps.map((s, i) => (
            <div key={i} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-lg)', padding: '24px 20px', position: 'relative',
              boxShadow: 'var(--sh-sm)',
            }}>
              <div style={{
                fontFamily: 'var(--font2)', fontSize: 44, fontWeight: 900,
                color: 'var(--border)', position: 'absolute', top: 12, right: 16, lineHeight: 1,
              }}>{s.num}</div>
              <div style={{ fontFamily: 'var(--font2)', fontWeight: 900, fontSize: 15, color: 'var(--red)', marginBottom: 8 }}>{s.num}. {s.title}</div>
              <div style={{ color: 'var(--text-b)', fontSize: 13, lineHeight: 1.7 }}>{s.desc}</div>
            </div>
          ))}
        </div>

        {/* What you need */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-xl)', padding: '28px 32px', marginBottom: 32,
          boxShadow: 'var(--sh-sm)',
        }}>
          <div className="section-header" style={{ borderBottom: 'none', marginBottom: 18, paddingBottom: 0 }}>
            <h3 className="section-title" style={{ fontSize: 17 }}><span className="title-accent">What You'll Need for a Claim</span></h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              'Original proof of purchase (receipt or order confirmation)',
              'The defective product in its original packaging (where possible)',
              'Manufacturer warranty card (where applicable)',
              'A clear description or short video of the issue',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <CheckCircle size={16} color="#0A7A32" style={{ flexShrink: 0, marginTop: 2 }} />
                <span style={{ color: 'var(--text-b)', fontSize: 14 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Important Note */}
        <div style={{
          background: 'rgba(240,184,0,0.06)', border: '1.5px solid rgba(240,184,0,0.3)',
          borderRadius: 'var(--r-lg)', padding: '20px 24px', marginBottom: 32,
          display: 'flex', gap: 14, alignItems: 'flex-start',
        }}>
          <AlertTriangle size={20} color="#8B6914" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#8B6914', marginBottom: 6 }}>Important</div>
            <div style={{ color: 'var(--text-b)', fontSize: 13, lineHeight: 1.7 }}>
              Warranty claims must be reported within the warranty period. Attempting self-repair or using unauthorised technicians voids the warranty automatically. Always contact us first.
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(208,2,27,0.05), rgba(12,45,107,0.05))',
          border: '1.5px solid var(--border)', borderRadius: 'var(--r-xl)',
          padding: '32px', textAlign: 'center', boxShadow: 'var(--sh-sm)',
        }}>
          <Phone size={30} color="var(--red)" style={{ margin: '0 auto 14px' }} />
          <h3 style={{ fontFamily: 'var(--font2)', fontWeight: 900, fontSize: 20, color: 'var(--text-h)', marginBottom: 8 }}>Need to Make a Warranty Claim?</h3>
          <p style={{ color: 'var(--text-m)', marginBottom: 20, fontSize: 14 }}>Our after-sales team will guide you through the process.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--red)', color: '#fff', padding: '12px 24px', borderRadius: 'var(--r-md)', fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>
              Contact Us
            </Link>
            <a href="tel:+2348165929400"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--text-h)', padding: '12px 24px', borderRadius: 'var(--r-md)', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
              <Phone size={14} /> Call +234 816 592 9400
            </a>
          </div>
        </div>

      </div>
    </>
  );
}
