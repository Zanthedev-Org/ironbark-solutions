import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Save, Plus, Trash2, Settings as SettingsIcon, LayoutTemplate, MessageSquare, Upload, Loader2, Truck, AlertTriangle, RotateCcw } from 'lucide-react';
import { uploadImage } from '../../utils/cloudinaryService';

const DEFAULT_DELIVERY_NOTICE = "This item may incur additional delivery charges due to its size, weight, or fragility.";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  const [deliveryFee, setDeliveryFee] = useState(7000);
  const [deliveryNoticeTemplate, setDeliveryNoticeTemplate] = useState(DEFAULT_DELIVERY_NOTICE);

  const [tickerMessages, setTickerMessages] = useState([
    "⚡ Best Deals on Electronics & Home Appliances — Limited Offers, Shop Now!",
    "🚚 Enjoy Fast Delivery Across Lagos — Free Shipping on Orders From ₦999,999!"
  ]);

  const [heroSlides, setHeroSlides] = useState([
    {
      title: "Upgrade Your Living Space",
      subtitle: "Premium Air Conditioners, Televisions, and Home Appliances from world-class brands.",
      buttonText: "Shop Appliances",
      link: "/shop",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=1920&q=80"
    }
  ]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'settings', 'site_settings'));
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.tickerMessages) setTickerMessages(data.tickerMessages);
          if (data.heroSlides) setHeroSlides(data.heroSlides);
          if (data.deliveryFee !== undefined) setDeliveryFee(Number(data.deliveryFee) || 7000);
          if (data.deliveryNoticeTemplate) setDeliveryNoticeTemplate(data.deliveryNoticeTemplate);
        }
      } catch (e) {
        showToast('Failed to load settings from Firestore', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'site_settings'), {
        tickerMessages,
        heroSlides,
        deliveryFee: Number(deliveryFee) || 7000,
        deliveryNoticeTemplate: deliveryNoticeTemplate.trim() || DEFAULT_DELIVERY_NOTICE,
        updatedAt: new Date()
      }, { merge: true });
      showToast('Site settings saved successfully!');
    } catch (e) {
      showToast('Failed to save settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateSlide = (idx, field, val) => {
    const arr = [...heroSlides];
    arr[idx][field] = val;
    setHeroSlides(arr);
  };

  const handleImageUpload = async (idx, file) => {
    if (!file) return;
    try {
      showToast('Uploading image...', 'info');
      const url = await uploadImage(file);
      updateSlide(idx, 'image', url);
      showToast('Image uploaded successfully!');
    } catch {
      showToast('Upload failed', 'error');
    }
  };

  const inputStyle = {
    width: '100%',
    background: 'var(--bg)',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--r-sm)',
    padding: '10px 14px',
    fontSize: '13px',
    color: 'var(--text-h)',
    outline: 'none',
    fontFamily: 'var(--font)',
    transition: 'var(--ease)',
  };
  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 800,
    color: 'var(--text-m)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '6px',
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '80px' }}><Loader2 className="spinner" size={48} color="var(--primary)" /></div>;

  return (
    <div>
      {/* Toast */}
      {toast.show && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 9999, background: toast.type === 'error' ? 'rgba(255,61,0,0.15)' : toast.type === 'info' ? 'rgba(0,176,255,0.15)' : 'rgba(0,230,118,0.15)', border: `1px solid ${toast.type === 'error' ? 'var(--danger)' : toast.type === 'info' ? 'var(--info)' : 'var(--success)'}`, color: toast.type === 'error' ? '#ff8066' : toast.type === 'info' ? 'var(--info)' : 'var(--success)', padding: '12px 20px', borderRadius: 'var(--radius-sm)', fontWeight: 700, fontSize: '14px', backdropFilter: 'blur(8px)', animation: 'fadeIn 0.2s ease' }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font2)', fontSize: '26px', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-h)' }}>
            <SettingsIcon size={24} color="var(--red)" /> Site Settings
          </h1>
          <p style={{ color: 'var(--text-m)', fontSize: '13px', marginTop: '4px' }}>Manage ticker messages, hero slides, delivery fee and popup template.</p>
        </div>
        <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--red)', color: '#fff', padding: '12px 24px', borderRadius: 'var(--r-md)', fontWeight: 800, fontSize: '14px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', boxShadow: 'var(--sh-red)', transition: 'var(--ease)' }}>
          {saving ? <><Loader2 className="spinner" size={18} /> Saving...</> : <><Save size={18} /> Save Settings</>}
        </button>
      </div>

      <div className="admin-settings-layout">
        {/* Left Column: Delivery & Ticker */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Delivery Configuration */}
          <div style={{ background: 'var(--dark-card)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
            <div style={{ borderBottom: '1px solid var(--dark-border)', paddingBottom: '16px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px', color: 'var(--primary)' }}>
                <Truck size={18} /> Delivery & Surcharge Notice
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--gray-1)', margin: 0 }}>
                Configure storewide base delivery fee and the popup template for heavy/bulky/fragile products.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={labelStyle}>Standard Delivery Fee (₦)</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-1)', fontWeight: 700, fontSize: '14px' }}>₦</span>
                  <input
                    type="number"
                    value={deliveryFee}
                    onChange={e => setDeliveryFee(Number(e.target.value) || 0)}
                    placeholder="7000"
                    style={{ ...inputStyle, paddingLeft: '34px' }}
                  />
                </div>
                <span style={{ fontSize: '11px', color: 'var(--gray-2)', marginTop: '4px', display: 'block' }}>
                  Standard checkout delivery charge across eligible areas (Default: ₦7,000).
                </span>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ ...labelStyle, margin: 0 }}>Special Delivery Popup Template</label>
                  <button
                    type="button"
                    onClick={() => setDeliveryNoticeTemplate(DEFAULT_DELIVERY_NOTICE)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
                  >
                    <RotateCcw size={11} /> Reset to Default
                  </button>
                </div>
                <textarea
                  value={deliveryNoticeTemplate}
                  onChange={e => setDeliveryNoticeTemplate(e.target.value)}
                  placeholder="Enter notice template..."
                  rows={3}
                  style={{ ...inputStyle, minHeight: '75px', resize: 'vertical', lineHeight: 1.5 }}
                />
                <span style={{ fontSize: '11px', color: 'var(--gray-2)', marginTop: '4px', display: 'block' }}>
                  This template is displayed in the popup at checkout for products marked with sizing, weight, or fragility criteria.
                </span>
              </div>

              {/* Live Preview */}
              <div style={{ background: 'rgba(208,2,27,0.04)', border: '1px solid rgba(208,2,27,0.2)', borderRadius: 'var(--r-sm)', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--red)', marginBottom: '8px', letterSpacing: '0.08em' }}>
                  <AlertTriangle size={14} /> Checkout Popup Preview
                </div>
                <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--r-sm)', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <span style={{ background: 'rgba(208,2,27,0.1)', color: 'var(--red)', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '12px', textTransform: 'uppercase' }}>
                      Delivery Notice
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-m)' }}>Standard Fee: ₦{Number(deliveryFee).toLocaleString()}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-b)', lineHeight: 1.5 }}>
                    "{deliveryNoticeTemplate || DEFAULT_DELIVERY_NOTICE}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ticker Messages */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '24px', boxShadow: 'var(--sh-sm)' }}>
            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px', color: 'var(--text-h)' }}><MessageSquare size={16} color="var(--red)" /> Announcement Ticker</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-m)', margin: 0 }}>Scrolling messages shown at the very top of the site.</p>
              <button onClick={() => setTickerMessages([...tickerMessages, ""])} style={{ marginTop: '16px', width: '100%', padding: '10px', background: 'var(--bg)', border: '1.5px dashed var(--border)', color: 'var(--text-b)', borderRadius: 'var(--r-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, transition: 'var(--ease)' }}>
                <Plus size={14} /> Add Message
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tickerMessages.map((msg, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <textarea value={msg} onChange={e => { const a = [...tickerMessages]; a[idx] = e.target.value; setTickerMessages(a); }} placeholder="Enter ticker message..." style={{ ...inputStyle, minHeight: '60px', resize: 'vertical', paddingRight: '40px' }} />
                  <button onClick={() => setTickerMessages(tickerMessages.filter((_, i) => i !== idx))} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,61,0,0.1)', color: 'var(--danger)', border: 'none', width: '24px', height: '24px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Remove">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {tickerMessages.length === 0 && <div style={{ textAlign: 'center', padding: '24px', border: '1.5px dashed var(--border)', borderRadius: 'var(--r-sm)', color: 'var(--text-m)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>No messages added</div>}
            </div>
          </div>
        </div>

        {/* Hero Slides */}
        <div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '24px', boxShadow: 'var(--sh-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 4px', color: 'var(--text-h)' }}><LayoutTemplate size={16} color="var(--red)" /> Hero Carousel</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-m)', margin: 0 }}>Add slides for the homepage banner (Max 5).</p>
              </div>
              <button onClick={() => { if (heroSlides.length >= 5) return showToast('Max 5 slides allowed', 'error'); setHeroSlides([...heroSlides, { title: '', subtitle: '', buttonText: '', link: '', image: '' }]); }} style={{ padding: '8px 16px', background: 'rgba(208,2,27,0.08)', color: 'var(--red)', border: '1px solid rgba(208,2,27,0.25)', borderRadius: 'var(--r-xl)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <Plus size={14} /> Add Slide ({heroSlides.length}/5)
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {heroSlides.map((slide, idx) => (
                <div key={idx} style={{ border: '1px solid var(--border)', borderRadius: 'var(--r-md)', overflow: 'hidden', marginBottom: '4px' }}>
                  <div style={{ padding: '12px 16px', background: 'var(--bg)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '11px', fontWeight: 800, color: 'var(--text-m)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Slide #{idx + 1}</h4>
                    <button onClick={() => setHeroSlides(heroSlides.filter((_, i) => i !== idx))} style={{ background: 'transparent', border: 'none', color: 'var(--red)', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Trash2 size={12} /> Delete Slide
                    </button>
                  </div>

                  <div className="responsive-grid-2" style={{ padding: '20px', gap: '20px' }}>
                    <div>
                      <label style={labelStyle}>Headline</label>
                      <input value={slide.title} onChange={e => updateSlide(idx, 'title', e.target.value)} placeholder="e.g. Upgrade Your Space" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Image (Upload)</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input value={slide.image} onChange={e => updateSlide(idx, 'image', e.target.value)} placeholder="https://..." style={inputStyle} />
                        <label style={{ background: 'var(--dark)', border: '1px solid var(--dark-border)', borderRadius: 'var(--radius-sm)', padding: '0 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Upload Image">
                          <Upload size={16} color="var(--gray-1)" />
                          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleImageUpload(idx, e.target.files[0])} />
                        </label>
                      </div>
                    </div>
                    <div className="grid-span-2">
                      <label style={labelStyle}>Subtitle</label>
                      <textarea value={slide.subtitle} onChange={e => updateSlide(idx, 'subtitle', e.target.value)} placeholder="Brief description..." style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} />
                    </div>
                    <div>
                      <label style={labelStyle}>Button Text</label>
                      <input value={slide.buttonText} onChange={e => updateSlide(idx, 'buttonText', e.target.value)} placeholder="e.g. Shop Now" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Button Link URL</label>
                      <input value={slide.link} onChange={e => updateSlide(idx, 'link', e.target.value)} placeholder="e.g. /shop" style={inputStyle} />
                    </div>
                  </div>

                  {slide.image && (
                    <div style={{ padding: '0 20px 20px' }}>
                      <label style={labelStyle}>Image Preview</label>
                      <div style={{ height: '140px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)', overflow: 'hidden', background: 'var(--bg)' }}>
                        <img src={slide.image} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {heroSlides.length === 0 && <div style={{ textAlign: 'center', padding: '40px', border: '1.5px dashed var(--border)', borderRadius: 'var(--r-md)' }}><LayoutTemplate size={32} color="var(--text-l)" style={{ marginBottom: '12px', margin: '0 auto 12px' }} /><div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-m)', textTransform: 'uppercase' }}>No slides added yet</div></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
