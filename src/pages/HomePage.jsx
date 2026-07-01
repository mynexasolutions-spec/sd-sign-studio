import { useEffect } from 'react'
import HeroSection from '../components/home/HeroSection'
import CategoriesSection from '../components/home/CategoriesSection'
import AboutSection from '../components/home/AboutSection'
import FeaturedWork from '../components/home/FeaturedWork'
import ServicesSection from '../components/home/ServicesSection'
import ProcessSection from '../components/home/ProcessSection'
import CtaBand from '../components/home/CtaBand'
import WhyChooseUs from '../components/home/WhyChooseUs'
import TestimonialsSection from '../components/home/TestimonialsSection'
import ContactForm from '../components/ContactForm'

export default function HomePage() {
  useEffect(() => {
    // Show pop up contact form after 6 seconds (every time user visits home page)
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('open-quote-modal'))
    }, 6000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <CategoriesSection />
      <FeaturedWork />
      <WhyChooseUs />
      <ProcessSection />
      <TestimonialsSection />
      
      {/* Home Page Contact Form Section */}
      <section className="section" id="contact" style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #121212 100%)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="section-inner" style={{ maxWidth: '800px' }}>
          <div className="section-header" style={{ marginBottom: '44px' }}>
            <span className="section-eyebrow" style={{ background: 'rgba(232,0,13,0.12)', border: '1px solid rgba(232,0,13,0.3)', color: 'var(--red)' }}>Get a Quote</span>
            <h2 className="section-title" style={{ color: '#ffffff' }}>Request a Free <span className="red">Consultation</span></h2>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', marginTop: '8px', lineHeight: 1.6 }}>
              Fill out the form below, upload your logo or design assets, and our Glasgow team will compile a custom pricing estimate within 24 hours.
            </p>
          </div>

          <div style={{
            background: 'var(--gray)',
            padding: 'clamp(20px, 5vw, 40px)',
            borderRadius: '24px',
            border: '1.5px solid rgba(255,255,255,0.05)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}>
            <ContactForm isHome={true} theme="dark" />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  )
}
