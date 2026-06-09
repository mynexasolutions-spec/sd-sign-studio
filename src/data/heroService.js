const DEFAULT_SETTINGS = {
  headline: "We design, print, and install your brand everywhere.",
  subheadline: "Glasgow's premier vehicle wrapping, storefront signage, and custom print fabrication agency. Built to make your brand unmissable.",
  videoHeadline: "",
  videoSubheadline: "",
  slideshowHeadline: "",
  slideshowSubheadline: "",
  mediaType: "video", // "video" or "slideshow"
  videoUrl: "https://vjs.zencdn.net/v/oceans.mp4",
  slides: [
    {
      image: "/images/client-images/van_wrapping.jpg",
      headline: "Commercial Vehicle Wrapping",
      description: "Transform your company fleet into moving billboards with our high-grade wraps.",
      caption: "Full commercial van wrap using durable premium 3M vinyl."
    },
    {
      image: "/images/client-images/WhatsApp Image 2026-05-17 at 11.20.17 PM.jpeg",
      headline: "Bespoke Shopfront Signage",
      description: "Attract more foot traffic with premium 3D illuminated letters and custom fascias.",
      caption: "Storefront signage for Aqua Property Ltd with custom illuminated design."
    },
    {
      image: "/images/client-images/car2.jpg",
      headline: "Precision Car Colour Changes",
      description: "Superb styling and paint protection with elite vinyl color changes.",
      caption: "Precision vehicle wrapping and styling for sports cars."
    },
    {
      image: "/images/client-images/WhatsApp Image 2026-05-17 at 11.20.17 PM (2).jpeg",
      headline: "Custom Office Branding",
      description: "Create inspiring workplaces with printed wall coverings and frosted glass decals.",
      caption: "Bespoke internal office wall murals and glass manifestations."
    },
    {
      image: "/images/client-images/van_wrapping_2.webp",
      headline: "Stunning Digital Prints",
      description: "High-definition wide-format banner printing and commercial displays.",
      caption: "Custom large-format outdoor building signage fabrication."
    },
    {
      image: "/images/client-images/WhatsApp Image 2026-05-17 at 11.20.18 PM.jpeg",
      headline: "Dynamic Window Graphics",
      description: "Enhance privacy and promote seasonal offers with vibrant window lettering.",
      caption: "Commercial window wrapping and promo graphics installation."
    },
    {
      image: "/images/client-images/WhatsApp Image 2026-05-17 at 11.20.17 PM (1).jpeg",
      headline: "Glasgow's Signage Experts",
      description: "Over a decade of manufacturing excellence, engineering signs built to last.",
      caption: "Over a decade of engineering high quality signage."
    }
  ]
}

export function getHeroSettings() {
  try {
    const stored = localStorage.getItem('hero_settings')
    if (stored) {
      const parsed = JSON.parse(stored)
      // Reset only if it is completely empty or contains a broken/restricted url
      if (!parsed.videoUrl || 
          parsed.videoUrl.includes('commondatastorage.googleapis') || 
          parsed.videoUrl.includes('mixkit-wrapping-a-car') || 
          parsed.videoUrl.includes('player.vimeo.com/external/371433846')) {
        parsed.videoUrl = DEFAULT_SETTINGS.videoUrl
        localStorage.setItem('hero_settings', JSON.stringify(parsed))
      }
      // Migrate old string slides to object slides
      if (parsed.slides && Array.isArray(parsed.slides)) {
        parsed.slides = parsed.slides.map((s, idx) => {
          const def = DEFAULT_SETTINGS.slides[idx] || {}
          if (typeof s === 'string') {
            return {
              image: s,
              headline: def.headline || parsed.headline || DEFAULT_SETTINGS.headline,
              description: def.description || parsed.subheadline || DEFAULT_SETTINGS.subheadline,
              caption: def.caption || "Glasgow's premier wrapping and signage specialists."
            }
          }
          return {
            ...def,
            ...s,
            caption: s.caption || def.caption || "Glasgow's premier wrapping and signage specialists."
          }
        })
      }
      return { ...DEFAULT_SETTINGS, ...parsed }
    }
  } catch (e) {
    console.error("Failed to read hero settings:", e)
  }
  return DEFAULT_SETTINGS
}

export function saveHeroSettings(settings) {
  try {
    localStorage.setItem('hero_settings', JSON.stringify(settings))
    window.dispatchEvent(new Event('hero-settings-updated'))
    return true
  } catch (e) {
    console.error("Failed to save hero settings:", e)
    return false
  }
}
