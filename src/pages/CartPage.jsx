import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleBookOnWhatsApp = () => {
    if (cartItems.length === 0) return

    let text = `Hi SD Sign Studio, I'd like to book the following items from my cart:\n\n`
    
    cartItems.forEach(item => {
      text += `- ${item.name} x${item.quantity} (£${(item.price * item.quantity).toLocaleString()})\n`
    })

    text += `\n*Total Estimate: £${cartTotal.toLocaleString()}*\n\nPlease let me know the next steps to confirm my booking.`

    const whatsappUrl = `https://wa.me/447715669077?text=${encodeURIComponent(text)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', paddingTop: 'calc(var(--nav-h) + 40px)', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ fontSize: 'clamp(40px, 5.5vw, 64px)', fontWeight: 900, color: 'var(--black)', fontFamily: 'var(--font)', letterSpacing: '-1.5px', marginBottom: '32px', lineHeight: '1.1' }}>Your Cart</h1>

        {cartItems.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: '16px', padding: '64px 24px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--black)', marginBottom: '16px' }}>Your cart is empty.</h2>
            <p style={{ color: 'rgba(0,0,0,0.6)', marginBottom: '32px' }}>Looks like you haven't added any products to your cart yet.</p>
            <Link to="/shop" className="btn-red">Continue Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px', alignItems: 'start' }}>
            
            {/* Cart Items List */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              {cartItems.map((item, idx) => (
                <div key={item.id} style={{ display: 'flex', gap: '24px', paddingBottom: '24px', marginBottom: '24px', borderBottom: idx !== cartItems.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                  <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--black)', margin: 0 }}>{item.name}</h3>
                      <div style={{ fontSize: '18px', fontWeight: 700 }}>£{(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                    <p style={{ fontSize: '14px', color: 'rgba(0,0,0,0.5)', margin: '0 0 16px 0' }}>{item.category}</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f5f5f5', padding: '4px', borderRadius: '6px' }}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ width: '28px', height: '28px', background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}>-</button>
                        <span style={{ fontSize: '14px', fontWeight: 600, width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: '28px', height: '28px', background: '#fff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}>+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} style={{ background: 'transparent', border: 'none', color: 'var(--red)', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--black)', marginBottom: '24px' }}>Order Summary</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '15px' }}>
                <span style={{ color: 'rgba(0,0,0,0.6)' }}>Subtotal</span>
                <span style={{ fontWeight: 600 }}>£{cartTotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '15px', paddingBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <span style={{ color: 'rgba(0,0,0,0.6)' }}>Tax</span>
                <span style={{ fontWeight: 600 }}>Included</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', fontSize: '18px' }}>
                <span style={{ fontWeight: 800, color: 'var(--black)' }}>Total</span>
                <span style={{ fontWeight: 800, color: 'var(--black)' }}>£{cartTotal.toLocaleString()}</span>
              </div>

              <button 
                onClick={handleBookOnWhatsApp}
                className="btn-red"
                style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '16px' }}
              >
                Book on WhatsApp
              </button>
              <p style={{ textAlign: 'center', fontSize: '12px', color: 'rgba(0,0,0,0.5)', marginTop: '16px', lineHeight: 1.5 }}>
                Clicking this button will open WhatsApp with your cart details pre-filled.
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
