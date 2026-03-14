import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  IoCallOutline, IoMailOutline, IoLocationOutline,
  IoLogoWhatsapp, IoSend, IoPulseOutline, IoShieldCheckmarkOutline,
  IoCheckmarkCircle
} from 'react-icons/io5';
import API from '../../api/axiosConfig';
import { useSiteTheme } from '../../context/ThemeContext';

const S = `
  @keyframes spin { to { transform: rotate(360deg); } }

  .contact-page {
    min-height: 100vh;
    width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
  }

  .cx {
    width: 100%;
    padding-left:  clamp(20px, 6vw, 100px);
    padding-right: clamp(20px, 6vw, 100px);
    box-sizing: border-box;
  }

  .contact-grid {
    display: grid;
    grid-template-columns: 340px 1fr;
    gap: 48px;
    align-items: start;
    width: 100%;
  }

  .c-input {
    width: 100%;
    border-radius: 14px;
    padding: 14px 18px;
    font-size: 13px;
    font-weight: 500;
    outline: none;
    transition: border-color 0.25s, box-shadow 0.25s;
    box-sizing: border-box;
    font-family: inherit;
  }
  .c-input:focus {
    box-shadow: 0 0 0 4px rgba(59,130,246,0.10);
  }

  .c-label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.22em;
    display: block;
    margin-bottom: 8px;
    padding-left: 2px;
  }

  .info-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 18px;
    border-radius: 20px;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .info-card:hover { transform: translateY(-2px); }

  .submit-btn {
    width: 100%;
    padding: 17px 0;
    border-radius: 14px;
    font-weight: 700;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.3s ease;
    font-family: inherit;
  }
  .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  @media (max-width: 900px) {
    .contact-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 560px) {
    .form-row { grid-template-columns: 1fr; }
  }
`;

const Contact = () => {
  const formRef = useRef();
  const [status, setStatus] = useState('idle');
  const { siteTheme } = useSiteTheme();

  const HERO_IMAGE_URL    = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000";
  const INSTITUTION_EMAIL = "paulmikimensah@gmail.com";
  const MAP_EMBED_URL     = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.186348637775!2d-10.758414524269158!3d6.265532593723145!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10d1000624f28525%3A0x7707e059f3376f9d!2sSt.%20Joseph's%20Catholic%20Hospital!5e0!3m2!1sen!2slr!4v1700000000000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    const formData = {
      name:    formRef.current.user_name.value,
      email:   formRef.current.user_email.value,
      subject: formRef.current.subject.value,
      message: formRef.current.message.value,
    };
    try {
      const { data } = await API.post('/inquiries/send-inquiry', formData);
      if (data.success) {
        setStatus('success');
        toast.success('Inquiry saved in our clinical records!');
        formRef.current.reset();
        setTimeout(() => setStatus('idle'), 4000);
      }
    } catch (error) {
      setStatus('error');
      toast.error(error.response?.data?.message || 'Server connection failed.');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const submitBg = () => {
    if (status === 'success') return '#1d4ed8';
    if (status === 'error')   return '#1e3a8a';
    if (status === 'sending') return siteTheme.siteAccent;
    return siteTheme.siteBtnBg;
  };

  return (
    <>
      <style>{S}</style>

      <div className="contact-page" style={{ background: siteTheme.siteBg, transition: 'background 0.5s ease' }}>

        {/* HERO */}
        <section style={{ position: 'relative', height: '40vh', width: '100%', overflow: 'hidden' }}>
          <img
            src={HERO_IMAGE_URL} alt="SJCH"
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.75)' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, ${siteTheme.siteBg}, transparent 60%)` }} />
          <div className="cx" style={{ position: 'absolute', bottom: 36, left: 0, right: 0 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: siteTheme.siteCard, backdropFilter: 'blur(12px)', padding: '1.75rem 2rem', borderRadius: 36, boxShadow: siteTheme.siteShadow, display: 'inline-block', border: `1px solid ${siteTheme.siteBorder}` }}
            >
              <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 900, color: siteTheme.siteText, letterSpacing: '-0.03em', textTransform: 'uppercase', margin: 0 }}>
                Contact <span style={{ color: siteTheme.siteAccent }}>SJCH</span>
              </h1>
              <p style={{ color: siteTheme.siteMuted, fontWeight: 600, marginTop: 6, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontStyle: 'italic', marginBottom: 0 }}>
                <IoPulseOutline style={{ color: siteTheme.siteAccent }} /> Monrovia's Clinical Gateway
              </p>
            </motion.div>
          </div>
        </section>

        {/* BODY */}
        <div className="cx" style={{ paddingTop: '4rem', paddingBottom: '5rem' }}>
          <div className="contact-grid">

            {/* LEFT */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', color: siteTheme.siteAccent, marginBottom: 4 }}>
                Direct Contact
              </p>

              {[
                { icon: <IoCallOutline />,     title: 'Emergency Line', value: '+231 770 000 000'   },
                { icon: <IoMailOutline />,     title: 'Email Desk',     value: INSTITUTION_EMAIL    },
                { icon: <IoLogoWhatsapp />,    title: 'WhatsApp',       value: 'Immediate Response' },
                { icon: <IoLocationOutline />, title: 'Location',       value: 'Old Road, Congo Town' },
              ].map(item => (
                <div key={item.title} className="info-card"
                  style={{ background: siteTheme.siteCard, border: `1px solid ${siteTheme.siteBorder}`, boxShadow: siteTheme.siteShadow }}>
                  <div style={{ width: 42, height: 42, background: siteTheme.siteAltBg, color: siteTheme.siteAccent, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: 9, fontWeight: 700, color: siteTheme.siteMuted, textTransform: 'uppercase', letterSpacing: '0.2em', margin: 0 }}>{item.title}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: siteTheme.siteText, margin: 0 }}>{item.value}</p>
                  </div>
                </div>
              ))}

              <div style={{ padding: '1.4rem 1.5rem', background: siteTheme.siteDarkBg, borderRadius: 28, marginTop: 8, boxShadow: siteTheme.siteShadow }}>
                <IoShieldCheckmarkOutline size={26} style={{ marginBottom: 10, color: siteTheme.siteAccent }} />
                <h4 style={{ fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', color: siteTheme.siteDarkText, marginBottom: 6 }}>Data Privacy</h4>
                <p style={{ fontSize: 12, fontWeight: 500, color: siteTheme.siteDarkMuted, lineHeight: 1.7, margin: 0 }}>
                  Your clinical inquiry is saved to our secure hospital database and encrypted for your protection.
                </p>
              </div>

              <div style={{ borderRadius: 28, overflow: 'hidden', boxShadow: siteTheme.siteShadow, border: `1px solid ${siteTheme.siteBorder}`, height: 190, marginTop: 4 }}>
                <iframe src={MAP_EMBED_URL} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="SJCH Location" />
              </div>
            </div>

            {/* RIGHT */}
            <div style={{ background: siteTheme.siteCard, borderRadius: 48, padding: '2.5rem 2.5rem 2rem', boxShadow: siteTheme.siteShadow, border: `1px solid ${siteTheme.siteBorder}`, transition: 'background 0.5s ease' }}>
              <h2 style={{ fontSize: 'clamp(1.3rem,2.5vw,1.9rem)', fontWeight: 900, color: siteTheme.siteText, letterSpacing: '-0.02em', marginBottom: 6 }}>
                Clinical Inquiry Form
              </h2>
              <p style={{ color: siteTheme.siteMuted, fontSize: 13, marginBottom: 28 }}>
                Fill out the details below to reach our administrative office.
              </p>

              <form ref={formRef} onSubmit={handleSubmit}>
                <div className="form-row" style={{ marginBottom: 20 }}>
                  <div>
                    <label className="c-label" style={{ color: siteTheme.siteMuted }}>Patient / Full Name</label>
                    <input className="c-input" name="user_name" type="text" required placeholder="Jane Smith"
                      style={{ background: siteTheme.siteInputBg, border: `1.5px solid ${siteTheme.siteInputBorder}`, color: siteTheme.siteText }} />
                  </div>
                  <div>
                    <label className="c-label" style={{ color: siteTheme.siteMuted }}>Contact Email</label>
                    <input className="c-input" name="user_email" type="email" required placeholder="you@example.com"
                      style={{ background: siteTheme.siteInputBg, border: `1.5px solid ${siteTheme.siteInputBorder}`, color: siteTheme.siteText }} />
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label className="c-label" style={{ color: siteTheme.siteMuted }}>Clinical Unit</label>
                  <select name="subject" className="c-input"
                    style={{ background: siteTheme.siteInputBg, border: `1.5px solid ${siteTheme.siteInputBorder}`, color: siteTheme.siteText, cursor: 'pointer' }}>
                    <option value="General Support">General Support</option>
                    <option value="Appointments">Appointments</option>
                    <option value="Laboratory">Laboratory & Diagnostics</option>
                    <option value="Billing">Billing & Insurance</option>
                    <option value="Emergency">Emergency Inquiry</option>
                  </select>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label className="c-label" style={{ color: siteTheme.siteMuted }}>Message</label>
                  <textarea name="message" rows={5} required placeholder="Tell us how we can help…" className="c-input"
                    style={{ background: siteTheme.siteInputBg, border: `1.5px solid ${siteTheme.siteInputBorder}`, color: siteTheme.siteText, resize: 'none', borderRadius: 20 }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: siteTheme.siteAltBg, borderRadius: 14, padding: '12px 16px', marginBottom: 20 }}>
                  <IoShieldCheckmarkOutline size={17} style={{ color: siteTheme.siteAccent, flexShrink: 0, marginTop: 1 }} />
                  <p style={{ fontSize: 11, color: siteTheme.siteMuted, lineHeight: 1.6, margin: 0 }}>
                    We accept Medicare, NHIS, and 100+ private insurance plans. Bring your card to your appointment.
                  </p>
                </div>

                <button type="submit" disabled={status !== 'idle'} className="submit-btn"
                  style={{ background: submitBg(), color: '#fff', boxShadow: status === 'idle' ? siteTheme.siteShadow : 'none' }}>
                  {status === 'idle'    && <><IoSend size={15} /> Send to Hospital Database</>}
                  {status === 'sending' && <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />}
                  {status === 'success' && <><IoCheckmarkCircle size={18} /> Message Recorded</>}
                  {status === 'error'   && 'System Error — Try Again'}
                </button>

                <p style={{ textAlign: 'center', fontSize: 11, color: siteTheme.siteMuted, marginTop: 14, lineHeight: 1.6 }}>
                  By submitting you agree to our&nbsp;
                  <span style={{ color: siteTheme.siteAccent, cursor: 'pointer', fontWeight: 600 }}>Privacy Policy</span>.
                  &nbsp;Your data is encrypted.
                </p>
              </form>
            </div>

          </div>
        </div>

      </div>
    </>
  );
};

export default Contact;