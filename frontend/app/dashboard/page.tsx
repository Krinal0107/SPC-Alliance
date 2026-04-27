'use client'
import Navbar from '@/components/Navbar'
import { TrendingUp, MapPin, ShoppingBag, DollarSign, CheckCircle, Clock, Upload, BarChart2, Activity } from 'lucide-react'

const myPoints = [
  { id: 'SPC-OH-001', state: 'Ohio', county: 'Franklin', verified: true, purchases: 8, earnings: 70.00, price: 12.50, uploadedAt: '2024-11-15' },
  { id: 'SPC-OH-004', state: 'Ohio', county: 'Delaware', verified: false, purchases: 2, earnings: 14.00, price: 10.00, uploadedAt: '2024-12-01' },
  { id: 'SPC-OH-007', state: 'Ohio', county: 'Franklin', verified: true, purchases: 5, earnings: 43.75, price: 12.50, uploadedAt: '2024-10-18' },
]

const purchases = [
  { id: 'SPC-TX-044', state: 'Texas', date: '2024-12-10', amount: 18.00 },
  { id: 'SPC-FL-087', state: 'Florida', date: '2024-11-28', amount: 22.00 },
  { id: 'SPC-IL-156', state: 'Illinois', date: '2024-11-15', amount: 15.00 },
]

const chartData = [
  { month: 'Jul', uploads: 8, earnings: 32 },
  { month: 'Aug', uploads: 14, earnings: 63 },
  { month: 'Sep', uploads: 11, earnings: 54 },
  { month: 'Oct', uploads: 19, earnings: 98 },
  { month: 'Nov', uploads: 23, earnings: 127 },
  { month: 'Dec', uploads: 17, earnings: 127.75 },
]
const maxEarnings = Math.max(...chartData.map(d => d.earnings))

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, minHeight: '100vh', padding: '64px 24px 60px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, fontWeight: 400, marginBottom: 4 }}>Dashboard</h1>
              <p style={{ color: '#8899bb', fontSize: 14 }}>Welcome back, <strong style={{ color: '#f0f4ff' }}>Exacta Land Services</strong></p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <a href="/upload" className="btn-primary" style={{ fontSize: 13, padding: '10px 20px' }}>
                <Upload size={14} /> Upload Points
              </a>
              <a href="/marketplace" className="btn-ghost" style={{ fontSize: 13, padding: '10px 20px' }}>
                Browse Market
              </a>
            </div>
          </div>

          {/* KPI cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
            {[
              { icon: <MapPin size={20} />, label: 'Points Uploaded', val: '3', sub: '+2 this month', color: '#1a73f5' },
              { icon: <DollarSign size={20} />, label: 'Total Earnings', val: '$127.75', sub: 'USDC lifetime', color: '#10b981' },
              { icon: <ShoppingBag size={20} />, label: 'Total Purchases', val: '15', sub: 'across all points', color: '#f59e0b' },
              { icon: <TrendingUp size={20} />, label: 'Pending Verification', val: '1', sub: 'point awaiting review', color: '#8b5cf6' },
            ].map(({ icon, label, val, sub, color }) => (
              <div key={label} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ color: '#8899bb', fontSize: 12 }}>{label}</div>
                  <div style={{ color, opacity: 0.8 }}>{icon}</div>
                </div>
                <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 32, color: '#f0f4ff', marginBottom: 4 }}>{val}</div>
                <div style={{ fontSize: 12, color: '#4a5670' }}>{sub}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 20 }}>

            {/* Earnings chart */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BarChart2 size={14} color="#4a9bff" /> Monthly Earnings (USDC)
                </h3>
                <span className="badge badge-green" style={{ fontSize: 11 }}>+34% MoM</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140 }}>
                {chartData.map(({ month, earnings }) => (
                  <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 10, color: '#4a5670' }}>${earnings}</span>
                    <div style={{
                      width: '100%', borderRadius: '4px 4px 0 0',
                      background: `linear-gradient(to top, #1a73f5, #4a9bff)`,
                      height: `${(earnings / maxEarnings) * 110}px`,
                      opacity: month === 'Dec' ? 1 : 0.6,
                      transition: 'opacity 0.2s',
                    }} />
                    <span style={{ fontSize: 11, color: '#4a5670' }}>{month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Wallet */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Activity size={14} color="#4a9bff" /> Wallet
              </h3>
              <div style={{ background: 'linear-gradient(135deg, #0a40b8, #1a73f5)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Available Balance</div>
                <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, color: 'white', marginBottom: 8 }}>$127.75</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Mono, monospace' }}>0x1a2b...3c4d (Hedera)</div>
              </div>
              <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 8 }}>
                Withdraw to Bank
              </button>
              <button className="btn-ghost" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}>
                Add USDC
              </button>
              <div style={{ marginTop: 16, padding: 12, background: 'rgba(255,255,255,0.03)', borderRadius: 8, fontSize: 12, color: '#4a5670', textAlign: 'center' }}>
                Powered by Hedera Consensus Service
              </div>
            </div>
          </div>

          {/* My Points */}
          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={14} color="#4a9bff" /> My Uploaded Points
              </h3>
              <a href="/upload" style={{ fontSize: 13, color: '#4a9bff', textDecoration: 'none' }}>+ Upload New</a>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['Point ID', 'Location', 'Status', 'Purchases', 'Earnings', 'Price', 'Uploaded'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, color: '#4a5670', fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {myPoints.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '14px 12px', fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#4a9bff' }}>{p.id}</td>
                      <td style={{ padding: '14px 12px', fontSize: 13, color: '#8899bb' }}>{p.county}, {p.state}</td>
                      <td style={{ padding: '14px 12px' }}>
                        {p.verified
                          ? <span className="badge badge-green" style={{ fontSize: 11 }}><CheckCircle size={10} /> Verified</span>
                          : <span className="badge badge-amber" style={{ fontSize: 11 }}><Clock size={10} /> Pending</span>}
                      </td>
                      <td style={{ padding: '14px 12px', fontSize: 13, color: '#f0f4ff', textAlign: 'center' }}>{p.purchases}</td>
                      <td style={{ padding: '14px 12px', fontSize: 13, color: '#10b981', fontWeight: 500 }}>${p.earnings.toFixed(2)}</td>
                      <td style={{ padding: '14px 12px', fontSize: 13, color: '#f0f4ff' }}>${p.price.toFixed(2)}</td>
                      <td style={{ padding: '14px 12px', fontSize: 12, color: '#4a5670' }}>{p.uploadedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Purchases */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <ShoppingBag size={14} color="#4a9bff" /> Points I've Purchased
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {purchases.map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                  <div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, color: '#4a9bff', marginBottom: 2 }}>{p.id}</div>
                    <div style={{ fontSize: 12, color: '#4a5670' }}>{p.state} · {p.date}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#f0f4ff' }}>${p.amount.toFixed(2)} USDC</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </>
  )
}
