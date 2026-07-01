import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export const BRAND_ICONS = {
  'Audi': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/audi.svg',
  'Bentley': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/bentley.svg',
  'BMW': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/bmw.svg',
  'BYD': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: '75%', height: '75%', color: '#ffffff' }}>
      <ellipse cx="12" cy="12" rx="10" ry="7" strokeWidth="1.5" />
      <path d="M6 9 v6 M6 9 h2.2 a1.5 1.5 0 0 1 0 3 M6 12 h2.2 a1.5 1.5 0 0 1 0 3" />
      <path d="M10.5 9 L12 12.2 L13.5 9 M12 12.2 V15" />
      <path d="M15.5 9 H17.5 A3 3 0 0 1 17.5 15 H15.5 V9" />
    </svg>
  ),
  'Hyundai': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/hyundai.svg',
  'Jaguar': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/jaguar.svg',
  'Jeep': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/jeep.svg',
  'Kia': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/kia.svg',
  'Land Rover': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/landrover.svg',
  'Lexus': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '65%', height: '65%', color: '#ffffff' }}>
      <ellipse cx="12" cy="12" rx="9.5" ry="7" />
      <path d="M14.5 7.5 L8.2 14.5 H16.5" strokeWidth="2.2" />
    </svg>
  ),
  'Mahindra': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mahindra.svg',
  'Maruti Suzuki': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/suzuki.svg',
  'Maserati': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/maserati.svg',
  'Renault': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/renault.svg',
  'Mercedes Benz': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mercedes.svg',
  'MG': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mg.svg',
  'Mini': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/mini.svg',
  'Porsche': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/porsche.svg',
  'Skoda': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/skoda.svg',
  'Tata': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/tata.svg',
  'Toyota': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/toyota.svg',
  'Vinfast': (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '60%', height: '60%', color: '#ffffff' }}>
      <path d="M3 6.5 L12 19 L21 6.5 H17.5 L12 14.5 L6.5 6.5 Z M6.5 4.5 L12 12 L17.5 4.5 H14.5 L12 8.5 L9.5 4.5 Z" />
    </svg>
  ),
  'Volkswagen': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/volkswagen.svg',
  'Volvo': 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/volvo.svg',
}

const STATIC_CATEGORIES = Object.keys(BRAND_ICONS).map(name => ({ name, icon: BRAND_ICONS[name] }))

export default function CategoriesSection() {
  const [categories, setCategories] = useState(STATIC_CATEGORIES)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true })
        if (!error && data && data.length > 0) {
          setCategories(data.map(c => ({
            ...c,
            icon: c.icon_url || BRAND_ICONS[c.name] || null,
          })))
        }
      } catch {
        // keep static fallback
      }
    }
    fetchCategories()
  }, [])

  return (
    <section className="section categories-section" id="products">
      <div className="section-inner">
        <div className="section-header">
          <span className="section-eyebrow">Our Services</span>
          <h2 className="section-title">Popular <span className="red">Categories</span></h2>
        </div>
        <div className="cat-grid">
          {categories.map((cat) => (
            <div className="cat-card" key={cat.id || cat.name}>
              <div className="cat-logo-circle">
                {typeof cat.icon === 'string' ? (
                  <img src={cat.icon} alt={cat.name} />
                ) : cat.icon ? (
                  cat.icon
                ) : (
                  <span style={{ fontSize: '20px', fontWeight: 800, color: '#E8000D' }}>{cat.name.charAt(0)}</span>
                )}
              </div>
              <div className="cat-name">{cat.name}</div>
            </div>
          ))}
        </div>
        <div className="section-footer">
          <a href="/shop" className="btn-red">View All Products</a>
        </div>
      </div>
    </section>
  )
}

