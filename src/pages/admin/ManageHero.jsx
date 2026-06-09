import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getHeroSettings, saveHeroSettings } from '../../data/heroService'
import { uploadToCloudinary } from '../../lib/cloudinary'
import { Icon } from './icon'

const card = { background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.03)' }
const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', fontFamily: 'var(--font)', outline: 'none', background: '#fff', color: '#111' }
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }

export default function ManageHero() {
  const [settings, setSettings] = useState({
    headline: '',
    subheadline: '',
    mediaType: 'video',
    videoUrl: '',
    slides: []
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(null) // index for slide, 'video' for video

  useEffect(() => {
    const data = getHeroSettings()
    setSettings(data)
    setLoading(false)
  }, [])

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSlideChange = (index, value) => {
    const updated = [...settings.slides]
    if (updated[index] && typeof updated[index] === 'object') {
      updated[index] = { ...updated[index], image: value }
    } else {
      updated[index] = { image: value, headline: '', description: '' }
    }
    handleChange('slides', updated)
  }

  const handleSlideTextChange = (index, field, value) => {
    const updated = [...settings.slides]
    if (updated[index] && typeof updated[index] === 'object') {
      updated[index] = { ...updated[index], [field]: value }
    } else {
      updated[index] = { image: '', [field]: value }
    }
    handleChange('slides', updated)
  }

  const handleRemoveSlide = (index) => {
    const updated = settings.slides.filter((_, idx) => idx !== index)
    handleChange('slides', updated)
    toast.success(`Slide ${index + 1} removed`)
  }

  const handleAddSlide = () => {
    if (settings.slides.length >= 8) {
      toast.error('You can add up to 8 slides')
      return
    }
    handleChange('slides', [...settings.slides, { image: '', headline: '', description: '' }])
  }

  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploading(type)
    toast.loading('Uploading file to Cloudinary...', { id: 'upload' })
    
    try {
      const url = await uploadToCloudinary(file)
      
      if (type === 'video') {
        handleChange('videoUrl', url)
        toast.success('Video uploaded successfully!', { id: 'upload' })
      } else {
        const index = parseInt(type, 10)
        handleSlideChange(index, url)
        toast.success(`Slide ${index + 1} image uploaded successfully!`, { id: 'upload' })
      }
    } catch (err) {
      toast.error('Upload failed: ' + err.message, { id: 'upload' })
    } finally {
      setUploading(null)
    }
  }

  const handleSave = () => {
    setSaving(true)
    const success = saveHeroSettings(settings)
    if (success) {
      toast.success('Hero banner settings saved successfully!')
    } else {
      toast.error('Failed to save settings')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div style={{ ...card, padding: '60px', textAlign: 'center', color: '#9ca3af' }}>
        <div style={{ width: '36px', height: '36px', border: '3px solid #e5e7eb', borderTopColor: '#E8000D', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
        Loading hero settings...
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifycontent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', margin: 0 }}>Manage Hero Banner</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Configure the video background, image slideshow transition, and copy of the homepage hero banner.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
        
        {/* Editor form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Text Settings */}
          <div style={{ ...card, padding: '28px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' }}>
              Hero Copy Text
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Default/Common Text */}
              <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '10px', border: '1.5px solid #e5e7eb' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>Default / Fallback Text</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Default Headline</label>
                    <input
                      value={settings.headline}
                      onChange={e => handleChange('headline', e.target.value)}
                      style={inputStyle}
                      placeholder="We design, print, and install your brand everywhere."
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Default Subheadline</label>
                    <textarea
                      value={settings.subheadline}
                      onChange={e => handleChange('subheadline', e.target.value)}
                      rows={3}
                      style={{ ...inputStyle, resize: 'vertical' }}
                      placeholder="Glasgow's premier vehicle wrapping, storefront signage, and custom print fabrication agency..."
                    />
                  </div>
                </div>
              </div>

              {/* Video Specific Text */}
              <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '10px', border: '1.5px solid #e5e7eb' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>Video Mode Override Text (Optional)</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>Video Mode Headline</label>
                    <input
                      value={settings.videoHeadline || ''}
                      onChange={e => handleChange('videoHeadline', e.target.value)}
                      style={inputStyle}
                      placeholder="Leave blank to use Default Headline"
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Video Mode Subheadline</label>
                    <textarea
                      value={settings.videoSubheadline || ''}
                      onChange={e => handleChange('videoSubheadline', e.target.value)}
                      rows={2}
                      style={{ ...inputStyle, resize: 'vertical' }}
                      placeholder="Leave blank to use Default Subheadline"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Media Settings */}
          <div style={{ ...card, padding: '28px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' }}>
              Media Background Configuration
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Active Media Mode</label>
                <select
                  value={settings.mediaType}
                  onChange={e => handleChange('mediaType', e.target.value)}
                  style={{ ...inputStyle, cursor: 'pointer', appearance: 'auto' }}
                >
                  <option value="video">Looping Video Background</option>
                  <option value="slideshow">5-8 Images Slideshow Transition</option>
                </select>
              </div>

               {settings.mediaType === 'video' ? (
                <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '10px', border: '1.5px solid #e5e7eb' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>Video Settings</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={labelStyle}>Active Video Background</label>
                      {settings.videoUrl && (
                        <div style={{ padding: '8px 12px', background: '#e5e7eb', borderRadius: '6px', fontSize: '12px', wordBreak: 'break-all', marginBottom: '8px', color: '#374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>{settings.videoUrl}</span>
                          <button type="button" onClick={() => handleChange('videoUrl', '')} style={{ border: 'none', background: 'none', color: '#dc2626', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>Clear</button>
                        </div>
                      )}
                      <div style={{ position: 'relative', marginTop: '4px' }}>
                        <input
                          id="video-upload"
                          type="file"
                          accept="video/*"
                          onChange={e => handleFileUpload(e, 'video')}
                          disabled={uploading !== null}
                          style={{ display: 'none' }}
                        />
                        <label
                          htmlFor="video-upload"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 18px',
                            background: uploading === 'video' ? '#f3f4f6' : '#ffffff',
                            border: '1.5px solid #d1d5db',
                            borderRadius: '8px',
                            cursor: uploading === 'video' ? 'not-allowed' : 'pointer',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#374151',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={e => {
                            if (uploading !== 'video') {
                              e.currentTarget.style.borderColor = 'var(--red)';
                              e.currentTarget.style.background = '#fcf8f8';
                            }
                          }}
                          onMouseLeave={e => {
                            if (uploading !== 'video') {
                              e.currentTarget.style.borderColor = '#d1d5db';
                              e.currentTarget.style.background = '#ffffff';
                            }
                          }}
                        >
                          <span>{uploading === 'video' ? '⏳ Uploading...' : '🎥 Choose Video File'}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '10px', border: '1.5px solid #e5e7eb' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: 0 }}>Slideshow Images ({settings.slides.length}/8)</h4>
                    <button
                      onClick={handleAddSlide}
                      style={{ padding: '6px 12px', background: '#E8000D', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      + Add Slide
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {settings.slides.map((slide, idx) => (
                      <div key={idx} style={{ background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#6b7280' }}>Slide {idx + 1}</span>
                          <button
                            onClick={() => handleRemoveSlide(idx)}
                            style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                          >
                            Remove
                          </button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                          {(slide?.image || slide) ? (
                            <img
                              src={slide?.image || slide}
                              alt={`Preview ${idx + 1}`}
                              style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #e5e7eb' }}
                              onError={e => e.target.style.display = 'none'}
                            />
                          ) : (
                            <span style={{ fontSize: '11px', color: '#9ca3af' }}>No image uploaded</span>
                          )}
                          <div style={{ flex: 1 }}>
                            <div style={{ position: 'relative', marginTop: '4px' }}>
                              <input
                                id={`slide-upload-${idx}`}
                                type="file"
                                accept="image/*"
                                onChange={e => handleFileUpload(e, idx.toString())}
                                disabled={uploading !== null}
                                style={{ display: 'none' }}
                              />
                              <label
                                htmlFor={`slide-upload-${idx}`}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '8px 14px',
                                  background: uploading === idx.toString() ? '#f3f4f6' : '#ffffff',
                                  border: '1.5px solid #d1d5db',
                                  borderRadius: '6px',
                                  cursor: uploading !== null ? 'not-allowed' : 'pointer',
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  color: '#374151',
                                  transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => {
                                  if (uploading === null) {
                                    e.currentTarget.style.borderColor = 'var(--red)';
                                    e.currentTarget.style.background = '#fcf8f8';
                                  }
                                }}
                                onMouseLeave={e => {
                                  if (uploading === null) {
                                    e.currentTarget.style.borderColor = '#d1d5db';
                                    e.currentTarget.style.background = '#ffffff';
                                  }
                                }}
                              >
                                <span>{uploading === idx.toString() ? '⏳ Uploading...' : '🖼️ Upload Slide Image'}</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Slide Custom Texts */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #f3f4f6', paddingTop: '10px', marginTop: '4px' }}>
                          <div>
                            <label style={{ ...labelStyle, fontSize: '12px', marginBottom: '4px' }}>Slide Headline</label>
                            <input
                              value={slide?.headline || ''}
                              onChange={e => handleSlideTextChange(idx, 'headline', e.target.value)}
                              style={{ ...inputStyle, padding: '6px 10px', fontSize: '13px' }}
                              placeholder="Headline for this image"
                            />
                          </div>
                          <div>
                            <label style={{ ...labelStyle, fontSize: '12px', marginBottom: '4px' }}>Slide Description</label>
                            <textarea
                              value={slide?.description || ''}
                              onChange={e => handleSlideTextChange(idx, 'description', e.target.value)}
                              rows={2}
                              style={{ ...inputStyle, padding: '6px 10px', fontSize: '13px', resize: 'vertical' }}
                              placeholder="Description / Subheadline for this image"
                            />
                          </div>
                        </div>

                      </div>
                    ))}
                    {settings.slides.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '24px', color: '#9ca3af', fontSize: '13px' }}>
                        No slides added yet. Click "+ Add Slide" to configure.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-red"
              style={{ padding: '12px 32px', fontSize: '14px', border: 'none', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}
            >
              {saving ? 'Saving...' : 'Save All Settings'}
            </button>
          </div>

        </div>

        {/* Live Preview Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ ...card, padding: '20px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>Live Banner Preview</h4>
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', position: 'relative', height: '220px', background: '#f3f4f6' }}>
              
              {/* Media Preview */}
              <div style={{ position: 'absolute', inset: 0 }}>
                {settings.mediaType === 'video' ? (
                  settings.videoUrl ? (
                    <video src={settings.videoUrl} muted loop autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#000', opacity: 0.1 }} />
                  )
                ) : (
                  settings.slides?.[0] ? (
                    <img src={settings.slides[0]?.image || settings.slides[0]} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} onError={e => e.target.style.display = 'none'} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#000', opacity: 0.1 }} />
                  )
                )}
              </div>

              {/* Content overlay */}
              <div style={{ position: 'absolute', inset: 0, padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(to right, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.5) 100%)', zIndex: 1 }}>
                <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--red)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>Signage &amp; Wrapping</div>
                <h5 style={{ fontSize: '14px', fontWeight: 800, color: '#111827', margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {settings.mediaType === 'slideshow' 
                    ? (settings.slides?.[0]?.headline || settings.slideshowHeadline || settings.headline) 
                    : (settings.videoHeadline || settings.headline)}
                </h5>
                <p style={{ fontSize: '11px', color: '#4b5563', margin: '0 0 12px', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {settings.mediaType === 'slideshow' 
                    ? (settings.slides?.[0]?.description || settings.slideshowSubheadline || settings.subheadline) 
                    : (settings.videoSubheadline || settings.subheadline)}
                </p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ fontSize: '8px', padding: '4px 8px', background: 'var(--red)', color: '#fff', fontWeight: 700, borderRadius: '4px' }}>Get Quote</span>
                  <span style={{ fontSize: '8px', padding: '4px 8px', border: '1px solid #9ca3af', color: '#111', fontWeight: 700, borderRadius: '4px' }}>View Work</span>
                </div>
              </div>

            </div>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '10px', textAlign: 'center' }}>
              Preview shows the first slide or looping video background.
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
