import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function AccountPage() {
  const { user, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', padding: 'calc(var(--nav-h) + 40px) 24px 80px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: 'clamp(40px, 5.5vw, 64px)', fontWeight: 900, color: 'var(--black)', fontFamily: 'var(--font)', letterSpacing: '-1.5px', marginBottom: '32px', lineHeight: '1.1' }}>My Account</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }}>
          
          {/* Account Details */}
          <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--black)', marginBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '16px' }}>
              Account Details
            </h2>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: 'rgba(0,0,0,0.5)', marginBottom: '8px' }}>Email Address</label>
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--black)' }}>
                {user?.email}
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: 'rgba(0,0,0,0.5)', marginBottom: '8px' }}>Account Status</label>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.1)', padding: '4px 12px', borderRadius: '20px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></div>
                Active
              </div>
            </div>

            {isAdmin && (
              <div style={{ marginBottom: '32px', padding: '16px', background: 'rgba(232,0,13,0.05)', borderRadius: '12px', border: '1px solid rgba(232,0,13,0.1)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--red)', marginBottom: '8px' }}>Admin Controls</h3>
                <p style={{ fontSize: '14px', color: 'rgba(0,0,0,0.7)', marginBottom: '16px' }}>You have administrator privileges. You can manage products and view store statistics from the dashboard.</p>
                <Link to="/admin" className="btn-red" style={{ display: 'inline-block', padding: '10px 20px', fontSize: '14px' }}>
                  Open Admin Dashboard
                </Link>
              </div>
            )}

            <button 
              onClick={handleLogout}
              className="btn-red"
              style={{ padding: '12px 24px', fontSize: '14px', borderRadius: '8px', border: 'none', fontWeight: 700, cursor: 'pointer' }}
            >
              Sign Out
            </button>
          </div>

          {/* Order History Placeholder */}
          <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--black)', marginBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '16px' }}>
              Order History
            </h2>
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <p style={{ color: 'rgba(0,0,0,0.5)', fontSize: '15px' }}>You haven't placed any orders yet.</p>
              <Link to="/shop" style={{ color: 'var(--red)', fontWeight: 700, fontSize: '15px', display: 'inline-block', marginTop: '12px' }}>Browse Products</Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
