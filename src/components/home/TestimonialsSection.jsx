import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const MOCK_REVIEWS = [
  { id: 'mock1', name: 'James Morrison', company: 'Apex Logistics', rating: 5, text: 'The fleet wrap they did for our delivery vans is absolutely top tier. Extremely professional design and clean installation.' },
  { id: 'mock2', name: 'Sarah Jenkins', company: 'The Coffee Nook', rating: 5, text: 'Designed and fabricated our main storefront sign. The 3D illuminated letters look premium and stand out in the street.' },
  { id: 'mock3', name: 'Robert C.', company: 'Glasgow Auto Group', rating: 5, text: 'Outstanding service and quick turnaround. The vehicle decals are high quality and have survived heavy pressure washing.' },
  { id: 'mock4', name: 'Emily Watson', company: 'FitZone Studio', rating: 5, text: 'Custom window frosting and wall prints turned out perfectly. They helped us with design ideas and the fitters were brilliant.' }
]

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [itemsPerPage, setItemsPerPage] = useState(3)
  const [startIndex, setStartIndex] = useState(0)
  
  // Review Modal State
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', role: '', company: '', rating: 5, text: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function loadReviews() {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
        
        if (!error && data && data.length > 0) {
          setReviews(data)
        } else {
          setReviews(MOCK_REVIEWS)
        }
      } catch (err) {
        console.error("Testimonial fetch error:", err)
        setReviews(MOCK_REVIEWS)
      } finally {
        setLoading(false)
      }
    }
    loadReviews()
  }, [])

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
    if (startIndex < reviews.length - itemsPerPage) {
      setStartIndex(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(prev => prev - 1)
    }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.text) {
      alert("Name and Review Text are required.")
      return
    }
    setSubmitting(true)
    try {
      const { error } = await supabase.from('testimonials').insert([{
        name: form.name,
        role: form.role,
        company: form.company,
        rating: form.rating,
        text: form.text,
        is_active: false // Approval pending
      }])

      if (error) throw error

      alert("Thank you for your feedback! Your review has been submitted for admin approval.")
      setShowModal(false)
      setForm({ name: '', role: '', company: '', rating: 5, text: '' })
    } catch (err) {
      console.error("Submit review error:", err)
      alert("Failed to submit review: " + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  return (
    <section className="section" id="testimonials" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fff5f5 100%)', borderTop: '1px solid #fecaca', borderBottom: '1px solid #fecaca', padding: '90px 0', overflow: 'hidden' }}>
      <div className="section-inner" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', position: 'relative' }}>
        
        {/* Centered Header */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '56px', paddingLeft: '80px', paddingRight: '80px' }}>
          <span className="section-eyebrow" style={{ background: 'rgba(232,0,13,0.06)', border: '1px solid rgba(232,0,13,0.12)', color: 'var(--red)', borderRadius: '20px', padding: '6px 14px', fontSize: '11px', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px', display: 'inline-block' }}>
            Reviews &amp; Testimonials
          </span>
          <h2 className="section-title" style={{ fontSize: 'clamp(40px, 5.5vw, 64px)', fontWeight: 900, color: '#111827', lineHeight: 1.15, margin: '0 0 20px', letterSpacing: '-1.5px' }}>
            What Our Customers <span className="red" style={{ color: 'var(--red)' }}>Say About Us</span>
          </h2>
          <button 
            onClick={() => setShowModal(true)} 
            className="btn-red" 
            style={{ 
              padding: '10px 20px', 
              fontSize: '13px', 
              borderRadius: '8px', 
              fontWeight: 700, 
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(232,0,13,0.15)',
              marginTop: '8px'
            }}
          >
            Write a Review
          </button>

          {/* Navigation Arrows positioned on the right */}
          {reviews.length > itemsPerPage && (
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
                disabled={startIndex >= reviews.length - itemsPerPage} 
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
                  opacity: startIndex >= reviews.length - itemsPerPage ? 0.3 : 1,
                  pointerEvents: startIndex >= reviews.length - itemsPerPage ? 'none' : 'auto'
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

          {/* Sliding Carousel Viewport */}
          <div style={{ overflow: 'hidden', margin: '0 -12px', padding: '12px 12px 24px 12px' }}>
            <div style={{
            display: 'flex',
            gap: '24px',
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: `translateX(calc(-${startIndex} * (100% + 24px) / ${itemsPerPage}))`
          }}>
            {reviews.map((rev, i) => (
              <div
                key={rev.id || i}
                style={{
                  flex: `0 0 calc((100% - ${(itemsPerPage - 1) * 24}px) / ${itemsPerPage})`,
                  background: '#ffffff',
                  padding: '32px',
                  borderRadius: '16px',
                  border: '1.5px solid #e5e7eb',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                  boxSizing: 'border-box'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.borderColor = 'rgba(232,0,13,0.3)'
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(232,0,13,0.06)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = ''
                  e.currentTarget.style.borderColor = '#e5e7eb'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.02)'
                }}
              >
                {/* Quote Mark */}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  fontSize: '64px',
                  fontFamily: 'serif',
                  lineHeight: 1,
                  color: 'rgba(232,0,13,0.08)',
                  pointerEvents: 'none',
                  userSelect: 'none'
                }}>
                  &ldquo;
                </div>

                <div>
                  {/* Rating stars */}
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', color: '#f59e0b', fontSize: '18px' }}>
                    {"★".repeat(rev.rating || 5)}
                  </div>
                  
                  <p style={{
                    fontSize: '15px',
                    color: '#4b5563',
                    lineHeight: 1.6,
                    fontStyle: 'italic',
                    marginBottom: '24px',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    "{rev.text || rev.content}"
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--red)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '14px',
                    flexShrink: 0
                  }}>
                    {rev.name?.[0] || 'C'}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#111827', margin: '0 0 2px' }}>
                      {rev.name}
                    </h4>
                    {(rev.company || rev.role) && (
                      <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>
                        {rev.role ? `${rev.role}, ` : ''}{rev.company || ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      </div>

      {/* Write a Review Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '500px',
            padding: '32px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            border: '1px solid #e5e7eb',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#6b7280',
                fontWeight: 'bold'
              }}
            >
              &times;
            </button>

            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', marginBottom: '8px', letterSpacing: '-0.5px' }}>
              Write a Customer Review
            </h3>
            <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>
              Your feedback helps us continuously improve our custom wraps and signage.
            </p>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Your Name *</label>
                <input 
                  type="text" 
                  required 
                  value={form.name} 
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. John Smith" 
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Role / Title</label>
                  <input 
                    type="text" 
                    value={form.role} 
                    onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))}
                    placeholder="e.g. Director" 
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Company</label>
                  <input 
                    type="text" 
                    value={form.company} 
                    onChange={e => setForm(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="e.g. Apex Ltd" 
                    style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Rating</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      type="button" 
                      key={star} 
                      onClick={() => setForm(prev => ({ ...prev, rating: star }))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '28px', color: star <= form.rating ? '#f59e0b' : '#d1d5db', padding: 0 }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Review Text *</label>
                <textarea 
                  required 
                  rows={4}
                  value={form.text} 
                  onChange={e => setForm(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Share your experience with our quality, timing, and service..." 
                  style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn-red"
                  style={{ 
                    flex: 1, 
                    padding: '12px', 
                    fontSize: '14px', 
                    borderRadius: '8px', 
                    fontWeight: 700, 
                    cursor: 'pointer',
                    opacity: submitting ? 0.7 : 1
                  }}
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  style={{ 
                    padding: '12px 20px', 
                    border: '1.5px solid #e5e7eb', 
                    borderRadius: '8px', 
                    background: '#fff', 
                    fontSize: '14px', 
                    fontWeight: 700, 
                    color: '#374151', 
                    cursor: 'pointer' 
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
