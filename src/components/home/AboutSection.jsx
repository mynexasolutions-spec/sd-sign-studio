export default function AboutSection({ theme }) {
  const isLight = theme === 'light'

  return (
    <section className="about-section" id="about" style={{ background: isLight ? '#ffffff' : 'var(--black)', padding: isLight ? '60px 24px' : '120px 24px' }}>
      <div className="about-inner">
        <div className="about-image-wrap">
          <div className="about-circle"></div>
          <img className="about-img" src="/images/about-company.webp" alt="SD Sign Studio Vehicle Wrap" />

        </div>

        <div>
          <div className="about-eyebrow" style={isLight ? {
            background: 'rgba(232,0,13,0.06)',
            borderColor: 'rgba(232,0,13,0.12)',
            color: 'var(--red)'
          } : {}}>About Company</div>
          <h2 className="about-heading" style={{ color: isLight ? '#111827' : 'var(--white)' }}>
            Sign, Print & Brand: Your Brand’s Journey to <span className="red">Stand-Out Visibility</span> Begins Here
          </h2>
          <p className="about-desc" style={{ color: isLight ? '#374151' : 'rgba(255,255,255,0.7)', marginBottom: '16px' }}>
            Welcome to <strong>SD Sign Studio</strong> — your London-based specialists in professional signage, vehicle branding and print solutions. We help businesses turn their ideas into eye-catching signs, branded vehicles and high-quality promotional materials.
          </p>
          <p className="about-desc" style={{ color: isLight ? '#374151' : 'rgba(255,255,255,0.7)' }}>
            With a focus on <strong>quality, precision and creative design</strong>, we deliver complete visual branding solutions for businesses across London — from shopfront signage and 3D lettering to van sign writing, window graphics and printed materials.
          </p>

          <div className="about-bullets">
            <div className="about-bullet">
              <div className="about-bullet-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                </svg>
              </div>
              <p style={{ color: isLight ? '#374151' : 'rgba(255,255,255,0.8)' }}>
                <strong>Vehicle Branding</strong><br/>
                We create high-quality signage and vehicle branding designed to make your business look professional and get noticed.
              </p>
            </div>
            <div className="about-bullet">
              <div className="about-bullet-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                </svg>
              </div>
              <p style={{ color: isLight ? '#374151' : 'rgba(255,255,255,0.8)' }}>
                <strong>Design, Manufacture & Installation</strong><br/>
                From the initial design to final installation, we provide complete sign solutions under one roof.
              </p>
            </div>
          </div>

          <p className="about-desc" style={{ color: isLight ? '#374151' : 'rgba(255,255,255,0.7)', fontStyle: 'italic', marginTop: '-12px' }}>
            Whether you're a business owner, fleet operator, contractor or organisation, SD Sign Studio is your partner for professional and impactful visual branding.
          </p>

          <a href="#services" className="btn-red">Explore Services</a>
        </div>
      </div>
    </section>
  )
}
