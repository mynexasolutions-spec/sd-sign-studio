import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import CtaBand from '../components/home/CtaBand'

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedImage, setSelectedImage] = useState(null)
  const [services, setServices] = useState([])
  const [galleryItems, setGalleryItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    async function loadData() {
      try {
        const [srvRes, galRes] = await Promise.all([
          supabase.from('services').select('title'),
          supabase.from('gallery').select('*')
        ])
        
        if (srvRes.data) {
          // Unique services titles
          const titles = Array.from(new Set(srvRes.data.map(s => s.title)))
          setServices(titles)
        }
        if (galRes.data) {
          setGalleryItems(galRes.data)
        }
      } catch (err) {
        console.error("Failed to load gallery:", err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredItems = activeTab === 'all'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeTab)

  return (
    <>
      <div style={{ background: '#fff', minHeight: '100vh' }}>
        {/* Banner */}
        <div className="shop-banner">
          <div className="shop-banner-inner">
            <h1 style={{ fontFamily: 'serif', fontWeight: 600 }}>Our Gallery</h1>
            <p>Explore some of our recent vehicle wraps, storefront installations, and print projects.</p>
            <div className="shop-breadcrumb" style={{ justifyContent: 'center', marginTop: '16px', color: 'rgba(255,255,255,0.7)' }}>
              <Link to="/" style={{ color: 'rgba(255,255,255,0.7)' }}>Home</Link>
              <span className="sep" style={{ color: 'rgba(255,255,255,0.3)' }}>/</span>
              <span style={{ color: '#fff' }}>Gallery</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ maxWidth: '1200px', margin: '48px auto 0', padding: '0 24px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '30px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: activeTab === 'all' ? 'var(--red)' : '#f3f4f6',
              color: activeTab === 'all' ? '#fff' : '#374151',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              border: '1.5px solid',
              borderColor: activeTab === 'all' ? 'var(--red)' : '#e5e7eb'
            }}
          >
            All Work
          </button>
          
          {services.map(title => (
            <button
              key={title}
              onClick={() => setActiveTab(title)}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '30px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: activeTab === title ? 'var(--red)' : '#f3f4f6',
                color: activeTab === title ? '#fff' : '#374151',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                border: '1.5px solid',
                borderColor: activeTab === title ? 'var(--red)' : '#e5e7eb'
              }}
            >
              {title}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div style={{ maxWidth: '1200px', margin: '40px auto 120px', padding: '0 24px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--text-light)', padding: '60px' }}>Loading gallery...</div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              {filteredItems.map(item => (
                <div
                   key={item.id}
                   onClick={() => setSelectedImage(item)}
                   style={{
                     borderRadius: '12px',
                     overflow: 'hidden',
                     background: '#ffffff',
                     border: '1.5px solid #e5e7eb',
                     cursor: 'pointer',
                     transition: 'all 0.3s ease',
                     position: 'relative'
                   }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.transform = 'translateY(-4px)'
                     e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)'
                     const img = e.currentTarget.querySelector('img')
                     if (img) img.style.transform = 'scale(1.04)'
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.transform = ''
                     e.currentTarget.style.boxShadow = ''
                     const img = e.currentTarget.querySelector('img')
                     if (img) img.style.transform = ''
                   }}
                >
                  <div style={{ overflow: 'hidden', position: 'relative', aspectRatio: '4/3' }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(232,0,13,0.1)',
                      opacity: 0,
                      transition: 'opacity 0.2s'
                    }} className="hover-overlay" />
                  </div>
                  
                  <div style={{ padding: '16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {item.category}
                    </span>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', marginTop: '4px', marginBottom: '0' }}>
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
              {filteredItems.length === 0 && (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-light)', padding: '60px 0' }}>
                  No showcase items found for this category yet.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Lightbox Zoom Modal */}
        {selectedImage && (
          <div
            onClick={() => setSelectedImage(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(5,5,5,0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 999999,
              padding: '24px'
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{ position: 'relative', maxWidth: '900px', width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <button
                onClick={() => setSelectedImage(null)}
                style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '0',
                  background: 'none',
                  border: 'none',
                  color: '#fff',
                  fontSize: '32px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                &times;
              </button>
              
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.8)' }}
              />
              
              <div style={{ textAlign: 'center', color: '#fff' }}>
                <span style={{ fontSize: '12px', color: 'var(--red)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {selectedImage.category}
                </span>
                <h4 style={{ fontSize: '18px', fontWeight: 700, margin: '4px 0 0' }}>{selectedImage.title}</h4>
              </div>
            </div>
          </div>
        )}

        <CtaBand />
      </div>
    </>
  )
}
