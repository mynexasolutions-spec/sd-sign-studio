import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    // Check role to redirect
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', data.user.id)
      .single()

    toast.success('Logged in successfully!')
    if (roleData?.role === 'admin') {
      navigate('/admin')
    } else {
      navigate('/shop')
    }
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '440px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
        <h1 style={{ fontSize: 'clamp(40px, 5.5vw, 64px)', fontWeight: 900, color: 'var(--black)', marginBottom: '8px', fontFamily: 'var(--font)', letterSpacing: '-1.5px', textAlign: 'center', lineHeight: '1.1' }}>Welcome Back</h1>
        <p style={{ color: 'rgba(0,0,0,0.5)', textAlign: 'center', marginBottom: '32px' }}>Sign in to your account</p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: 'var(--black)', marginBottom: '8px' }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" 
              required
              style={{ width: '100%', padding: '12px 16px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', fontSize: '15px', fontFamily: 'var(--font)', outline: 'none', color: 'var(--black)', background: '#fff' }} 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: 'var(--black)', marginBottom: '8px' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" 
              required
              style={{ width: '100%', padding: '12px 16px', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', fontSize: '15px', fontFamily: 'var(--font)', outline: 'none', color: 'var(--black)', background: '#fff' }} 
            />
          </div>

          <button disabled={loading} type="submit" className="btn-red" style={{ marginTop: '12px', width: '100%', justifyContent: 'center' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'rgba(0,0,0,0.6)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--red)', fontWeight: 700 }}>Register here</Link>
        </div>
      </div>
    </div>
  )
}
