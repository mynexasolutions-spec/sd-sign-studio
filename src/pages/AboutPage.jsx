import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import AboutSection from '../components/home/AboutSection'
import CtaBand from '../components/home/CtaBand'

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div className="shop-banner">
        <div className="shop-banner-inner">
          <h1 style={{ fontFamily: 'serif', fontWeight: 600 }}>About Us</h1>
          <p>Learn more about SD Sign Studio and our commitment to quality.</p>
          <div className="shop-breadcrumb" style={{ justifyContent: 'center', marginTop: '16px', color: 'rgba(255,255,255,0.7)' }}>
            <Link to="/" style={{ color: 'rgba(255,255,255,0.7)' }}>Home</Link>
            <span className="sep" style={{ color: 'rgba(255,255,255,0.3)' }}>/</span>
            <span style={{ color: '#fff' }}>About Us</span>
          </div>
        </div>
      </div>

      {/* Reusing Home About Section */}
      <AboutSection theme="light" />

      {/* Additional Professional Content - Premium Reddish Light Section */}
      <div style={{ background: '#fff6f6', padding: '90px 24px', borderTop: '1.5px solid rgba(232,0,13,0.15)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
            
            <div 
              style={{ background: '#ffffff', padding: '48px 40px', borderRadius: '20px', border: '1.5px solid #e5e7eb', borderTop: '4px solid var(--red)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(232,0,13,0.05)'
                e.currentTarget.style.borderColor = 'rgba(232,0,13,0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = ''
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.03)'
                e.currentTarget.style.borderColor = '#e5e7eb'
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(232,0,13,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--black)', marginBottom: '14px' }}>Our Mission</h3>
              <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: 1.7, margin: 0 }}>
                At SD Sign Studio, our mission is to empower businesses with bold, high-quality visual branding. We believe that a strong first impression is the cornerstone of success, and we strive to provide innovative print and signage solutions that make our clients unforgettable.
              </p>
            </div>

            <div 
              style={{ background: '#ffffff', padding: '48px 40px', borderRadius: '20px', border: '1.5px solid #e5e7eb', borderTop: '4px solid var(--red)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(232,0,13,0.05)'
                e.currentTarget.style.borderColor = 'rgba(232,0,13,0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = ''
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.03)'
                e.currentTarget.style.borderColor = '#e5e7eb'
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(232,0,13,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--black)', marginBottom: '14px' }}>Quality Craftsmanship</h3>
              <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: 1.7, margin: 0 }}>
                We don't cut corners. From premium Hexis wrap materials for vehicles to weather-resistant outdoor signs, our production process utilizes state-of-the-art technology to ensure durability, vivid colors, and a flawless finish every single time.
              </p>
            </div>

            <div 
              style={{ background: '#ffffff', padding: '48px 40px', borderRadius: '20px', border: '1.5px solid #e5e7eb', borderTop: '4px solid var(--red)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(232,0,13,0.05)'
                e.currentTarget.style.borderColor = 'rgba(232,0,13,0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = ''
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.03)'
                e.currentTarget.style.borderColor = '#e5e7eb'
              }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(232,0,13,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--black)', marginBottom: '14px' }}>Customer First</h3>
              <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: 1.7, margin: 0 }}>
                Our clients are at the heart of everything we do. With over a decade of experience, our dedicated team offers expert guidance from initial design concepts to the final installation. Your satisfaction and business growth are our ultimate rewards.
              </p>
            </div>

          </div>
        </div>
      </div>

      <CtaBand />
    </div>
  )
}
