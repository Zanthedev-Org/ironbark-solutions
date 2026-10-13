import React, { useState } from 'react';
import { PhoneCall, Mail, MapPin, Clock, Building2, Send, CheckCircle, MessageSquare } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import SEO from '../components/SEO';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `*New Message — SmartChoice Website*\n\nName: ${form.name}\nEmail: ${form.email || 'N/A'}\nPhone: ${form.phone || 'N/A'}\n\nMessage:\n${form.message}`
    );
    window.open(`https://wa.me/2348165929400?text=${text}`, '_blank');
    setSent(true);
  };

  return (
    <>
      <SEO
        title="Contact Us – Smart Choice Electronics | Port Harcourt"
        description="Reach Smart Choice Electronics by phone, WhatsApp, email or visit our stores in Port Harcourt."
        url="/contact"
      />

      {/* ── Page Hero ── */}
      <div style={{
        background: 'linear-gradient(135deg, var(--blue) 0%, var(--blue-lt) 60%, var(--red) 100%)',
        padding: '60px 20px 56px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative stripes */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: 'linear-gradient(90deg,#D0021B,#0C2D6B,#F0B800,#2257C5)' }} />
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.3)', borderRadius: 30,
          padding: '6px 18px', marginBottom: 18,
        }}>
          <MessageSquare size={13} color="#fff" />
          <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Get In Touch</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font2)', fontSize: 'clamp(28px,5vw,46px)', fontWeight: 900, color: '#fff', margin: '0 0 12px', textShadow: '0 2px 16px rgba(0,0,0,0.25)' }}>
          Contact <span style={{ color: '#F0B800' }}>Smart Choice</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, maxWidth: 500, margin: '0 auto' }}>
          We are always ready to help. Reach us via phone, WhatsApp, email, or visit any of our Port Harcourt stores.
        </p>
      </div>

      {/* ── Main Content ── */}
      <div className="main-content" style={{ maxWidth: 1100 }}>

        {/* Contact Cards Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, margin: '32px 0' }}>
          {[
            {
              icon: <PhoneCall size={22} />, color: 'var(--red)', bg: 'rgba(208,2,27,0.07)',
              border: 'rgba(208,2,27,0.18)', label: 'Call Us',
              content: (
                <>
                  <a href="tel:+2348165929400" style={{ display: 'block', color: 'var(--red)', fontWeight: 800, fontSize: 14 }}>+234 816 592 9400</a>
                  <a href="tel:+2348165896158" style={{ display: 'block', color: 'var(--red)', fontWeight: 800, fontSize: 14 }}>+234 816 589 6158</a>
                  <span style={{ fontSize: 12, color: 'var(--text-m)', display: 'block', marginTop: 4 }}>Mon – Sat: 8am – 8pm</span>
                </>
              ),
            },
            {
              icon: <FaWhatsapp size={22} />, color: '#25D366', bg: 'rgba(37,211,102,0.07)',
              border: 'rgba(37,211,102,0.25)', label: 'WhatsApp',
              content: (
                <>
                  <a href="https://wa.me/2348165929400" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', fontWeight: 800, fontSize: 14 }}>Chat with us →</a>
                  <span style={{ fontSize: 12, color: 'var(--text-m)', display: 'block', marginTop: 4 }}>Fastest response time</span>
                </>
              ),
            },
            {
              icon: <Mail size={22} />, color: 'var(--blue-lt)', bg: 'rgba(34,87,197,0.07)',
              border: 'rgba(34,87,197,0.2)', label: 'Email Us',
              content: (
                <a href="mailto:smartchoiceglobalresourcesltd@gmail.com"
                  style={{ color: 'var(--blue-lt)', fontWeight: 700, fontSize: 12, wordBreak: 'break-all', lineHeight: 1.5 }}>
                  smartchoiceglobalresourcesltd@gmail.com
                </a>
              ),
            },
            {
              icon: <Clock size={22} />, color: 'var(--yellow)', bg: 'rgba(240,184,0,0.07)',
              border: 'rgba(240,184,0,0.25)', label: 'Hours',
              content: (
                <>
                  <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-h)', display: 'block' }}>Mon – Saturday</span>
                  <span style={{ color: 'var(--text-b)', fontSize: 14 }}>8:00 AM – 8:00 PM</span>
                  <span style={{ fontSize: 12, color: 'var(--text-m)', display: 'block', marginTop: 4 }}>Sunday: Closed</span>
                </>
              ),
            },
          ].map((c, i) => (
            <div key={i} style={{
              background: 'var(--surface)', border: `1px solid var(--border)`,
              borderRadius: 'var(--r-lg)', padding: '22px 20px',
              boxShadow: 'var(--sh-sm)', transition: 'var(--ease)',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--sh-md)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--sh-sm)'; }}
            >
              <div style={{ width: 46, height: 46, borderRadius: 12, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color, marginBottom: 14 }}>
                {c.icon}
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-m)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>{c.label}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{c.content}</div>
            </div>
          ))}
        </div>

        {/* Two-column: Stores + Contact Form */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 32, marginBottom: 48 }}>

          {/* Store Locations */}
          <div>
            <div className="section-header" style={{ marginBottom: 20 }}>
              <h2 className="section-title"><span className="title-accent">Our Stores</span></h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: <MapPin size={18} />, name: 'Main Store', addr: '71 NTA Road, Mgbuoba\nPort Harcourt, Rivers State', phone: '+234 816 589 6158', tel: '+2348165896158' },
                { icon: <Building2 size={18} />, name: 'Smart Choice Plaza (Branch)', addr: '37 NTA Road, Mgbuoba\nPort Harcourt, Rivers State', phone: '+234 816 592 9400', tel: '+2348165929400' },
              ].map((s, i) => (
                <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '20px 22px', boxShadow: 'var(--sh-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ color: 'var(--red)' }}>{s.icon}</div>
                    <span style={{ fontFamily: 'var(--font2)', fontWeight: 800, fontSize: 15, color: 'var(--text-h)' }}>{s.name}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-b)', whiteSpace: 'pre-line', lineHeight: 1.7, margin: '0 0 10px' }}>{s.addr}</p>
                  <a href={`tel:${s.tel}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--red)', fontWeight: 700, fontSize: 13 }}>
                    <PhoneCall size={13} /> {s.phone}
                  </a>
                </div>
              ))}

              {/* Bank Details */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(240,184,0,0.07), rgba(240,184,0,0.02))',
                border: '1.5px solid rgba(240,184,0,0.28)',
                borderRadius: 'var(--r-lg)', padding: '20px 22px',
              }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(180,134,0,0.8)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>Bank Transfer / POS</div>
                <div style={{ fontFamily: 'var(--font2)', fontSize: 24, fontWeight: 900, color: 'var(--text-h)', letterSpacing: '2px' }}>8682287868</div>
                <div style={{ fontSize: 13, color: 'var(--text-b)', marginTop: 4 }}>Smart Choice Global Resources Ltd</div>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#8B6914', marginTop: 4 }}>Sterling Bank</div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="section-header" style={{ marginBottom: 20 }}>
              <h2 className="section-title"><span className="title-accent">Send a Message</span></h2>
            </div>
            {sent ? (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: 40, textAlign: 'center', boxShadow: 'var(--sh-sm)' }}>
                <CheckCircle size={52} color="#0A7A32" style={{ margin: '0 auto 16px' }} />
                <div style={{ fontFamily: 'var(--font2)', fontSize: 20, fontWeight: 900, color: 'var(--green)', marginBottom: 8 }}>Message Sent!</div>
                <div style={{ color: 'var(--text-m)', fontSize: 14, marginBottom: 20 }}>Your message was forwarded to our WhatsApp. We'll respond shortly.</div>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', message: '' }); }}
                  style={{ background: 'var(--red)', color: '#fff', padding: '10px 26px', borderRadius: 'var(--r-md)', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 14 }}>
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '28px', boxShadow: 'var(--sh-sm)', display: 'flex', flexDirection: 'column', gap: 18 }}>
                {[
                  { label: 'Your Name *', key: 'name', type: 'text', ph: 'John Doe', req: true },
                  { label: 'Email Address', key: 'email', type: 'email', ph: 'you@example.com', req: false },
                  { label: 'Phone Number', key: 'phone', type: 'tel', ph: '+234 800 000 0000', req: false },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-m)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>{f.label}</label>
                    <input type={f.type} required={f.req} placeholder={f.ph} value={form[f.key]}
                      onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                      className="form-input" style={{ width: '100%' }} />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-m)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 7 }}>Your Message *</label>
                  <textarea required rows={4} placeholder="How can we help you?" value={form.message}
                    onChange={e => setForm(v => ({ ...v, message: e.target.value }))}
                    style={{ width: '100%', background: 'var(--bg)', border: '1.5px solid var(--border)', color: 'var(--text-h)', padding: '11px 14px', borderRadius: 'var(--r-sm)', fontSize: 14, resize: 'vertical', fontFamily: 'var(--font)', outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = 'var(--blue-lt)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                </div>
                <button type="submit" className="btn-auth" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 'var(--r-md)' }}>
                  <Send size={15} /> Send via WhatsApp
                </button>
                <p style={{ fontSize: 11, color: 'var(--text-l)', textAlign: 'center', margin: '-8px 0 0' }}>Opens WhatsApp for instant support</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
