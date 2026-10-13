import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import SEO from '../components/SEO';

const faqs = [
  {
    cat: 'Orders & Delivery',
    icon: '📦',
    items: [
      { q: 'How long does delivery take?', a: 'Delivery within Port Harcourt typically takes 1–3 business days. Outside Port Harcourt may take 3–7 business days. Our delivery team will call you before dispatch to confirm your location.' },
      { q: 'What is the delivery fee?', a: 'Standard delivery within Port Harcourt is ₦7,000. Large or heavy items (refrigerators, washing machines, ACs) may incur additional charges due to their size and weight. You will always be informed before dispatch.' },
      { q: 'Can I track my order?', a: 'Yes! Use our Track Your Order page. Enter your Order ID or the phone number used when placing the order. You can also WhatsApp us for a real-time status update.' },
      { q: 'Do you deliver outside Port Harcourt?', a: 'Yes, we deliver nationwide across Nigeria. Delivery fees and timelines vary by location. Contact us on WhatsApp for a custom delivery quote.' },
    ],
  },
  {
    cat: 'Products & Warranty',
    icon: '🛡️',
    items: [
      { q: 'Are all products genuine/original?', a: '100% yes. Smart Choice Electronics deals exclusively in brand-new, original products from authorised distributors. All products come with manufacturer warranty cards where applicable.' },
      { q: 'What warranty do products come with?', a: 'Most electronics carry a minimum 1-year manufacturer warranty. Some brands (LG, Samsung, Haier) offer up to 2 years. Visit our Warranty Policy page for full details.' },
      { q: 'Can I inspect the product before accepting delivery?', a: 'Absolutely. Inspect your item on delivery before signing off. If there is visible damage or a defect, you may refuse delivery and we will resolve it immediately at no cost to you.' },
    ],
  },
  {
    cat: 'Payment',
    icon: '💳',
    items: [
      { q: 'What payment methods do you accept?', a: 'We accept bank transfers, POS payments, Paystack (card/debit), and cash at our stores. Bank details: 8682287868 — Smart Choice Global Resources Ltd — Sterling Bank.' },
      { q: 'Is it safe to pay online?', a: 'Yes. Payments are processed via Paystack, a PCI-DSS Level 1 compliant gateway trusted by thousands of Nigerian businesses. Your card details are never stored on our servers.' },
      { q: 'Can I pay on delivery (POD)?', a: 'Pay on delivery is available for select orders within Port Harcourt at the team\'s discretion. Contact us via WhatsApp to discuss this for your specific order.' },
    ],
  },
  {
    cat: 'After-Sales Support',
    icon: '🔧',
    items: [
      { q: 'What if my product is faulty on arrival?', a: 'Contact us within 48 hours of delivery. We will arrange a replacement or repair at no cost. Keep the original packaging for the process.' },
      { q: 'How do I claim warranty?', a: 'Contact us with your proof of purchase and a description of the fault. Our team will guide you through the manufacturer warranty claim process step by step.' },
    ],
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-md)',
      overflow: 'hidden',
      background: 'var(--surface)',
      transition: 'box-shadow 0.2s, border-color 0.2s',
      boxShadow: open ? 'var(--sh-md)' : 'var(--sh-sm)',
    }}>
      <button onClick={() => setOpen(v => !v)} style={{
        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        gap: 14, padding: '16px 20px',
        background: open ? 'rgba(208,2,27,0.04)' : 'transparent',
        border: 'none', cursor: 'pointer', textAlign: 'left',
      }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: open ? 'var(--red)' : 'var(--text-h)', flex: 1, lineHeight: 1.5 }}>{q}</span>
        <span style={{ flexShrink: 0, color: 'var(--text-m)' }}>
          {open ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
        </span>
      </button>
      {open && (
        <div style={{
          padding: '0 20px 18px',
          borderTop: '1px solid var(--border)',
          background: 'rgba(208,2,27,0.02)',
          color: 'var(--text-b)', fontSize: 14, lineHeight: 1.8
        }}>
          <div style={{ paddingTop: 14 }}>{a}</div>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <>
      <SEO
        title="FAQ – Smart Choice Electronics | Port Harcourt"
        description="Frequently asked questions about orders, delivery fees, payment methods, warranty and after-sales at Smart Choice Electronics, Port Harcourt."
        url="/faq"
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
          <HelpCircle size={13} color="#fff" />
          <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Help Centre</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font2)', fontSize: 'clamp(28px,5vw,46px)', fontWeight: 900, color: '#fff', margin: '0 0 12px', textShadow: '0 2px 16px rgba(0,0,0,0.25)' }}>
          Frequently Asked <span style={{ color: '#F0B800' }}>Questions</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, maxWidth: 480, margin: '0 auto 24px' }}>
          Can't find the answer? Our team is on WhatsApp for instant support.
        </p>
        <a href="https://wa.me/2348165929400" target="_blank" rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#25D366', color: '#000', padding: '11px 26px',
            borderRadius: 30, fontWeight: 800, fontSize: 14, textDecoration: 'none',
            boxShadow: '0 4px 18px rgba(37,211,102,0.4)',
          }}>
          <FaWhatsapp size={16} /> Chat on WhatsApp
        </a>
      </div>

      {/* FAQ Categories */}
      <div className="main-content" style={{ maxWidth: 800, padding: '40px 20px 60px' }}>
        {faqs.map((cat, i) => (
          <div key={i} style={{ marginBottom: 40 }}>
            <div className="section-header" style={{ marginBottom: 16 }}>
              <h2 className="section-title">
                <span style={{ marginRight: 8 }}>{cat.icon}</span>
                <span className="title-accent">{cat.cat}</span>
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {cat.items.map((item, j) => <FAQItem key={j} q={item.q} a={item.a} />)}
            </div>
          </div>
        ))}

        {/* Still need help CTA */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(208,2,27,0.06), rgba(12,45,107,0.06))',
          border: '1.5px solid var(--border)',
          borderRadius: 'var(--r-xl)', padding: '32px',
          textAlign: 'center', boxShadow: 'var(--sh-sm)',
        }}>
          <HelpCircle size={36} color="var(--red)" style={{ margin: '0 auto 14px' }} />
          <h3 style={{ fontFamily: 'var(--font2)', fontWeight: 900, fontSize: 20, color: 'var(--text-h)', marginBottom: 8 }}>Still have questions?</h3>
          <p style={{ color: 'var(--text-m)', marginBottom: 20, fontSize: 14 }}>Our support team is available Mon–Sat, 8am–8pm.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://wa.me/2348165929400" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#25D366', color: '#000', padding: '11px 22px', borderRadius: 'var(--r-md)', fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>
              <FaWhatsapp size={15} /> WhatsApp Us
            </a>
            <a href="tel:+2348165929400"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--text-h)', padding: '11px 22px', borderRadius: 'var(--r-md)', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
              Call: +234 816 592 9400
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
