import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, Mail, MapPin, CreditCard, Building2 } from 'lucide-react';
import { FaFacebook, FaInstagram, FaWhatsapp, FaYoutube, FaTiktok } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">

          {/* Brand column */}
          <div className="footer-brand">
            <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none', marginBottom:12 }}>
              <div style={{ width:46, height:46, background:'#fff', borderRadius:6, overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', padding:3 }}>
                <img src="/smartchoice-logo.jpeg" alt="Smart Choice" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
              </div>
              <div style={{ display:'flex', flexDirection:'column', lineHeight:1.2 }}>
                <span style={{ fontFamily:'var(--font-display)', fontSize:17, fontWeight:900 }}>
                  <span style={{ color:'var(--red)' }}>Smart</span><span style={{ color:'#7BAFFF' }}>Choice</span>
                </span>
                <span style={{ fontSize:9, color:'rgba(255,255,255,0.5)', letterSpacing:'0.6px', textTransform:'uppercase' }}>Global Resources Ltd</span>
              </div>
            </Link>

            <p>
              Smart Choice Global Resources Ltd — Port Harcourt's trusted distributor
              of modern furniture, Firman hybrid inverters, ECO-FLOW inverters, air conditioners,
              freezers, refrigerators, washing machines and home appliances. 100% genuine products guaranteed.
            </p>

            {/* Bank details */}
            <div style={{ marginTop:16, padding:'12px 14px', background:'rgba(255,255,255,0.07)', borderRadius:6, border:'1px solid rgba(255,255,255,0.12)' }}>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.55)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:5 }}>Direct Bank Transfer / POS</div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:18, fontWeight:900, color:'#fff', letterSpacing:'1.5px' }}>8682287868</div>
              <div style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.9)', marginTop:2 }}>SMART CHOICE GLOBAL RESOURCES LTD</div>
              <div style={{ fontSize:12, fontWeight:800, color:'#F0B800', marginTop:3 }}>Sterling Bank POS</div>
            </div>

            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook"><FaFacebook size={16} /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Instagram"><FaInstagram size={16} /></a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="TikTok"><FaTiktok size={16} /></a>
              <a href="https://wa.me/2348165929400" target="_blank" rel="noopener noreferrer"
                className="social-link" aria-label="WhatsApp Support 37 NTA Road"
                title="WhatsApp 37 NTA Road Plaza"
                style={{ background:'rgba(37,211,102,0.15)', borderColor:'rgba(37,211,102,0.3)', color:'#25D366' }}>
                <FaWhatsapp size={16} />
              </a>
              <a href="https://wa.me/2348165896158" target="_blank" rel="noopener noreferrer"
                className="social-link" aria-label="WhatsApp Support 71 NTA MTN Road"
                title="WhatsApp 71 NTA MTN Road"
                style={{ background:'rgba(37,211,102,0.15)', borderColor:'rgba(37,211,102,0.3)', color:'#25D366' }}>
                <FaWhatsapp size={16} />
              </a>
              <a href="#" className="social-link" aria-label="YouTube"><FaYoutube size={16} /></a>
            </div>
          </div>

          {/* Products */}
          <div>
            <div className="footer-col-title">Our Products</div>
            <div className="footer-links">
              <Link to="/shop?dept=Modern%20Furniture">Modern Furniture</Link>
              <Link to="/shop?dept=Inverters%20%26%20Solar">Firman Hybrid Inverters</Link>
              <Link to="/shop?dept=Inverters%20%26%20Solar">ECO-FLOW Inverters</Link>
              <Link to="/shop?dept=Air%20Conditioners">Air Conditioners</Link>
              <Link to="/shop?dept=Freezers">Chest &amp; Deep Freezers</Link>
              <Link to="/shop?dept=Refrigerators">Refrigerators</Link>
              <Link to="/shop?dept=Washing%20Machines">Washing Machines</Link>
              <Link to="/shop?dept=Televisions%20%26%20Home%20Audio">Smart Televisions</Link>
              <Link to="/shop?dept=Kitchen%20%26%20Home%20Appliances">Kitchen Appliances</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <div className="footer-col-title">Customer Support</div>
            <div className="footer-links">
              <Link to="/shop">Track Your Order</Link>
              <Link to="/shop">Payment Methods</Link>
              <Link to="/shop">Delivery in Port Harcourt</Link>
              <Link to="/shop">Warranty Policy</Link>
              <Link to="/shop">Inverter Installation Guide</Link>
              <Link to="/shop">FAQ</Link>
              <a href="mailto:smartchoiceglobalresourcesltd@gmail.com">Email Support</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="footer-col-title">Contact Us</div>

            <div className="footer-contact-item">
              <span className="footer-contact-icon"><PhoneCall size={16} /></span>
              <div className="footer-contact-text">
                <strong>Call Support</strong>
                <a href="tel:+2348165929400">+234 816 592 9400</a><br />
                <a href="tel:+2348165896158">+234 816 589 6158</a><br />
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.6)' }}>Mon – Sat: 8am – 8pm</span>
              </div>
            </div>

            <div className="footer-contact-item">
              <span className="footer-contact-icon" style={{ color:'#25D366' }}><FaWhatsapp size={16} /></span>
              <div className="footer-contact-text">
                <strong>WhatsApp Support</strong>
                <a href="https://wa.me/2348165929400" target="_blank" rel="noopener noreferrer"
                  style={{ color:'#25D366', display:'block', marginBottom:2 }}>
                  💬 37 NTA Road: +234 816 592 9400
                </a>
                <a href="https://wa.me/2348165896158" target="_blank" rel="noopener noreferrer"
                  style={{ color:'#25D366', display:'block' }}>
                  💬 71 NTA MTN Road: +234 816 589 6158
                </a>
              </div>
            </div>

            <div className="footer-contact-item">
              <span className="footer-contact-icon"><Mail size={16} /></span>
              <div className="footer-contact-text">
                <strong>Email</strong>
                <a href="mailto:smartchoiceglobalresourcesltd@gmail.com" style={{ fontSize:12, wordBreak:'break-all' }}>
                  smartchoiceglobalresourcesltd@gmail.com
                </a>
              </div>
            </div>

            <div className="footer-contact-item">
              <span className="footer-contact-icon"><Building2 size={16} /></span>
              <div className="footer-contact-text">
                <strong>Branch Store</strong>
                Smart choice plaza<br />
                37 NTA ROAD MGBUOBA PORTHARCOURT RIVERS STATE
              </div>
            </div>

            <div className="footer-contact-item">
              <span className="footer-contact-icon"><MapPin size={16} /></span>
              <div className="footer-contact-text">
                <strong>Main Store</strong>
                71 NTA Road Mgbuoba (MTN Road),<br />
                Port Harcourt, Rivers State
              </div>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            © 2026 <span>Smart Choice Global Resources Ltd</span>. All rights reserved. Port Harcourt, Nigeria.
          </div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
            <span className="payment-badge" style={{ color:'#F0B800', borderColor:'rgba(240,184,0,0.4)', background:'rgba(240,184,0,0.1)', fontWeight:700 }}>Sterling Bank POS</span>
            <span className="payment-badge" style={{ display:'flex', alignItems:'center', gap:4 }}><CreditCard size={11} /> Bank Transfer</span>
            <span className="payment-badge" style={{ display:'flex', alignItems:'center', gap:4 }}><CreditCard size={11} /> Visa</span>
            <span className="payment-badge" style={{ display:'flex', alignItems:'center', gap:4 }}><CreditCard size={11} /> Mastercard</span>
            <span className="payment-badge" style={{ display:'flex', alignItems:'center', gap:4 }}><CreditCard size={11} /> Paystack</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
