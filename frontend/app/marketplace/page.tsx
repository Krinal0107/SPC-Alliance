'use client'
import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { mockPoints, states, type SPCPoint } from '@/lib/data'
import { Search, Filter, CheckCircle, Clock, ShoppingCart, MapPin, ChevronDown, X } from 'lucide-react'

export default function Marketplace() {
  const [search, setSearch] = useState('')
  const [selectedState, setSelectedState] = useState('All States')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sortBy, setSortBy] = useState('recent')
  const [cart, setCart] = useState<string[]>([])
  const [selected, setSelected] = useState<SPCPoint | null>(null)

  const filtered = mockPoints.filter(p => {
    if (verifiedOnly && !p.verified) return false
    if (selectedState !== 'All States' && p.state !== selectedState) return false
    if (search) {
      const q = search.toLowerCase()
      return p.id.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.county.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    }
    return true
  })

  const toggleCart = (id: string) => {
    setCart(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
  }

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, minHeight: '100vh' }}>

        {/* Header */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '32px 24px',
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, fontWeight: 400, marginBottom: 8 }}>
              SPC Point Marketplace
            </h1>
            <p style={{ color: '#8899bb', fontSize: 15 }}>
              Browse <strong style={{ color: '#f0f4ff' }}>847,329</strong> verified coordinate points from <strong style={{ color: '#f0f4ff' }}>312</strong> survey firms across the US
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px', display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>

          {/* Sidebar filters */}
          <aside>
            <div className="card" style={{ padding: 20, position: 'sticky', top: 80 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 16, color: '#f0f4ff', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Filter size={14} /> Filters
              </div>

              {/* Search */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: '#8899bb', marginBottom: 6, display: 'block' }}>Search</label>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4a5670' }} />
                  <input
                    className="input"
                    style={{ paddingLeft: 36 }}
                    placeholder="ID, state, county..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* State */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: '#8899bb', marginBottom: 6, display: 'block' }}>State</label>
                <select
                  className="input"
                  value={selectedState}
                  onChange={e => setSelectedState(e.target.value)}
                  style={{ cursor: 'pointer' }}
                >
                  {states.map(s => <option key={s} value={s} style={{ background: '#141d35' }}>{s}</option>)}
                </select>
              </div>

              {/* Sort */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, color: '#8899bb', marginBottom: 6, display: 'block' }}>Sort By</label>
                <select
                  className="input"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  style={{ cursor: 'pointer' }}
                >
                  <option value="recent" style={{ background: '#141d35' }}>Most Recent</option>
                  <option value="price_asc" style={{ background: '#141d35' }}>Price: Low to High</option>
                  <option value="price_desc" style={{ background: '#141d35' }}>Price: High to Low</option>
                  <option value="popular" style={{ background: '#141d35' }}>Most Purchased</option>
                </select>
              </div>

              {/* Verified toggle */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 13, color: '#f0f4ff' }}>Verified Only</span>
                <button
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                  style={{
                    width: 44, height: 24, borderRadius: 12,
                    background: verifiedOnly ? '#1a73f5' : 'rgba(255,255,255,0.1)',
                    border: 'none', cursor: 'pointer', position: 'relative',
                    transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%', background: 'white',
                    position: 'absolute', top: 3,
                    left: verifiedOnly ? 23 : 3,
                    transition: 'left 0.2s',
                  }} />
                </button>
              </div>

              {/* Cart */}
              {cart.length > 0 && (
                <div style={{ marginTop: 16, padding: 16, background: 'rgba(26,115,245,0.1)', borderRadius: 12, border: '1px solid rgba(26,115,245,0.2)' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#4a9bff', marginBottom: 8 }}>
                    <ShoppingCart size={14} style={{ display: 'inline', marginRight: 6 }} />
                    {cart.length} point{cart.length > 1 ? 's' : ''} in cart
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#f0f4ff', marginBottom: 12 }}>
                    ${mockPoints.filter(p => cart.includes(p.id)).reduce((a, p) => a + p.price, 0).toFixed(2)}
                  </div>
                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px' }}>
                    Checkout with USDC
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* Results */}
          <div>
            <div style={{ fontSize: 13, color: '#8899bb', marginBottom: 16 }}>
              Showing {filtered.length} points
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filtered.map(point => (
                <div key={point.id} className="card" style={{ padding: 20, cursor: 'pointer' }}
                  onClick={() => setSelected(point)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: '#4a9bff', fontWeight: 500 }}>{point.id}</span>
                        {point.verified
                          ? <span className="badge badge-green" style={{ fontSize: 11 }}><CheckCircle size={10} /> Verified</span>
                          : <span className="badge badge-amber" style={{ fontSize: 11 }}><Clock size={10} /> Pending</span>}
                        <span className="badge" style={{ fontSize: 11, background: 'rgba(255,255,255,0.05)', color: '#8899bb', border: '1px solid rgba(255,255,255,0.08)' }}>
                          <MapPin size={10} /> {point.state}
                        </span>
                      </div>
                      <p style={{ fontSize: 13, color: '#8899bb', marginBottom: 10, lineHeight: 1.5 }}>{point.description}</p>
                      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#4a5670' }}>
                          N {point.northing.toFixed(3)}
                        </span>
                        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#4a5670' }}>
                          E {point.easting.toFixed(3)}
                        </span>
                        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#4a5670' }}>
                          Z {point.elevation}m
                        </span>
                        <span style={{ fontSize: 11, color: '#4a5670' }}>±{point.accuracy}m accuracy</span>
                        <span style={{ fontSize: 11, color: '#4a5670' }}>{point.datum}</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: '#f0f4ff' }}>
                        ${point.price.toFixed(2)}
                      </div>
                      <div style={{ fontSize: 11, color: '#4a5670', marginBottom: 12 }}>USDC</div>
                      <button
                        className={cart.includes(point.id) ? 'btn-ghost' : 'btn-primary'}
                        style={{ padding: '8px 16px', fontSize: 12 }}
                        onClick={e => { e.stopPropagation(); toggleCart(point.id); }}
                      >
                        {cart.includes(point.id) ? '✓ Added' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>

                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {point.tags.slice(0, 3).map(tag => (
                        <span key={tag} style={{
                          fontSize: 10, padding: '2px 8px', borderRadius: 4,
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          color: '#4a5670',
                        }}>{tag}</span>
                      ))}
                    </div>
                    <span style={{ fontSize: 11, color: '#4a5670' }}>{point.purchaseCount} purchases · {point.firm}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detail Modal */}
        {selected && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }} onClick={() => setSelected(null)}>
            <div style={{
              background: '#141d35', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 20, padding: 32, maxWidth: 600, width: '100%',
              maxHeight: '85vh', overflowY: 'auto',
            }} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 14, color: '#4a9bff', marginBottom: 4 }}>{selected.id}</div>
                  <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, fontWeight: 400 }}>Point Details</h2>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#8899bb' }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Northing', val: selected.northing.toFixed(3) },
                  { label: 'Easting', val: selected.easting.toFixed(3) },
                  { label: 'Elevation', val: `${selected.elevation}m` },
                  { label: 'Accuracy', val: `±${selected.accuracy}m` },
                  { label: 'Datum', val: selected.datum },
                  { label: 'Zone', val: selected.zone },
                  { label: 'Equipment', val: selected.equipment },
                  { label: 'County', val: selected.county },
                ].map(({ label, val }) => (
                  <div key={label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 12 }}>
                    <div style={{ fontSize: 11, color: '#4a5670', marginBottom: 4 }}>{label}</div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: '#f0f4ff' }}>{val}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 14, marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: '#4a5670', marginBottom: 6 }}>Description</div>
                <p style={{ fontSize: 13, color: '#8899bb', lineHeight: 1.6 }}>{selected.description}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 12, color: '#4a5670' }}>Uploaded by</div>
                  <div style={{ fontSize: 14, color: '#f0f4ff', fontWeight: 500 }}>{selected.firm}</div>
                  {selected.verified && (
                    <div style={{ fontSize: 12, color: '#10b981', marginTop: 2 }}>
                      <CheckCircle size={12} style={{ display: 'inline', marginRight: 4 }} />
                      Verified by {selected.verifiedBy}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, color: '#f0f4ff' }}>${selected.price.toFixed(2)}</div>
                  <div style={{ fontSize: 12, color: '#4a5670' }}>{selected.purchaseCount} prior purchases</div>
                </div>
              </div>

              <button
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: 15 }}
                onClick={() => { toggleCart(selected.id); setSelected(null); }}
              >
                {cart.includes(selected.id) ? 'Remove from Cart' : 'Purchase with USDC'} <ShoppingCart size={16} />
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
