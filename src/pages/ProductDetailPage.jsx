import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { products as dummyProducts } from '../data/products'
import { useCart } from '../context/CartContext'

const TABS = ['Overview', 'Specifications', 'Why Choose Us']

export default function ProductDetailPage() {
  const { id } = useParams()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [gallery, setGallery] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('Overview')

  useEffect(() => {
    async function fetchProductData() {
      setLoading(true)
      try {
        const { data: prodData, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single()

        if (error || !prodData) throw error
        setProduct({ ...prodData, image: prodData.primary_image, shortDescription: prodData.short_description })

        const { data: galData } = await supabase
          .from('product_images')
          .select('image_url')
          .eq('product_id', id)
        if (galData) setGallery(galData.map(g => g.image_url))

        const { data: relatedData } = await supabase
          .from('products')
          .select('*')
          .eq('category', prodData.category)
          .neq('id', id)
          .limit(3)
        if (relatedData) setRelatedProducts(relatedData.map(p => ({ ...p, image: p.primary_image })))

      } catch {
        const dummyProd = dummyProducts.find(p => p.id.toString() === id)
        if (dummyProd) {
          setProduct({ ...dummyProd, image: dummyProd.img })
          const related = dummyProducts.filter(p => p.category === dummyProd.category && p.id !== dummyProd.id).slice(0, 3)
          setRelatedProducts(related.map(p => ({ ...p, image: p.img })))
        }
      } finally {
        setLoading(false)
      }
    }
    fetchProductData()
  }, [id])

  useEffect(() => { window.scrollTo(0, 0) }, [id])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', fontSize: '16px', color: '#6b7280' }}>
      Loading product…
    </div>
  )

  if (!product) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', fontSize: '16px', color: '#6b7280' }}>
      Product not found.
    </div>
  )

  const whatsappMessage = encodeURIComponent(`Hi, I'm interested in the ${product.name}. Could I get more information?`)
  const whatsappUrl = `https://wa.me/919676112750?text=${whatsappMessage}`
  const descText = product.full_description || product.longDescription || product.description || product.shortDescription || ''

  const allSpecs = [
    { label: 'Category',       value: product.category },
    { label: 'Starting Price', value: `£${Number(product.price).toLocaleString()}` },
    { label: 'Product Type',   value: product.badge },
    { label: 'Material',       value: product.material },
    { label: 'Finish Options', value: product.finish_options },
    { label: 'Durability',     value: product.durability },
    { label: 'Installation',   value: product.installation_info },
    { label: 'Warranty',       value: product.warranty },
    { label: 'Lead Time',      value: product.lead_time },
    { label: 'Custom Design',  value: product.custom_design },
  ]
  const specs = allSpecs.filter(s => s.value)

  const features = [
    "Precision-cut to your vehicle's exact measurements",
    "Air-release adhesive for bubble-free application",
    "UV-resistant inks that won't fade in sunlight",
    "Removable without damaging original paintwork",
    "Available in hundreds of colours and finishes",
    "Full consultation and design service included",
    "Installed by certified, experienced technicians",
    "Complies with UK road vehicle appearance standards",
  ]

  return (
    <div style={{ background: '#fff', minHeight: '100vh', paddingBottom: '100px' }}>

      {/* Breadcrumb */}
      <div className="pd-section" style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px 0' }}>
        <div className="shop-breadcrumb" style={{ margin: 0 }}>
          <Link to="/" style={{ color: '#6b7280' }}>Home</Link>
          <span className="sep" style={{ color: '#d1d5db' }}>/</span>
          <Link to="/shop" style={{ color: '#6b7280' }}>Shop</Link>
          <span className="sep" style={{ color: '#d1d5db' }}>/</span>
          <span style={{ color: '#111' }}>{product.name}</span>
        </div>
      </div>

      {/* ── Main Product Section ── */}
      <div className="pd-grid">

        {/* Left: Image */}
        <div>
          <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', background: '#f5f5f5', border: '1px solid rgba(0,0,0,0.06)', marginBottom: '16px' }}>
            {product.badge && (
              <div className="product-badge" style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '13px', padding: '5px 14px', zIndex: 10 }}>
                {product.badge}
              </div>
            )}
            <img
              src={selectedImage || product.image}
              alt={product.name}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
          {gallery.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(76px, 1fr))', gap: '12px' }}>
              <div
                onClick={() => setSelectedImage(product.image)}
                style={{ borderRadius: '10px', overflow: 'hidden', border: (!selectedImage || selectedImage === product.image) ? '2px solid #E8000D' : '2px solid #e5e7eb', cursor: 'pointer', paddingBottom: '100%', height: 0, position: 'relative' }}
              >
                <img src={product.image} alt="main" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              {gallery.map((gImg, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(gImg)}
                  style={{ borderRadius: '10px', overflow: 'hidden', border: selectedImage === gImg ? '2px solid #E8000D' : '2px solid #e5e7eb', cursor: 'pointer', paddingBottom: '100%', height: 0, position: 'relative' }}
                >
                  <img src={gImg} alt={`img-${idx}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ color: '#E8000D', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '13px', marginBottom: '14px' }}>
            {product.category}
          </div>
          <h1 style={{ fontSize: 'clamp(40px, 5.5vw, 64px)', fontWeight: 900, color: '#111', lineHeight: 1.1, marginBottom: '20px', letterSpacing: '-1.5px' }}>
            {product.name}
          </h1>

          <div style={{ fontSize: '38px', fontWeight: 900, color: '#111', marginBottom: '20px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '15px', fontWeight: 600, color: '#9ca3af' }}>From</span>
            £{Number(product.price).toLocaleString()}
          </div>

          <p style={{ fontSize: '18px', color: 'rgba(0,0,0,0.7)', lineHeight: 1.7, marginBottom: '32px', paddingBottom: '32px', borderBottom: '1px solid #f3f4f6' }}>
            {product.shortDescription}
          </p>

          {/* Trust badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '32px' }}>
            {[
              { text: 'Premium Materials' },
              { text: 'Expert Installation' },
              { text: '12-Month Warranty' },
            ].map(b => (
              <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: '20px', fontSize: '18px', fontWeight: 600, color: '#374151' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {b.text}
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '14px' }}>
            <button
              onClick={() => addToCart(product)}
              style={{ flex: 1, padding: '16px', fontSize: '15px', borderRadius: '10px', background: '#1a1a1a', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'var(--font)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              Add to Cart
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-red"
              style={{ flex: 1, justifyContent: 'center', padding: '16px', fontSize: '15px', borderRadius: '10px', textDecoration: 'none' }}
            >
              Buy Now
            </a>
          </div>

        </div>
      </div>

      {/* ── Tabbed Description ── */}
      <div className="pd-tabs-wrap" style={{ maxWidth: '1200px', margin: '80px auto 0', padding: '0 24px' }}>

        {/* Tab headers */}
        <div className="pd-tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '14px 24px',
                border: 'none',
                borderBottom: activeTab === tab ? '3px solid #E8000D' : '3px solid transparent',
                background: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                fontWeight: activeTab === tab ? 800 : 600,
                color: activeTab === tab ? '#E8000D' : '#6b7280',
                fontFamily: 'var(--font)',
                transition: 'all 0.15s',
                marginBottom: '-2px',
                flexShrink: 0,
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="pd-tab-content">

          {/* ── OVERVIEW ── */}
          {activeTab === 'Overview' && (
            <div style={{ maxWidth: '800px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#111', marginBottom: '20px' }}>Product Overview</h2>
              {descText ? (
                <p style={{ fontSize: '18px', color: 'rgba(0,0,0,0.7)', lineHeight: 1.7 }}>{descText}</p>
              ) : (
                <p style={{ fontSize: '18px', color: 'rgba(0,0,0,0.7)', lineHeight: 1.7, fontStyle: 'italic' }}>
                  Detailed description coming soon. Contact us for more information about this product.
                </p>
              )}

              {/* Quick info cards */}
              <div className="pd-info-cards">
                {[
                  {
                    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
                    label: 'Premium Quality', sub: 'Industry-leading materials'
                  },
                  {
                    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
                    label: 'Pro Install', sub: 'Expert technicians'
                  },
                  {
                    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
                    label: 'Fast Turnaround', sub: '3–5 working days'
                  },
                  {
                    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
                    label: '1-Year Warranty', sub: 'Workmanship guarantee'
                  },
                ].map(c => (
                  <div key={c.label} style={{ padding: '20px 16px', background: '#f9fafb', border: '1.5px solid #f3f4f6', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>{c.icon}</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#111', marginBottom: '4px' }}>{c.label}</div>
                    <div style={{ fontSize: '18px', color: 'rgba(0,0,0,0.7)', lineHeight: 1.7 }}>{c.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SPECIFICATIONS ── */}
          {activeTab === 'Specifications' && (
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#111', marginBottom: '24px' }}>Product Specifications</h2>
              {specs.length === 0 ? (
                <p style={{ fontSize: '18px', color: 'rgba(0,0,0,0.7)', lineHeight: 1.7, fontStyle: 'italic' }}>
                  Specifications not yet added. Contact us for full product details.
                </p>
              ) : (
                <>
                  <div style={{ border: '1.5px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden', overflowX: 'auto' }}>
                    <table className="pd-specs-table">
                      <tbody>
                        {specs.map(({ label, value }, i) => (
                          <tr key={label} style={{ borderBottom: i < specs.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                            <td style={{ fontSize: '18px', fontWeight: 700, color: '#374151', background: '#f9fafb', width: '38%', borderRight: '1px solid #f3f4f6' }}>
                              {label}
                            </td>
                            <td style={{ fontSize: '18px', color: 'rgba(0,0,0,0.7)', lineHeight: 1.7, background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                              {value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p style={{ fontSize: '18px', color: 'rgba(0,0,0,0.7)', lineHeight: 1.7, marginTop: '16px' }}>
                    * Specifications may vary by vehicle model and chosen finish. Contact us for a tailored quote.
                  </p>
                </>
              )}
            </div>
          )}

          {/* ── WHY CHOOSE US ── */}
          {activeTab === 'Why Choose Us' && (
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#111', marginBottom: '8px' }}>Why Choose SD Sign Studio?</h2>
              <p style={{ fontSize: '18px', color: 'rgba(0,0,0,0.7)', marginBottom: '32px', lineHeight: 1.7 }}>
                We've been transforming vehicles and businesses across Glasgow for years. Here's what sets us apart:
              </p>
              <div className="pd-why-grid">
                {features.map((feat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '18px 20px', background: '#f9fafb', border: '1.5px solid #f3f4f6', borderRadius: '12px' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(232,0,13,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8000D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span style={{ fontSize: '18px', color: 'rgba(0,0,0,0.7)', lineHeight: 1.7 }}>{feat}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div style={{ marginTop: '36px', padding: '28px 28px', background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)', borderRadius: '16px' }}>
                <p style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>Ready to get started?</p>
                <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: '0 0 20px' }}>Get a free quote — no obligation.</p>
                <Link
                  to="/quote"
                  className="btn-red"
                  style={{ textDecoration: 'none', padding: '13px 28px', fontSize: '14px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', boxSizing: 'border-box' }}
                >
                  Get a Free Quote
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Related Products ── */}
      {relatedProducts.length > 0 && (
        <div className="pd-related" style={{ maxWidth: '1200px', margin: '80px auto 0', padding: '0 24px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#111', marginBottom: '40px', textAlign: 'center' }}>
            Related <span className="red">Products</span>
          </h2>
          <div className="product-grid">
            {relatedProducts.map(rp => (
              <Link to={`/shop/${rp.id}`} className="product-card" key={rp.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="product-img-wrap">
                  <img className="product-img" src={rp.image || rp.img} alt={rp.name} />
                  {rp.badge && <div className="product-badge">{rp.badge}</div>}
                </div>
                <div className="product-info" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <div className="product-category">{rp.category}</div>
                  <h3 className="product-name">{rp.name}</h3>
                  <p className="product-desc" style={{ flexGrow: 1 }}>{rp.shortDescription || rp.short_description}</p>
                  <div className="product-price-row">
                    <div className="product-price">
                      <span className="from">From </span>£{Number(rp.price).toLocaleString()}
                    </div>
                    <span className="product-cta">View</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
