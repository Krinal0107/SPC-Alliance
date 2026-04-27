'use client'
import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Eye, EyeOff, CheckCircle, Zap, AlertCircle } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

function AuthForm() {
  const params = useSearchParams()
  const router = useRouter()
  const [mode, setMode] = useState<'signin' | 'signup'>(
    params.get('mode') === 'signup' ? 'signup' : 'signin'
  )
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({ email: '', password: '', firmName: '', role: 'owner' })

  const update = (k: string, v: string) => { setForm(prev => ({ ...prev, [k]: v })); setError('') }

  const handleSubmit = async () => {
    setLoading(true); setError(''); setSuccess('')
    try {
      const endpoint = mode === 'signup' ? '/auth/signup' : '/auth/signin'
      const body = mode === 'signup'
        ? { email: form.email, password: form.password, firmName: form.firmName, role: form.role, name: form.firmName }
        : { email: form.email, password: form.password }

      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (!data.success) {
        setError(data.errors ? data.errors.map((e: any) => e.msg).join('. ') : data.message || 'Something went wrong.')
        setLoading(false); return
      }

      localStorage.setItem('spc_token', data.accessToken)
      localStorage.setItem('spc_user', JSON.stringify(data.user))
      setSuccess(mode === 'signup' ? `Account created! Welcome 🎉` : `Welcome back!`)
      setTimeout(() => router.push('/dashboard'), 1000)
    } catch {
      setError('Cannot connect to server. Make sure the backend is running on port 8000.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)' }}>
      {/* Left */}
      <div style={{ flex: 1, padding: 60, background: 'linear-gradient(135deg,#0a1428,#0f1e3d)', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#1a73f5,#0a40b8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MapPin size={20} color="white" /></div>
          <span style={{ fontFamily: 'DM Serif Display,serif', fontSize: 22, color: '#f0f4ff' }}>SPC Alliance</span>
        </Link>
        <div>
          <h2 style={{ fontFamily: 'DM Serif Display,serif', fontSize: 40, fontWeight: 400, lineHeight: 1.2, color: '#f0f4ff', marginBottom: 24 }}>
            The coordinate marketplace<br /><em style={{ color: '#4a9bff' }}>built for surveyors</em>
          </h2>
          {['Upload points once, earn passively forever', 'All ownership recorded on Hedera HCS', 'Smart contracts distribute revenue automatically', 'Access 847K+ verified coordinates instantly'].map(t => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <CheckCircle size={16} color="#10b981" />
              <span style={{ fontSize: 14, color: '#8899bb' }}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: '#4a5670' }}>© 2025 SPC Alliance. Built on Hedera.</div>
      </div>

      {/* Right */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          {/* Mode tabs */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4, marginBottom: 32, border: '1px solid rgba(255,255,255,0.06)' }}>
            {[['signin','Sign In'],['signup','Create Account']].map(([m,label]) => (
              <button key={m} onClick={() => { setMode(m as any); setError(''); setSuccess('') }} style={{ flex: 1, padding: '10px', borderRadius: 9, border: 'none', cursor: 'pointer', background: mode===m?'#1a73f5':'transparent', color: mode===m?'white':'#8899bb', fontSize: 14, fontWeight: 500, fontFamily: 'DM Sans,sans-serif', transition: 'all 0.2s' }}>{label}</button>
            ))}
          </div>

          <h1 style={{ fontFamily: 'DM Serif Display,serif', fontSize: 30, fontWeight: 400, marginBottom: 6 }}>
            {mode==='signin' ? 'Welcome back' : 'Join SPC Alliance'}
          </h1>
          <p style={{ color: '#8899bb', fontSize: 14, marginBottom: 24 }}>
            {mode==='signin' ? 'Sign in to your firm account' : 'Create your account and start uploading points'}
          </p>

          {error && (
            <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 16, background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', display: 'flex', gap: 10 }}>
              <AlertCircle size={16} color="#f87171" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: '#f87171' }}>{error}</span>
            </div>
          )}
          {success && (
            <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 16, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', gap: 10 }}>
              <CheckCircle size={16} color="#34d399" />
              <span style={{ fontSize: 13, color: '#34d399' }}>{success}</span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mode==='signup' && (
              <>
                <div>
                  <label style={{ fontSize: 12, color: '#8899bb', display: 'block', marginBottom: 6 }}>Firm / Company Name *</label>
                  <input className="input" placeholder="Exacta Land Services, Inc." value={form.firmName} onChange={e => update('firmName', e.target.value)} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: '#8899bb', display: 'block', marginBottom: 6 }}>Your Role</label>
                  <select className="input" value={form.role} onChange={e => update('role', e.target.value)} style={{ cursor: 'pointer' }}>
                    <option value="owner" style={{ background: '#141d35' }}>Owner / Partner</option>
                    <option value="surveyor" style={{ background: '#141d35' }}>Licensed Surveyor</option>
                    <option value="technician" style={{ background: '#141d35' }}>Survey Technician</option>
                    <option value="admin" style={{ background: '#141d35' }}>Office Admin</option>
                  </select>
                </div>
              </>
            )}
            <div>
              <label style={{ fontSize: 12, color: '#8899bb', display: 'block', marginBottom: 6 }}>Email Address *</label>
              <input className="input" type="email" placeholder="you@surveyfirm.com" value={form.email} onChange={e => update('email', e.target.value)} onKeyDown={e => e.key==='Enter' && handleSubmit()} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#8899bb', display: 'block', marginBottom: 6 }}>Password * {mode==='signup' && <span style={{ color: '#4a5670' }}>(min 6 chars)</span>}</label>
              <div style={{ position: 'relative' }}>
                <input className="input" type={showPass?'text':'password'} placeholder="••••••••••" value={form.password} onChange={e => update('password', e.target.value)} onKeyDown={e => e.key==='Enter' && handleSubmit()} style={{ paddingRight: 44 }} />
                <button onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#4a5670' }}>
                  {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: 15, opacity: loading?0.7:1 }} onClick={handleSubmit} disabled={loading}>
              {loading ? 'Please wait...' : mode==='signin' ? 'Sign In →' : 'Create Account →'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ fontSize: 12, color: '#4a5670' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            </div>

            <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center', padding: 12, fontSize: 14 }} onClick={() => window.location.href=`${API}/auth/google`}>
              <svg width="18" height="18" viewBox="0 0 48 48" style={{ marginRight: 6 }}>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>

            {mode==='signup' && (
              <div style={{ padding: 14, background: 'rgba(26,115,245,0.08)', borderRadius: 10, border: '1px solid rgba(26,115,245,0.15)', fontSize: 12, color: '#8899bb', display: 'flex', gap: 10 }}>
                <Zap size={14} color="#4a9bff" style={{ flexShrink: 0, marginTop: 1 }} />
                A Web3 wallet is automatically created to receive USDC earnings via Hedera smart contracts.
              </div>
            )}

            <div style={{ textAlign: 'center', fontSize: 13, color: '#4a5670' }}>
              {mode==='signin'
                ? <>No account? <button onClick={() => { setMode('signup'); setError('') }} style={{ color: '#4a9bff', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>Sign up free</button></>
                : <>Already registered? <button onClick={() => { setMode('signin'); setError('') }} style={{ color: '#4a9bff', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>Sign in</button></>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0a0f1e' }} />}>
      <AuthForm />
    </Suspense>
  )
}
