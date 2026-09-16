import { useState, useEffect } from 'react'
import ContactForm from './ContactForm'

export default function QuoteModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleOpen = () => setIsOpen(true)
    window.addEventListener('open-quote-modal', handleOpen)

    return () => window.removeEventListener('open-quote-modal', handleOpen)
  }, [])

  useEffect(() => {
    const twoMinutes = 2 * 60 * 1000
    const now = Date.now()

    let firstVisit = sessionStorage.getItem('sd_first_visit')
    if (!firstVisit) {
      firstVisit = now.toString()
      sessionStorage.setItem('sd_first_visit', firstVisit)
    }

    const elapsed = now - parseInt(firstVisit, 10)
    const alreadyShown = sessionStorage.getItem('sd_popup_shown')

    let timerId
    if (!alreadyShown) {
      if (elapsed >= twoMinutes) {
        setIsOpen(true)
        sessionStorage.setItem('sd_popup_shown', 'true')
      } else {
        timerId = setTimeout(() => {
          setIsOpen(true)
          sessionStorage.setItem('sd_popup_shown', 'true')
        }, twoMinutes - elapsed)
      }
    }

    return () => {
      if (timerId) clearTimeout(timerId)
    }
  }, [])

  // Once dismissed, never auto-show again this session — regardless of
  // how it was opened (timer or the open-quote-modal event).
  const closeModal = () => {
    sessionStorage.setItem('sd_popup_shown', 'true')
    setIsOpen(false)
  }

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      onClick={closeModal}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        animation: 'fadeIn 0.2s ease-out',
        padding: '16px',
        boxSizing: 'border-box'
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoomIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .modal-card::-webkit-scrollbar { width: 6px; }
        .modal-card::-webkit-scrollbar-thumb { background: var(--gray2); border-radius: 3px; }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-card"
        style={{
          background: 'var(--gray)',
          borderRadius: '16px',
          padding: 'clamp(20px, 5vw, 36px)',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          position: 'relative',
          border: '1.5px solid var(--gray2)',
          animation: 'zoomIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'var(--gray2)',
            color: 'var(--text-light)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
          onMouseEnter={(e) => { e.target.style.background = 'var(--red)'; e.target.style.color = '#fff' }}
          onMouseLeave={(e) => { e.target.style.background = 'var(--gray2)'; e.target.style.color = 'var(--text-light)' }}
        >
          &times;
        </button>

        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text)', margin: '0 0 6px', fontFamily: 'var(--font)' }}>
            Get a Free Quote
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-light)', margin: 0 }}>
            Submit details of your signage or wrap requirements and attach design mockups.
          </p>
        </div>

        <ContactForm onSuccess={closeModal} />
      </div>
    </div>
  )
}
