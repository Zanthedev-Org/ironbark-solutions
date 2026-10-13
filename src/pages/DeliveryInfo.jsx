import React from 'react';
import { Truck, Clock, MapPin, AlertCircle, CheckCircle, Package, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const deliveryZones = [
  { zone: 'Port Harcourt (GRA, Trans-Amadi, Mile 1–4)', fee: '₦7,000', time: '1–2 Business Days', feeColor: '#0A7A32' },
  { zone: 'Port Harcourt (Rumuola, Mgbuoba, Rumuibekwe)', fee: '₦7,000', time: '1–2 Business Days', feeColor: '#0A7A32' },
  { zone: 'Port Harcourt (Rukpokwu, Igwuruta, Airport Road)', fee: '₦7,000', time: '1–3 Business Days', feeColor: '#0A7A32' },
  { zone: 'Obio-Akpor LGA', fee: '₦7,000', time: '1–2 Business Days', feeColor: '#0A7A32' },
  { zone: 'Eleme, Oyigbo, Tai, Gokana', fee: 'Contact Us', time: '2–4 Business Days', feeColor: '#8B6914' },
  { zone: 'Other Rivers State Locations', fee: 'Contact Us', time: '2–5 Business Days', feeColor: '#8B6914' },
  { zone: 'Lagos, Abuja, Other States', fee: 'Contact Us', time: '3–7 Business Days', feeColor: '#8B6914' },
];

const processSteps = [
  { icon: <Package size={22} />, title: 'Order Placed', desc: 'Your order is received and reviewed by our team.' },
  { icon: <CheckCircle size={22} />, title: 'Payment Confirmed', desc: 'Payment is verified and your item is prepared for dispatch.' },
  { icon: <Truck size={22} />, title: 'Out for Delivery', desc: 'Our delivery team contacts you to confirm your location before arriving.' },
  { icon: <MapPin size={22} />, title: 'Delivered', desc: 'Item is delivered to your doorstep. Please inspect before signing off.' },
];

export default function DeliveryInfo() {
  return (
    <>
      <SEO
        title="Delivery Information – Smart Choice Electronics | Port Harcourt"
        description="Learn about our delivery zones, fees starting at ₦7,000, timelines, and policies at Smart Choice Electronics, Port Harcourt."
        url="/delivery-info"
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
          <Truck size={13} color="#fff" />
          <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Delivery</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font2)', fontSize: 'clamp(28px,5vw,46px)', fontWeight: 900, color: '#fff', margin: '0 0 12px', textShadow: '0 2px 16px rgba(0,0,0,0.25)' }}>
          Delivery <span style={{ color: '#F0B800' }}>Information</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, maxWidth: 500, margin: '0 auto' }}>
          We deliver across Port Harcourt and Nigeria. Here's everything you need to know.
        </p>
      </div>

      <div className="main-content" style={{ maxWidth: 1000, padding: '40px 20px 60px' }}>

        {/* Delivery Process */}
        <div className="section-header" style={{ marginBottom: 20 }}>
          <h2 className="section-title"><span className="title-accent">How Delivery Works</span></h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginBottom: 48 }}>
          {processSteps.map((s, i) => (
            <div key={i} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-lg)', padding: '22px 18px', textAlign: 'center',
              boxShadow: 'var(--sh-sm)', transition: 'var(--ease)',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.boxShadow = 'var(--sh-md)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'var(--sh-sm)'; }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: 'rgba(208,2,27,0.08)', border: '2px solid rgba(208,2,27,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--red)', margin: '0 auto 14px',
              }}>
                {s.icon}
              </div>
              <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-h)', marginBottom: 8 }}>{s.title}</div>
              <div style={{ color: 'var(--text-m)', fontSize: 12, lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>

        {/* Delivery Zone Table */}
        <div className="section-header" style={{ marginBottom: 20 }}>
          <h2 className="section-title"><span className="title-accent">Delivery Zones & Fees</span></h2>
        </div>
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-lg)', overflow: 'hidden',
          boxShadow: 'var(--sh-sm)', marginBottom: 36,
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 130px 160px',
            padding: '12px 20px',
            background: 'linear-gradient(90deg, rgba(12,45,107,0.06), rgba(208,2,27,0.06))',
            borderBottom: '2px solid var(--border)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-m)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Zone</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-m)', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Fee</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-m)', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>Timeline</div>
          </div>
          {deliveryZones.map((z, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1fr 130px 160px',
              padding: '14px 20px', alignItems: 'center',
              borderBottom: i < deliveryZones.length - 1 ? '1px solid var(--border)' : 'none',
              background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)',
              transition: 'background 0.15s',
            }}>
              <div style={{ fontSize: 13, color: 'var(--text-h)', fontWeight: 600 }}>{z.zone}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: z.feeColor, textAlign: 'center' }}>{z.fee}</div>
              <div style={{ fontSize: 12, color: 'var(--text-m)', textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 5 }}>
                <Clock size={11} /> {z.time}
              </div>
            </div>
          ))}
        </div>

        {/* Important Notes */}
        <div style={{
          background: 'rgba(240,184,0,0.06)', border: '1.5px solid rgba(240,184,0,0.28)',
          borderRadius: 'var(--r-lg)', padding: '22px 24px', marginBottom: 32,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <AlertCircle size={18} color="#8B6914" />
            <span style={{ fontWeight: 800, fontSize: 15, color: '#8B6914' }}>Important Delivery Notes</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              'Large or heavy items (refrigerators, washing machines, air conditioners) may incur additional charges due to size, weight, or fragility. You will be informed before dispatch.',
              'Our delivery team will always call you before arriving to confirm your address and availability.',
              'Please inspect all items carefully before signing the delivery acknowledgement.',
              'Deliveries are made Monday to Saturday, 8am–6pm.',
              'Same-day delivery may be available for in-stock items ordered before 12pm within Port Harcourt. Contact us to confirm.',
            ].map((note, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8B6914', marginTop: 7, flexShrink: 0 }} />
                <span style={{ color: 'var(--text-b)', fontSize: 13, lineHeight: 1.7 }}>{note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(208,2,27,0.05), rgba(12,45,107,0.05))',
          border: '1.5px solid var(--border)', borderRadius: 'var(--r-xl)',
          padding: '32px', textAlign: 'center', boxShadow: 'var(--sh-sm)',
        }}>
          <Truck size={30} color="var(--red)" style={{ margin: '0 auto 14px' }} />
          <h3 style={{ fontFamily: 'var(--font2)', fontWeight: 900, fontSize: 20, color: 'var(--text-h)', marginBottom: 8 }}>Questions About Your Delivery?</h3>
          <p style={{ color: 'var(--text-m)', marginBottom: 20, fontSize: 14 }}>Our team is happy to help with delivery estimates, scheduling, or special arrangements.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/track-order"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--red)', color: '#fff', padding: '12px 24px', borderRadius: 'var(--r-md)', fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>
              <Package size={14} /> Track Your Order
            </Link>
            <a href="tel:+2348165929400"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1.5px solid var(--border)', color: 'var(--text-h)', padding: '12px 24px', borderRadius: 'var(--r-md)', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
              <Phone size={14} /> Call Us
            </a>
          </div>
        </div>

      </div>
    </>
  );
}
