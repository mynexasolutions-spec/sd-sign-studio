import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getHeroSettings } from '../../data/heroService'

const toTitleCase = (str) =>
  str.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())

const isVideoUrl = (url) => {
  if (!url) return false
  return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg') || url.includes('video')
}

export default function HeroSection() {
  const [settings, setSettings] = useState(getHeroSettings())
  const [activeMode, setActiveMode] = useState(() => sessionStorage.getItem('hero_active_mode') || 'video')
  const [currentSlide, setCurrentSlide] = useState(() => {
    const saved = sessionStorage.getItem('hero_slide_index')
    return saved ? parseInt(saved, 10) : 0
  })
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const videoRefs = useRef([])
  const touchStartX = useRef(null)

  useEffect(() => {
    const handleUpdate = () => setSettings(getHeroSettings())
    window.addEventListener('hero-settings-updated', handleUpdate)
    return () => window.removeEventListener('hero-settings-updated', handleUpdate)
  }, [])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => { sessionStorage.setItem('hero_active_mode', activeMode) }, [activeMode])
  useEffect(() => { sessionStorage.setItem('hero_slide_index', currentSlide.toString()) }, [currentSlide])

  useEffect(() => {
    const hasVideo = !!settings.videoUrl
    const hasSlides = settings.slides && settings.slides.length > 0

    if (hasVideo && hasSlides) {
      if (activeMode === 'video') {
        const timer = setTimeout(() => { setActiveMode('slideshow'); setCurrentSlide(0) }, 7000)
        return () => clearTimeout(timer)
      } else {
        const timer = setInterval(() => {
          setCurrentSlide(prev => {
            if (prev >= settings.slides.length - 1) { setActiveMode('video'); return 0 }
            return prev + 1
          })
        }, 3000)
        return () => clearInterval(timer)
      }
    } else if (hasVideo) {
      setActiveMode('video')
    } else if (hasSlides) {
      setActiveMode('slideshow')
    }
  }, [activeMode, settings.videoUrl, settings.slides])

  useEffect(() => {
    if (activeMode === 'video') {
      videoRefs.current[0]?.play().catch(() => {})
    } else {
      videoRefs.current[currentSlide + 1]?.play().catch(() => {})
    }
  }, [settings.videoUrl, currentSlide, activeMode])

  const handleNext = () => {
    if (activeMode === 'slideshow' && settings.slides?.length > 1) {
      setCurrentSlide(prev => (prev + 1) % settings.slides.length)
    }
  }
  const handlePrev = () => {
    if (activeMode === 'slideshow' && settings.slides?.length > 1) {
      setCurrentSlide(prev => (prev - 1 + settings.slides.length) % settings.slides.length)
    }
  }

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext(); else handlePrev()
    }
  }

  const activeHeadline = activeMode === 'video'
    ? (settings.videoHeadline || settings.headline || "We design, print, and install your brand everywhere.")
    : ((settings.slides?.[currentSlide]?.headline) || settings.slideshowHeadline || settings.headline || "We design, print, and install your brand everywhere.")

  const activeSubheadline = activeMode === 'video'
    ? (settings.videoSubheadline || settings.subheadline || "Glasgow's premier vehicle wrapping, storefront signage, and custom print fabrication agency. Built to make your brand unmissable.")
    : ((settings.slides?.[currentSlide]?.description || settings.slides?.[currentSlide]?.caption) || settings.slideshowSubheadline || settings.subheadline || "Glasgow's premier vehicle wrapping, storefront signage, and custom print fabrication agency. Built to make your brand unmissable.")

  const slides = settings.slides || []
  const totalMobileSlides = (settings.videoUrl ? 1 : 0) + slides.length
  const mobileSlideIndex = activeMode === 'video' ? 0 : (settings.videoUrl ? currentSlide + 1 : currentSlide)

  // ── MOBILE LAYOUT ──────────────────────────────────────────────
  if (isMobile) {
    return (
      <section id="hero" style={{ background: '#ffffff', display: 'flex', flexDirection: 'column', paddingTop: 'var(--nav-h)' }}>

        {/* Media card — padded with rounded corners like EV Nation */}
        <div style={{ padding: '16px 16px 0' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              borderRadius: '20px',
              overflow: 'hidden',
              height: '54vw',
              minHeight: '200px',
              maxHeight: '300px',
              background: '#111'
            }}
          >
            {/* Transparent swipe-capture overlay — sits above video so touch events aren't eaten by the video element */}
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              style={{ position: 'absolute', inset: 0, zIndex: 10 }}
            />

            {/* Video */}
            {settings.videoUrl && (
              <video
                ref={el => videoRefs.current[0] = el}
                src={settings.videoUrl}
                autoPlay muted loop playsInline
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                  opacity: activeMode === 'video' ? 1 : 0,
                  transition: 'opacity 0.8s ease',
                  zIndex: activeMode === 'video' ? 1 : 0
                }}
              />
            )}

            {/* Slides */}
            {slides.map((slide, idx) => {
              const mediaUrl = slide.image || slide
              const active = activeMode === 'slideshow' && idx === currentSlide
              return isVideoUrl(mediaUrl) ? (
                <video
                  key={'m-vid-' + idx}
                  ref={el => videoRefs.current[idx + 1] = el}
                  src={mediaUrl}
                  autoPlay muted loop playsInline
                  style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                    opacity: active ? 1 : 0, transition: 'opacity 0.8s ease', zIndex: active ? 1 : 0
                  }}
                />
              ) : (
                <img
                  key={'m-img-' + idx}
                  src={mediaUrl}
                  alt=""
                  style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                    opacity: active ? 1 : 0, transition: 'opacity 0.8s ease', zIndex: active ? 1 : 0
                  }}
                />
              )
            })}
          </div>
        </div>

        {/* Slide dots */}
        {totalMobileSlides > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '7px', padding: '10px 0 0' }}>
            {Array.from({ length: totalMobileSlides }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === mobileSlideIndex ? '22px' : '7px',
                  height: '7px',
                  borderRadius: '4px',
                  background: i === mobileSlideIndex ? 'var(--red)' : 'rgba(0,0,0,0.15)',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        )}

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '16px 20px 20px' }}>

          {/* Eyebrow badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(232,0,13,0.07)', border: '1px solid rgba(232,0,13,0.2)',
            color: 'var(--red)', borderRadius: '20px', padding: '5px 14px',
            fontSize: '10px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase',
            marginBottom: '14px', alignSelf: 'flex-start'
          }}>
            ⚡ Signage &amp; Wrapping Studio
          </div>

          {/* Headline — dark, bold, title case */}
          <h1 style={{
            fontWeight: 900,
            color: '#0a0a0a',
            fontSize: 'clamp(34px, 10vw, 50px)',
            lineHeight: 1.05,
            letterSpacing: '-2px',
            margin: '0 0 12px',
            fontFamily: 'var(--font)'
          }}>
            {toTitleCase(activeHeadline)}
          </h1>

          {/* Subheadline — spacing scales with text length */}
          <p style={{ fontSize: '14px', color: 'rgba(0,0,0,0.55)', lineHeight: 1.65, marginBottom: activeSubheadline.length > 100 ? '20px' : '14px' }}>
            {activeSubheadline}
          </p>

          {/* Buttons — stacked full width */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/quote" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '100%', padding: '15px', borderRadius: '10px',
              background: 'var(--red)', color: '#fff',
              fontSize: '13px', fontWeight: 800, letterSpacing: '1.5px',
              textDecoration: 'none', textTransform: 'uppercase',
              boxShadow: '0 4px 16px rgba(232,0,13,0.25)'
            }}>
              Get a Free Quote
            </Link>
            <Link to="/gallery" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '100%', padding: '15px', borderRadius: '10px',
              border: '1.5px solid rgba(0,0,0,0.15)', color: '#0a0a0a',
              fontSize: '13px', fontWeight: 800, letterSpacing: '1.5px',
              textDecoration: 'none', textTransform: 'uppercase', background: 'transparent'
            }}>
              View Our Work
            </Link>
          </div>
        </div>

      </section>
    )
  }

  // ── DESKTOP LAYOUT ─────────────────────────────────────────────
  return (
    <section className="hero" id="hero" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 'var(--nav-h)', paddingBottom: '0px', background: 'var(--black)' }}>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(to right, var(--red), #ff4d4d, var(--red))', zIndex: 10 }} />

      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 0, overflow: 'hidden' }}>
        {settings.videoUrl && (
          <video
            ref={el => videoRefs.current[0] = el}
            src={settings.videoUrl}
            autoPlay muted loop playsInline
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
              opacity: activeMode === 'video' ? 0.65 : 0,
              transition: 'opacity 1s ease-in-out',
              zIndex: activeMode === 'video' ? 1 : 0
            }}
          />
        )}

        {slides.map((slide, idx) => {
          const mediaUrl = slide.image || slide
          const active = activeMode === 'slideshow' && idx === currentSlide
          return isVideoUrl(mediaUrl) ? (
            <video
              key={'bg-vid-' + idx}
              ref={el => videoRefs.current[idx + 1] = el}
              src={mediaUrl}
              autoPlay muted loop playsInline
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                opacity: active ? 0.65 : 0, transition: 'opacity 1s ease-in-out', zIndex: active ? 1 : 0
              }}
            />
          ) : (
            <img
              key={'bg-img-' + idx}
              src={mediaUrl}
              alt=""
              style={{
                position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
                opacity: active ? 0.65 : 0, transition: 'opacity 1s ease-in-out', zIndex: active ? 1 : 0
              }}
            />
          )
        })}
      </div>

      <div className="hero-slide" style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', minHeight: 'auto', background: 'transparent', width: '100%' }}>
        <div className="hero-overlay" style={{ background: 'rgba(10, 10, 10, 0.6)' }} />

        <div className="hero-content" style={{ height: '88vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', maxWidth: '800px', margin: '0 auto', width: '100%', padding: '12px 10px' }}>
          <div className="hero-eyebrow" style={{ background: 'rgba(232,0,13,0.12)', border: '1px solid rgba(232,0,13,0.3)', color: 'var(--red)', margin: '0 0 20px' }}>
            Signage &amp; Wrapping Studio
          </div>
          <h1 className="hero-headline" style={{ fontWeight: 900, color: 'var(--white)', fontSize: 'clamp(40px, 5.5vw, 64px)', lineHeight: '1.1', letterSpacing: '-1.5px', margin: '16px 0 24px' }}>
            {activeHeadline}
          </h1>
          <p className="hero-sub" style={{ fontSize: '18px', color: 'var(--white)', maxWidth: '640px', marginBottom: '36px', lineHeight: 1.6 }}>
            {activeSubheadline}
          </p>
          <div className="hero-btns" style={{ display: 'flex', gap: '16px', marginBottom: '0', justifyContent: 'center' }}>
            <Link to="/quote" className="btn-red" style={{ boxShadow: '0 4px 12px rgba(232,0,13,0.3)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              Get a Free Quote
            </Link>
            <Link to="/gallery" className="btn-outline" style={{ border: '2px solid rgba(255,255,255,0.2)', color: 'var(--white)' }}>
              View Our Work
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
