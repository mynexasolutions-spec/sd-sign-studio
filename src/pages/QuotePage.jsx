import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import ContactForm from '../components/ContactForm'

export default function QuotePage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div style={{ background: 'linear-gradient(to bottom, #ffffff 0%, #fff8f8 100%)', minHeight: '100vh', paddingTop: 'calc(var(--nav-h) + 40px)', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ 
            fontSize: '11px', 
            fontWeight: 800, 
            color: 'var(--red)', 
            textTransform: 'uppercase', 
            letterSpacing: '2px',
            padding: '6px 14px',
            borderRadius: '20px',
            background: 'rgba(232,0,13,0.08)',
            border: '1px solid rgba(232,0,13,0.15)',
            display: 'inline-block',
            marginBottom: '16px'
          }}>
            Booking &amp; Quotes
          </span>
          <h1 style={{ fontSize: 'clamp(40px, 5.5vw, 64px)', fontWeight: 900, color: '#111827', margin: '0 0 12px', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
            Request a Free <span style={{ color: 'var(--red)' }}>Estimate</span>
          </h1>
          <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: 1.6, margin: 0, maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto' }}>
            Provide your vehicle specifications, storefront details, or upload print artwork and our Glasgow team will compile a custom estimate.
          </p>

          {/* Trust badges */}
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#4b5563' }}>
              <span style={{ color: 'var(--red)', fontSize: '14px', fontWeight: 'bold' }}>✓</span> 100% Free Consultation
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#4b5563' }}>
              <span style={{ color: 'var(--red)', fontSize: '14px', fontWeight: 'bold' }}>✓</span> 24h Turnaround Estimate
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#4b5563' }}>
              <span style={{ color: 'var(--red)', fontSize: '14px', fontWeight: 'bold' }}>✓</span> Premium Hexis &amp; 3M Vinyl
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div style={{
          background: '#ffffff',
          padding: 'clamp(20px, 5vw, 40px)',
          borderRadius: '24px',
          border: '1.5px solid #e5e7eb',
          borderTop: '4px solid var(--red)',
          boxShadow: '0 15px 40px rgba(0,0,0,0.03)'
        }}>
          <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '20px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', margin: 0 }}>Project Consultation Form</h3>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0', lineHeight: 1.4 }}>Fill out the details below to receive a custom design and estimate from our Glasgow specialists.</p>
          </div>
          <ContactForm isHome={false} theme="light" />
        </div>

      </div>
    </div>
  )
}
