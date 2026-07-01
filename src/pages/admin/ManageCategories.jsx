import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { uploadToCloudinary } from '../../lib/cloudinary'
import toast from 'react-hot-toast'
import { Icon } from './icon'

const card = { background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.03)' }
const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', fontFamily: 'var(--font)', outline: 'none', background: '#fff', color: '#111', boxSizing: 'border-box' }
const selectStyle = { ...inputStyle, cursor: 'pointer' }

function ImageUploadBox({ value, onChange, label = 'Category Image', size = 80 }) {
  const ref = useRef()
  const [uploading, setUploading] = useState(false)
  const [drag, setDrag] = useState(false)

  const handle = async (file) => {
    if (!file || !file.type.startsWith('image/')) return toast.error('Please select an image file')
    setUploading(true)
    try {
      const url = await uploadToCloudinary(file)
      onChange(url)
    } catch (err) {
      toast.error('Upload failed: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: size, height: size, borderRadius: '10px', border: '2px dashed #e5e7eb', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
          {uploading ? (
            <div style={{ width: '22px', height: '22px', border: '3px solid #e5e7eb', borderTopColor: '#E8000D', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          ) : value ? (
            <img src={value} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
          ) : (
            <Icon name="photo" size={24} />
          )}
        </div>
        <div
          onClick={() => !uploading && ref.current.click()}
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]) }}
          style={{ flex: 1, border: `2px dashed ${drag ? '#E8000D' : '#e5e7eb'}`, borderRadius: '10px', padding: '16px', cursor: uploading ? 'not-allowed' : 'pointer', textAlign: 'center', background: drag ? '#fff1f2' : '#fafafa', transition: 'all 0.15s' }}
        >
          <div style={{ color: '#9ca3af', marginBottom: '6px' }}><Icon name="upload" size={18} /></div>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', margin: '0 0 2px' }}>{uploading ? 'Uploading…' : 'Click or drag to upload'}</p>
          <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>PNG, JPG, SVG, WebP</p>
          <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handle(e.target.files[0])} />
        </div>
        {value && (
          <button type="button" onClick={() => onChange('')} style={{ background: '#fff1f2', color: '#dc2626', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', flexShrink: 0 }}>
            <Icon name="trash" size={14} />
          </button>
        )}
      </div>
    </div>
  )
}

export default function ManageCategories() {
  const [categories, setCategories] = useState([])
  const [productCounts, setProductCounts] = useState({})
  const [loading, setLoading] = useState(true)

  // Add form state
  const [newName, setNewName] = useState('')
  const [newParentId, setNewParentId] = useState('')
  const [newIconUrl, setNewIconUrl] = useState('')
  const [addLoading, setAddLoading] = useState(false)

  // Edit state
  const [editId, setEditId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editParentId, setEditParentId] = useState('')
  const [editIconUrl, setEditIconUrl] = useState('')
  const [editSaving, setEditSaving] = useState(false)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const { data: cats } = await supabase.from('categories').select('*').order('name')
      setCategories(cats || [])
      const { data: prods } = await supabase.from('products').select('category')
      const counts = {}
      prods?.forEach(p => { counts[p.category] = (counts[p.category] || 0) + 1 })
      setProductCounts(counts)
    } catch {
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  // Split into parents and children for display
  const parents = categories.filter(c => !c.parent_id)
  const childrenOf = (parentId) => categories.filter(c => c.parent_id === parentId)

  const handleAdd = async e => {
    e.preventDefault()
    const name = newName.trim()
    if (!name) return
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase())) return toast.error('Category already exists')
    setAddLoading(true)
    try {
      const payload = { name, icon_url: newIconUrl || null }
      if (newParentId) payload.parent_id = parseInt(newParentId, 10)
      const { data, error } = await supabase.from('categories').insert([payload]).select().single()
      if (error) throw error
      toast.success('Category added')
      setCategories(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
      setNewName('')
      setNewParentId('')
      setNewIconUrl('')
    } catch (err) {
      toast.error('Failed: ' + err.message)
    } finally {
      setAddLoading(false)
    }
  }

  const startEdit = (cat) => {
    setEditId(cat.id)
    setEditName(cat.name)
    setEditParentId(cat.parent_id ? String(cat.parent_id) : '')
    setEditIconUrl(cat.icon_url || '')
  }

  const handleEdit = async () => {
    const name = editName.trim()
    if (!name) return
    // Prevent assigning a parent to itself
    if (editParentId && parseInt(editParentId) === editId) return toast.error('A category cannot be its own parent')
    setEditSaving(true)
    try {
      const payload = { name, icon_url: editIconUrl || null, parent_id: editParentId ? parseInt(editParentId, 10) : null }
      const { error } = await supabase.from('categories').update(payload).eq('id', editId)
      if (error) throw error
      toast.success('Category updated')
      setCategories(prev =>
        prev.map(c => c.id === editId ? { ...c, ...payload } : c).sort((a, b) => a.name.localeCompare(b.name))
      )
      setEditId(null)
    } catch (err) {
      toast.error('Failed: ' + err.message)
    } finally {
      setEditSaving(false)
    }
  }

  const handleDelete = async (cat) => {
    const children = childrenOf(cat.id)
    let msg = `Delete category "${cat.name}"?`
    if (children.length > 0) msg = `"${cat.name}" has ${children.length} subcategory(s). Deleting it will also delete all subcategories. Continue?`
    else if (productCounts[cat.name]) msg = `"${cat.name}" has ${productCounts[cat.name]} product(s). Deleting it won't remove the products. Continue?`
    if (!window.confirm(msg)) return
    try {
      const { error } = await supabase.from('categories').delete().eq('id', cat.id)
      if (error) throw error
      toast.success('Category deleted')
      setCategories(prev => prev.filter(c => c.id !== cat.id && c.parent_id !== cat.id))
    } catch {
      toast.error('Failed to delete category')
    }
  }

  const ParentBadge = ({ parentId }) => {
    const parent = categories.find(c => c.id === parentId)
    if (!parent) return null
    return (
      <span style={{ fontSize: '11px', color: '#6b7280', background: '#f3f4f6', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>
        under {parent.name}
      </span>
    )
  }

  const CategoryRow = ({ cat, indent = false }) => (
    <div style={{ borderBottom: '1px solid #f3f4f6' }}>
      {editId === cat.id ? (
        /* ── Edit mode ── */
        <div style={{ padding: '16px 20px', background: '#fafafa', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Name *</label>
              <input
                type="text" value={editName} onChange={e => setEditName(e.target.value)}
                style={{ ...inputStyle, fontSize: '13px', padding: '8px 12px' }} autoFocus
                onKeyDown={e => { if (e.key === 'Enter') handleEdit(); if (e.key === 'Escape') setEditId(null) }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Parent Category</label>
              <select value={editParentId} onChange={e => setEditParentId(e.target.value)} style={{ ...selectStyle, fontSize: '13px', padding: '8px 12px' }}>
                <option value="">— None (top-level) —</option>
                {parents.filter(p => p.id !== cat.id).map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
          <ImageUploadBox label="Image / Icon" value={editIconUrl} onChange={setEditIconUrl} size={60} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleEdit} disabled={editSaving} className="btn-red"
              style={{ padding: '7px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px', opacity: editSaving ? 0.7 : 1 }}>
              <Icon name="save" size={12} /> {editSaving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={() => setEditId(null)} style={{ background: '#f3f4f6', color: '#6b7280', border: 'none', padding: '7px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      ) : (
        /* ── View mode ── */
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 20px', paddingLeft: indent ? '44px' : '20px', transition: 'background 0.1s' }}
          onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
          onMouseLeave={e => e.currentTarget.style.background = ''}
        >
          {indent && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" style={{ flexShrink: 0, marginLeft: '-20px' }}>
              <path d="M9 18l6-6-6-6" />
            </svg>
          )}
          <div style={{ width: '44px', height: '44px', borderRadius: '8px', border: '1.5px solid #e5e7eb', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
            {cat.icon_url ? (
              <img src={cat.icon_url} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
            ) : (
              <span style={{ fontSize: '18px', fontWeight: 800, color: '#E8000D' }}>{cat.name.charAt(0)}</span>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{cat.name}</span>
              {cat.parent_id && <ParentBadge parentId={cat.parent_id} />}
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', background: '#f3f4f6', padding: '2px 8px', borderRadius: '10px' }}>
                {productCounts[cat.name] || 0} product{productCounts[cat.name] !== 1 ? 's' : ''}
              </span>
              {childrenOf(cat.id).length > 0 && (
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#7c3aed', background: '#f5f3ff', padding: '2px 8px', borderRadius: '10px' }}>
                  {childrenOf(cat.id).length} subcategory{childrenOf(cat.id).length !== 1 ? 's' : ''}
                </span>
              )}
              {!cat.icon_url && (
                <span style={{ fontSize: '10px', color: '#f59e0b', background: '#fffbeb', padding: '1px 6px', borderRadius: '6px', fontWeight: 600 }}>No image</span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
            <button onClick={() => startEdit(cat)}
              style={{ background: '#eff6ff', color: '#1d4ed8', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Icon name="edit" size={12} /> Edit
            </button>
            <button onClick={() => handleDelete(cat)}
              style={{ background: '#fff1f2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Icon name="trash" size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', margin: 0 }}>Categories</h1>
        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Create parent categories and subcategories to organise your products</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '20px', alignItems: 'start' }}>

        {/* ── Add Form ── */}
        <div style={{ ...card, padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' }}>
            Add New Category
          </h3>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Category Name *</label>
              <input
                type="text" value={newName} onChange={e => setNewName(e.target.value)}
                placeholder="e.g. Audi" style={inputStyle} required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>Parent Category</label>
              <select value={newParentId} onChange={e => setNewParentId(e.target.value)} style={selectStyle}>
                <option value="">— None (creates a top-level category) —</option>
                {parents.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '5px' }}>
                Leave blank to create a parent category. Select one to create a subcategory under it.
              </p>
            </div>

            <ImageUploadBox label="Category Image / Icon" value={newIconUrl} onChange={setNewIconUrl} size={72} />

            <button type="submit" disabled={addLoading || !newName.trim()} className="btn-red"
              style={{ padding: '10px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', opacity: addLoading ? 0.7 : 1 }}>
              <Icon name="plus" size={14} />
              {addLoading ? 'Adding…' : newParentId ? 'Add Subcategory' : 'Add Parent Category'}
            </button>
          </form>
        </div>

        {/* ── Category List ── */}
        <div style={{ ...card, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: 0 }}>
              All Categories ({categories.length})
            </h3>
            <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#6b7280' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E8000D', display: 'inline-block' }} /> {parents.length} parent{parents.length !== 1 ? 's' : ''}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7c3aed', display: 'inline-block' }} /> {categories.length - parents.length} subcategories
              </span>
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
              <div style={{ width: '32px', height: '32px', border: '3px solid #e5e7eb', borderTopColor: '#E8000D', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
              Loading…
            </div>
          ) : categories.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
              <Icon name="categories" size={36} />
              <p style={{ marginTop: '10px', fontWeight: 600 }}>No categories yet</p>
            </div>
          ) : (
            <div>
              {parents.map(parent => (
                <div key={parent.id}>
                  {/* Parent row */}
                  <CategoryRow cat={parent} indent={false} />
                  {/* Children indented below */}
                  {childrenOf(parent.id).map(child => (
                    <CategoryRow key={child.id} cat={child} indent={true} />
                  ))}
                </div>
              ))}
              {/* Orphaned children (parent was deleted) */}
              {categories.filter(c => c.parent_id && !categories.find(p => p.id === c.parent_id)).map(cat => (
                <CategoryRow key={cat.id} cat={cat} indent={false} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
