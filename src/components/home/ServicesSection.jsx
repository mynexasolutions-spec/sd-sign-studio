import { useNavigate } from 'react-router-dom'
import { Star } from 'lucide-react'
import { STATIC_SERVICES, slugify, getServiceIcon } from '../../data/services'
import { useServices } from '../../hooks/useServices'

export default function ServicesSection() {
  const services = useServices()
  const navigate = useNavigate()

  const openService = (title) => navigate(`/services/${slugify(title)}`)

  return (
    <section className="full-services-section" id="services">
      <div className="section-inner">
        <div className="section-header" style={{ marginBottom: '32px' }}>
          <span className="section-eyebrow">What We Do</span>
          <h2 className="section-title">Professional <span className="red">Signage &amp; Van Branding</span></h2>
        </div>
        <div className="services-intro">
          <p>We specialise in custom signage and professional van branding that helps your business stand out. From eye-catching vehicle graphics to shop signs, 3D lettering and illuminated signage, we bring your brand to life.</p>
          <p>Quality design, premium materials and professional installation — everything you need to make your business impossible to miss.</p>
        </div>

        <div className="services-grid">
          {(services?.length ? services : STATIC_SERVICES).map((srv, i) => {
            const Icon = getServiceIcon(srv.title)
            const isNewProductImage = srv.image?.includes('/images/NewProducts/')
            return (
              <article
                className={`srv-card${isNewProductImage ? ' srv-card--new' : ''}`}
                key={srv.id || i}
                onClick={() => openService(srv.title)}
              >
                <div className="srv-media">
                  <img className="srv-img" src={srv.image} alt={srv.title} loading="lazy" />
                  {srv.popular && (
                    <span className="srv-popular" aria-hidden="true">
                      <Star size={12} fill="currentColor" strokeWidth={0} />
                      Popular
                    </span>
                  )}
                  <span className="srv-badge" aria-hidden="true">
                    <Icon size={22} strokeWidth={2} />
                  </span>
                </div>
                <div className="srv-content">
                  <h3 className="srv-title">{srv.title}</h3>
                  <p className="srv-desc">{srv.short_description || srv.description}</p>
                  <span className="btn-red" style={{ alignSelf: 'flex-start', padding: '10px 20px', fontSize: '14px' }}>
                    Explore Service
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
