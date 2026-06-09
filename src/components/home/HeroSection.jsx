import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getHeroSettings } from '../../data/heroService'

const isVideoUrl = (url) => {
  if (!url) return false
  return url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.ogg') || url.includes('video')
}

export default function HeroSection() {
  const [settings, setSettings] = useState(getHeroSettings())
  const [activeMode, setActiveMode] = useState(() => {
    return sessionStorage.getItem('hero_active_mode') || 'video'
  })
  const [currentSlide, setCurrentSlide] = useState(() => {
    const saved = sessionStorage.getItem('hero_slide_index')
    return saved ? parseInt(saved, 10) : 0
  })
  const videoRefs = useRef([])

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(getHeroSettings())
    }
    window.addEventListener('hero-settings-updated', handleUpdate)
    return () => window.removeEventListener('hero-settings-updated', handleUpdate)
  }, [])

  useEffect(() => {
    sessionStorage.setItem('hero_active_mode', activeMode)
  }, [activeMode])

  useEffect(() => {
    sessionStorage.setItem('hero_slide_index', currentSlide.toString())
  }, [currentSlide])

  // Sequential switching between video and slideshow
  useEffect(() => {
    const hasVideo = !!settings.videoUrl
    const hasSlides = settings.slides && settings.slides.length > 0

    if (hasVideo && hasSlides) {
      if (activeMode === 'video') {
        const timer = setTimeout(() => {
          setActiveMode('slideshow')
          setCurrentSlide(0)
        }, 7000)
        return () => clearTimeout(timer)
      } else {
        const timer = setInterval(() => {
          setCurrentSlide(prev => {
            if (prev >= settings.slides.length - 1) {
              setActiveMode('video')
              return 0
            }
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

  // Play video background on change
  useEffect(() => {
    if (activeMode === 'video') {
      const activeVideo = videoRefs.current[0]
      if (activeVideo) {
        activeVideo.play().catch(err => {
          console.warn("Video autoplay blocked by browser or failed to load:", err)
        })
      }
    } else {
      const activeVideo = videoRefs.current[currentSlide + 1]
      if (activeVideo) {
        activeVideo.play().catch(err => {
          console.warn("Autoplay failed for active slide video:", err)
        })
      }
    }
  }, [settings.videoUrl, currentSlide, activeMode])

  const activeHeadline = activeMode === 'video'
    ? (settings.videoHeadline || settings.headline || "We design, print, and install your brand everywhere.")
    : (
        (settings.slides?.[currentSlide] && settings.slides[currentSlide].headline) ||
        settings.slideshowHeadline ||
        settings.headline ||
        "We design, print, and install your brand everywhere."
      )

  const activeSubheadline = activeMode === 'video'
    ? (settings.videoSubheadline || settings.subheadline || "Glasgow's premier vehicle wrapping, storefront signage, and custom print fabrication agency. Built to make your brand unmissable.")
    : (
        (settings.slides?.[currentSlide] && (settings.slides[currentSlide].description || settings.slides[currentSlide].caption)) ||
        settings.slideshowSubheadline ||
        settings.subheadline ||
        "Glasgow's premier vehicle wrapping, storefront signage, and custom print fabrication agency. Built to make your brand unmissable."
      )

  return (
    <section className="hero" id="hero" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 'var(--nav-h)', paddingBottom: '0px', background: 'var(--black)' }}>

      {/* Sleek separator line at the bottom of hero */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(to right, var(--red), #ff4d4d, var(--red))', zIndex: 10 }} />

      {/* Background Media - Ambient Loop Video or Slideshow */}
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 0, overflow: 'hidden' }}>
        {settings.videoUrl && (
          <video
            ref={el => videoRefs.current[0] = el}
            src={settings.videoUrl}
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: activeMode === 'video' ? 0.65 : 0,
              transition: 'opacity 1s ease-in-out',
              zIndex: activeMode === 'video' ? 1 : 0
            }}
          />
        )}

        {settings.slides?.map((slide, idx) => {
          const mediaUrl = slide.image || slide
          const isVideo = isVideoUrl(mediaUrl)

          return isVideo ? (
            <video
              key={'bg-vid-' + idx}
              ref={el => videoRefs.current[idx + 1] = el}
              src={mediaUrl}
              autoPlay
              muted
              loop
              playsInline
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: (activeMode === 'slideshow' && idx === currentSlide) ? 0.65 : 0,
                transition: 'opacity 1s ease-in-out',
                zIndex: (activeMode === 'slideshow' && idx === currentSlide) ? 1 : 0
              }}
            />
          ) : (
            <img
              key={'bg-img-' + idx}
              src={mediaUrl}
              alt=""
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: (activeMode === 'slideshow' && idx === currentSlide) ? 0.65 : 0,
                transition: 'opacity 1s ease-in-out',
                zIndex: (activeMode === 'slideshow' && idx === currentSlide) ? 1 : 0
              }}
            />
          )
        })}
      </div>

      <div className="hero-slide" style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', minHeight: 'auto', background: 'transparent', width: '100%' }}>
        {/* Overlay gradient - centered dark screen to see the media clearly */}
        <div className="hero-overlay" style={{ background: 'rgba(10, 10, 10, 0.6)' }}></div>

        <div className="hero-content" style={{ height: '88vh', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '800px', margin: '0 auto', width: '100%', padding: '12px 10px' }}>

          <div className="hero-eyebrow" style={{ background: 'rgba(232,0,13,0.12)', border: '1px solid rgba(232,0,13,0.3)', color: 'var(--red)', margin: '0 0 20px' }}>
            Signage &amp; Wrapping Studio
          </div>
          <h1 className="hero-headline" style={{
            fontWeight: 900,
            color: 'var(--white)',
            fontSize: 'clamp(40px, 5.5vw, 64px)',
            lineHeight: '1.1',
            letterSpacing: '-1.5px',
            margin: '16px 0 24px'
          }}>
            {activeHeadline}
          </h1>
          <p className="hero-sub" style={{
            fontSize: '18px',
            color: 'var(--white)',
            maxWidth: '640px',
            marginBottom: '36px',
            lineHeight: 1.6
          }}>
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
