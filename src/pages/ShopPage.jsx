import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { products as dummyProducts } from '../data/products'
import { BRAND_ICONS } from '../components/home/CategoriesSection'

const sortOptions = [
  { value: 'default', label: 'Recommended' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A-Z' },
]

export default function ShopPage() {
  const [activeCategories, setActiveCategories] = useState([])
  const [sortBy, setSortBy] = useState('default')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState([])
  // parentGroups: [{ id, name, children: [{id, name}] }]
  const [parentGroups, setParentGroups] = useState([])
  const [expandedParents, setExpandedParents] = useState({})
  const [loading, setLoading] = useState(true)

  // Fetch products and categories from Supabase
  useEffect(() => {
    async function fetchData() {
      try {
        const { data: catData } = await supabase.from('categories').select('*')
        if (catData && catData.length > 0) {
          const parents = catData.filter(c => !c.parent_id)
          const groups = parents.map(p => ({
            ...p,
            children: catData.filter(c => c.parent_id === p.id)
          }))
          setParentGroups(groups)
          // Start all collapsed — user opens them manually
        }

        const { data: prodData } = await supabase.from('products').select('*')
        const mappedDbProducts = (prodData || []).map(p => ({
          ...p,
          image: p.primary_image || p.image,
          badge: p.badge || '',
          shortDescription: p.short_description || p.shortDescription || '',
        }))

        if (mappedDbProducts.length > 0) {
          setProducts(mappedDbProducts)
        } else {
          setProducts(dummyProducts.map(p => ({ ...p, image: p.img })))
        }
      } catch (err) {
        console.error('Error fetching data', err)
        setProducts(dummyProducts.map(p => ({ ...p, image: p.img })))
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const filtered = useMemo(() => {
    let items = activeCategories.length === 0
      ? [...products]
      : products.filter(p => activeCategories.includes(p.category))

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase()
      items = items.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    }

    switch (sortBy) {
      case 'price-asc': items.sort((a, b) => a.price - b.price); break
      case 'price-desc': items.sort((a, b) => b.price - a.price); break
      case 'name-asc': items.sort((a, b) => a.name.localeCompare(b.name)); break
      default: break
    }
    return items
  }, [activeCategories, searchQuery, sortBy, products])

  const toggleCategory = (catName) => {
    setActiveCategories(prev =>
      prev.includes(catName) ? prev.filter(c => c !== catName) : [...prev, catName]
    )
  }

  const toggleParent = (group) => {
    // Select/deselect all children of this parent
    const childNames = group.children.map(c => c.name)
    const allSelected = childNames.every(n => activeCategories.includes(n))
    setActiveCategories(prev =>
      allSelected
        ? prev.filter(c => !childNames.includes(c))
        : [...new Set([...prev, ...childNames])]
    )
  }

  const toggleExpand = (parentId) => {
    setExpandedParents(prev => ({ ...prev, [parentId]: !prev[parentId] }))
  }

  const clearFilters = () => {
    setActiveCategories([])
    setSearchQuery('')
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Hero Banner */}
      <div className="shop-banner">
        <div className="shop-banner-inner">
          <h1 style={{ fontFamily: 'serif', fontWeight: 600 }}>Shop Our Collections</h1>
          <p>Premium vehicle wraps, graphics packages, and custom branding solutions</p>
        </div>
      </div>

      {/* Shop Layout */}
      <div className="shop-layout" style={{ paddingTop: '48px', paddingBottom: '48px', background: '#fff' }}>
        
        {/* Mobile Filter Toggle */}
        <button
          className="mobile-filter-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"/>
          </svg>
          {sidebarOpen ? 'Hide Filters' : 'Show Filters'}
        </button>

        {/* Sidebar */}
        <aside className={`shop-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 800, color: 'var(--black)', lineHeight: 1.7 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5zm1 .5v1.308l4.372 4.858A.5.5 0 0 1 7 8.5v5.306l2-.666V8.5a.5.5 0 0 1 .128-.334L13.5 3.308V2z"/></svg>
              Filters
            </div>
            {(activeCategories.length > 0 || searchQuery !== '') && (
              <button onClick={clearFilters} style={{ color: 'var(--red)', fontSize: '13px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                Clear All
              </button>
            )}
          </div>

          <div className="filter-section">
            <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--black)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>Category</div>

            {parentGroups.map(group => {
              const childNames = group.children.map(c => c.name)
              const allSelected = childNames.length > 0 && childNames.every(n => activeCategories.includes(n))
              const someSelected = childNames.some(n => activeCategories.includes(n))
              const isExpanded = !!expandedParents[group.id]

              return (
                <div key={group.id} style={{ marginBottom: '4px' }}>
                  {/* Parent row — clicking anywhere toggles expand only */}
                  <div
                    onClick={() => toggleExpand(group.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', background: someSelected ? 'rgba(232,0,13,0.04)' : 'transparent', userSelect: 'none' }}
                  >
                    {/* Expand/collapse chevron — bold and clear */}
                    <span style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '22px', height: '22px', borderRadius: '6px',
                      background: isExpanded ? 'var(--red)' : '#f3f4f6',
                      flexShrink: 0, transition: 'background 0.2s',
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isExpanded ? '#fff' : '#374151'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                        style={{ transition: 'transform 0.2s', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                      >
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </span>
                    {/* Parent label */}
                    <span style={{ flex: 1, fontSize: '18px', fontWeight: 700, color: 'var(--black)' }}>
                      {group.name}
                      {someSelected && (
                        <span style={{ marginLeft: '6px', fontSize: '13px', color: 'var(--red)', fontWeight: 600 }}>
                          ({childNames.filter(n => activeCategories.includes(n)).length})
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Children */}
                  {isExpanded && group.children.length > 0 && (
                    <ul className="filter-list" style={{ margin: '2px 0 4px 20px', padding: 0 }}>
                      {group.children.map(child => {
                        const isActive = activeCategories.includes(child.name)
                        return (
                          <li
                            key={child.id}
                            className={`filter-item ${isActive ? 'active' : ''}`}
                            onClick={() => toggleCategory(child.name)}
                            style={{ background: isActive ? 'rgba(232,0,13,0.05)' : 'transparent', border: 'none', borderRadius: '8px', padding: '8px 12px' }}
                          >
                            <span style={{
                              flexShrink: 0, width: '28px', height: '28px', borderRadius: '50%',
                              background: isActive ? 'var(--red)' : '#1a1a1a',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              overflow: 'hidden', transition: 'background 0.2s',
                            }}>
                              {typeof BRAND_ICONS[child.name] === 'string' ? (
                                <img src={BRAND_ICONS[child.name]} alt={child.name} style={{ width: '60%', height: '60%', filter: 'invert(1)', objectFit: 'contain' }} />
                              ) : BRAND_ICONS[child.name] ? (
                                BRAND_ICONS[child.name]
                              ) : (
                                <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff' }}>{child.name.charAt(0)}</span>
                              )}
                            </span>
                            <span style={{ flex: 1, marginLeft: '8px', fontSize: '18px', color: 'var(--black)' }}>{child.name}</span>
                            <input
                              type="checkbox"
                              checked={isActive}
                              onChange={() => toggleCategory(child.name)}
                              onClick={e => e.stopPropagation()}
                              style={{ accentColor: 'var(--red)' }}
                            />
                          </li>
                        )
                      })}
                    </ul>
                  )}

                  {/* Empty parent (no children yet) */}
                  {isExpanded && group.children.length === 0 && (
                    <div style={{ padding: '6px 12px 6px 32px', fontSize: '12px', color: '#9ca3af', fontStyle: 'italic' }}>
                      No subcategories yet
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </aside>

        {/* Products */}
        <div>
          {/* Main Header */}
          <div className="shop-controls" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', gap: '16px' }}>
            <h2 className="shop-heading" style={{ fontSize: '28px', fontWeight: 800, color: 'var(--black)', fontFamily: 'serif', margin: 0, flexShrink: 0 }}>
              {activeCategories.length === 1 ? activeCategories[0] : 'All Products'}
            </h2>

            <div className="shop-controls-inner" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--black)' }}><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ padding: '10px 16px 10px 36px', border: '1px solid #d1d5db', borderRadius: '24px', fontSize: '14px', width: '200px', outline: 'none', fontFamily: 'var(--font)', color: 'var(--black)' }}
                />
              </div>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{ padding: '10px 16px', border: '1px solid #d1d5db', borderRadius: '24px', fontSize: '14px', fontWeight: 500, color: 'var(--black)', outline: 'none', background: '#fff', cursor: 'pointer', fontFamily: 'var(--font)' }}
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ fontSize: '14px', color: 'var(--black)', fontWeight: 500, marginBottom: '24px' }}>
            Showing {filtered.length} of {products.length} products found
          </div>

          <div className="product-grid">
            {filtered.map(product => (
              <Link to={`/shop/${product.id}`} className="product-card" key={product.id} style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="product-img-wrap">
                  <img className="product-img" src={product.image} alt={product.name} />
                  {product.badge && <div className="product-badge">{product.badge}</div>}
                </div>
                <div className="product-info" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <div className="product-category">{product.category}</div>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-desc" style={{ flexGrow: 1 }}>{product.shortDescription}</p>
                  <div className="product-price-row">
                    <div className="product-price">
                      <span className="from">From </span>£{product.price.toLocaleString()}
                    </div>
                    <span className="product-cta">View</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--black)', background: '#f9f9f9', borderRadius: '16px', marginTop: '24px' }}>
              <p style={{ fontSize: '18px', fontWeight: 600 }}>No products found matching your criteria.</p>
              <button onClick={clearFilters} className="btn-red" style={{ marginTop: '16px' }}>Clear All Filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
