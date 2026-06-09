import { useState, useEffect } from 'react'
import { getWhyUsSettings } from '../../data/whyUsService'

export default function WhyChooseUs() {
  const [settings, setSettings] = useState(getWhyUsSettings())
  const [itemsPerPage, setItemsPerPage] = useState(3)
  const [startIndex, setStartIndex] = useState(0)

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(getWhyUsSettings())
    }
    window.addEventListener('why-us-settings-updated', handleUpdate)
    return () => window.removeEventListener('why-us-settings-updated', handleUpdate)
  }, [])

  const points = settings.points || []

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1)
      } else if (window.innerWidth < 960) {
        setItemsPerPage(2)
      } else {
        setItemsPerPage(3)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleNext = () => {
    if (startIndex < points.length - itemsPerPage) {
      setStartIndex(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(prev => prev - 1)
    }
  }

  const svgIcons = [
    // 0: Fast & Reliable
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>,
    // 1: Experience
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>,
    // 2: Materials
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>,
    // 3: Designs
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ]

  const fallbackIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )

  return (
    <section className="section" id="why-choose-us" style={{ background: 'linear-gradient(135deg, #fffcfc 0%, #fff5f5 100%)', padding: '90px 0', borderTop: '1px solid #fecaca', borderBottom: '1px solid #fecaca', overflow: 'hidden' }}>
      <div className="section-inner" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative' }}>
        
        {/* Centered Header */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '56px', paddingLeft: '80px', paddingRight: '80px' }}>
          <span style={{ 
            fontSize: '11px', 
            fontWeight: 800, 
            color: 'var(--red)', 
            textTransform: 'uppercase', 
            letterSpacing: '2px',
            padding: '6px 14px',
            borderRadius: '20px',
            background: 'rgba(232,0,13,0.06)',
            border: '1px solid rgba(232,0,13,0.12)',
            marginBottom: '20px',
            display: 'inline-block'
          }}>
            {settings.badge || "Why Partner With Us"}
          </span>
          <h2 style={{ 
            fontSize: 'clamp(40px, 5.5vw, 64px)', 
            fontWeight: 900, 
            color: '#111827', 
            lineHeight: 1.15,
            margin: '0 0 20px',
            letterSpacing: '-1.5px'
          }}>
            {settings.title ? (
              <>
                {settings.title.split(',')[0]}, <span style={{ color: 'var(--red)' }}>{settings.title.split(',')[1] || ''}</span>
              </>
            ) : (
              <>
                Built To Stand Out, <span style={{ color: 'var(--red)' }}>Designed To Last</span>
              </>
            )}
          </h2>
          <p style={{ fontSize: '15px', color: '#4b5563', lineHeight: 1.6, margin: 0, maxWidth: '600px' }}>
            {settings.subtitle || "Glasgow's ultimate sign and wrap fabrication team combining quality materials, elite engineering, and custom graphics."}
          </p>

          {/* Navigation Arrows positioned on the right */}
          {points.length > itemsPerPage && (
            <div style={{ 
              position: itemsPerPage === 1 ? 'static' : 'absolute', 
              right: 0, 
              bottom: 0, 
              display: 'flex', 
              gap: '10px',
              marginTop: itemsPerPage === 1 ? '20px' : 0
            }}>
              <button 
                onClick={handlePrev} 
                disabled={startIndex === 0} 
                style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '50%', 
                  border: '1.5px solid #e5e7eb', 
                  background: '#fff', 
                  color: '#111827', 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  transition: 'all 0.2s', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  opacity: startIndex === 0 ? 0.3 : 1,
                  pointerEvents: startIndex === 0 ? 'none' : 'auto'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--red)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}
              >
                &larr;
              </button>
              <button 
                onClick={handleNext} 
                disabled={startIndex >= points.length - itemsPerPage} 
                style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '50%', 
                  border: '1.5px solid #e5e7eb', 
                  background: '#fff', 
                  color: '#111827', 
                  fontSize: '18px', 
                  fontWeight: 'bold', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  transition: 'all 0.2s', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  opacity: startIndex >= points.length - itemsPerPage ? 0.3 : 1,
                  pointerEvents: startIndex >= points.length - itemsPerPage ? 'none' : 'auto'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--red)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}
              >
                &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Carousel Container */}
        <div style={{ position: 'relative', width: '100%' }}>
          <div style={{ overflow: 'hidden', margin: '0 -12px', padding: '12px 12px 24px 12px' }}>
            <div style={{ 
              display: 'flex', 
              gap: '24px', 
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: `translateX(calc(-${startIndex} * (100% + 24px) / ${itemsPerPage}))`
            }}>
            {points.map((pt, i) => (
              <div
                key={i}
                style={{
                  flex: `0 0 calc((100% - ${(itemsPerPage - 1) * 24}px) / ${itemsPerPage})`,
                  background: '#ffffff',
                  padding: '20px',
                  borderRadius: '16px',
                  border: '1.5px solid #e5e7eb',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  boxSizing: 'border-box'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)'
                  e.currentTarget.style.borderColor = 'rgba(232,0,13,0.4)'
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(232,0,13,0.08)'
                  const iconBox = e.currentTarget.querySelector('.icon-box')
                  if (iconBox) {
                    iconBox.style.background = 'var(--red)'
                    iconBox.style.color = '#fff'
                    iconBox.style.transform = 'scale(1.05)'
                  }
                  const cardImg = e.currentTarget.querySelector('.card-img')
                  if (cardImg) {
                    cardImg.style.transform = 'scale(1.08)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.borderColor = '#e5e7eb'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.02)'
                  const iconBox = e.currentTarget.querySelector('.icon-box')
                  if (iconBox) {
                    iconBox.style.background = 'rgba(255, 255, 255, 0.95)'
                    iconBox.style.color = 'var(--red)'
                    iconBox.style.transform = ''
                  }
                  const cardImg = e.currentTarget.querySelector('.card-img')
                  if (cardImg) {
                    cardImg.style.transform = ''
                  }
                }}
              >
                {/* Image Container with SVG overlay */}
                <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '10px', overflow: 'hidden', marginBottom: '18px', background: '#f3f4f6' }}>
                  <img 
                    className="card-img"
                    src={pt.image} 
                    alt={pt.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} 
                  />
                  <div 
                    className="icon-box"
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '10px',
                      width: '38px',
                      height: '38px',
                      background: 'rgba(255, 255, 255, 0.95)',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                      border: '1px solid rgba(232,0,13,0.15)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--red)',
                      transition: 'all 0.3s ease',
                      zIndex: 2
                    }}
                  >
                    {svgIcons[i] || fallbackIcon}
                  </div>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', marginBottom: '8px', letterSpacing: '-0.5px' }}>
                  {pt.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: 1.5, margin: 0 }}>
                  {pt.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
        </div>

      </div>
    </section>
  )
}
