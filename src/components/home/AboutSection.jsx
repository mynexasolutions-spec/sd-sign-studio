export default function AboutSection({ theme }) {
  const isLight = theme === 'light'

  return (
    <section className="about-section" id="about" style={{ background: isLight ? '#ffffff' : 'var(--black)', padding: isLight ? '60px 24px' : '120px 24px' }}>
      <div className="about-inner">
        <div className="about-image-wrap">
          <div className="about-circle"></div>
          <img className="about-img" src="/images/about_company.png" alt="SD Sign Studio Vehicle Wrap" />
          <div className="about-badge" style={{ borderColor: isLight ? '#ffffff' : 'var(--black)' }}>
            <span className="about-badge-num">10</span>
            <span className="about-badge-text">Years Of<br/>Experience</span>
          </div>
        </div>
        
        <div>
          <div className="about-eyebrow" style={isLight ? {
            background: 'rgba(232,0,13,0.06)',
            borderColor: 'rgba(232,0,13,0.12)',
            color: 'var(--red)'
          } : {}}>About Company</div>
          <h2 className="about-heading" style={{ color: isLight ? '#111827' : 'var(--white)' }}>
            Wrap, Sign, Print: Your Journey to <span className="red">Brand Brilliance</span> Begins Here
          </h2>
          <p className="about-desc" style={{ color: isLight ? '#374151' : 'rgba(255,255,255,0.7)' }}>
            Welcome to SD Sign Studio – Your go-to experts for vehicle graphics, car wraps and printing services in Glasgow and the surrounding areas. With over 10 years of experience, we specialize in transforming your ideas into captivating designs for outdoor signage, vehicle livery, branding, and custom workwear.
          </p>
          
          <div className="about-bullets">
            <div className="about-bullet">
              <div className="about-bullet-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                </svg>
              </div>
              <p style={{ color: isLight ? '#374151' : 'rgba(255,255,255,0.8)' }}>Our commitment to precision, creativity, and quality ensures your brand stands out, leaving a lasting impression.</p>
            </div>
            <div className="about-bullet">
              <div className="about-bullet-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                </svg>
              </div>
              <p style={{ color: isLight ? '#374151' : 'rgba(255,255,255,0.8)' }}>Whether you're a company, fleet owner, franchise, or sports club, SD Sign Studio is your partner for personalized and impactful visual solutions.</p>
            </div>
          </div>
          
          <a href="#services" className="btn-red">Explore Services</a>
        </div>
      </div>
    </section>
  )
}
