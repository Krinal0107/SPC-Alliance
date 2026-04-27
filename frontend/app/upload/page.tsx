'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { Upload, CheckCircle, AlertCircle, MapPin, Info, FileText, Zap } from 'lucide-react'

type Step = 'form' | 'confirm' | 'success'

export default function UploadPage() {
  const [step, setStep] = useState<Step>('form')
  const [form, setForm] = useState({
    northing: '', easting: '', elevation: '',
    state: 'Ohio', zone: '', county: '',
    description: '', datum: 'NAD83(2011)',
    equipment: '', accuracy: '',
    tags: '',
    price: '10.00',
  })
  const [dragOver, setDragOver] = useState(false)
  const [bulkFile, setBulkFile] = useState<File | null>(null)

  const update = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = () => setStep('confirm')
  const handleConfirm = () => setStep('success')

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64, minHeight: '100vh', padding: '64px 24px 60px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: 40 }}>
            <div className="badge badge-blue" style={{ marginBottom: 12 }}>Upload Points</div>
            <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 40, fontWeight: 400, letterSpacing: '-0.02em', marginBottom: 8 }}>
              Monetize your survey data
            </h1>
            <p style={{ color: '#8899bb', fontSize: 15 }}>
              Upload SPC points once and earn every time another firm purchases them. All uploads are recorded on Hedera Consensus Service.
            </p>
          </div>

          {/* Progress */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 36 }}>
            {(['Point Details', 'Confirm & Price', 'Published']).map((label, i) => {
              const stepIdx = step === 'form' ? 0 : step === 'confirm' ? 1 : 2
              const active = i === stepIdx
              const done = i < stepIdx
              return (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: done ? '#1a73f5' : active ? 'rgba(26,115,245,0.2)' : 'rgba(255,255,255,0.05)',
                    border: `2px solid ${done || active ? '#1a73f5' : 'rgba(255,255,255,0.1)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 600, color: done ? 'white' : active ? '#4a9bff' : '#4a5670',
                    flexShrink: 0,
                  }}>
                    {done ? <CheckCircle size={14} /> : i + 1}
                  </div>
                  <span style={{ fontSize: 12, color: active ? '#f0f4ff' : '#4a5670', fontWeight: active ? 500 : 400 }}>{label}</span>
                  {i < 2 && <div style={{ flex: 1, height: 1, background: done ? '#1a73f5' : 'rgba(255,255,255,0.06)' }} />}
                </div>
              )
            })}
          </div>

          {/* STEP 1: Form */}
          {step === 'form' && (
            <div style={{ display: 'grid', gap: 20 }}>

              {/* Bulk upload */}
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FileText size={14} color="#4a9bff" />
                  <span style={{ fontSize: 13, fontWeight: 500 }}>Bulk Upload via CSV</span>
                  <span className="badge badge-blue" style={{ fontSize: 10, marginLeft: 'auto' }}>Optional</span>
                </div>
                <div
                  style={{
                    padding: 32, textAlign: 'center',
                    border: `2px dashed ${dragOver ? '#1a73f5' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: 12, margin: 16,
                    background: dragOver ? 'rgba(26,115,245,0.05)' : 'transparent',
                    transition: 'all 0.2s', cursor: 'pointer',
                  }}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) setBulkFile(f); }}
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <Upload size={28} color="#4a5670" style={{ marginBottom: 10 }} />
                  {bulkFile
                    ? <div style={{ color: '#10b981', fontSize: 14 }}><CheckCircle size={16} style={{ display: 'inline', marginRight: 6 }} />{bulkFile.name}</div>
                    : <>
                        <div style={{ color: '#8899bb', fontSize: 14, marginBottom: 4 }}>Drop CSV file here or click to browse</div>
                        <div style={{ color: '#4a5670', fontSize: 12 }}>Columns: northing, easting, elevation, zone, county, description, datum</div>
                      </>}
                  <input id="file-input" type="file" accept=".csv,.txt" style={{ display: 'none' }}
                    onChange={e => { if (e.target.files?.[0]) setBulkFile(e.target.files[0]) }} />
                </div>
              </div>

              {/* Manual entry */}
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={14} color="#4a9bff" /> Manual Point Entry
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
                  {[
                    { key: 'northing', label: 'Northing (ft)', placeholder: '1234567.891' },
                    { key: 'easting', label: 'Easting (ft)', placeholder: '987654.321' },
                    { key: 'elevation', label: 'Elevation (m)', placeholder: '892.45' },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label style={{ fontSize: 12, color: '#8899bb', display: 'block', marginBottom: 6 }}>{label}</label>
                      <input className="input" style={{ fontFamily: 'DM Mono, monospace' }}
                        placeholder={placeholder} value={(form as any)[key]}
                        onChange={e => update(key, e.target.value)} />
                    </div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={{ fontSize: 12, color: '#8899bb', display: 'block', marginBottom: 6 }}>State *</label>
                    <select className="input" value={form.state} onChange={e => update('state', e.target.value)} style={{ cursor: 'pointer' }}>
                      {['Ohio', 'Texas', 'California', 'Florida', 'New York', 'Illinois', 'Pennsylvania', 'Georgia', 'Michigan', 'Colorado'].map(s => (
                        <option key={s} value={s} style={{ background: '#141d35' }}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#8899bb', display: 'block', marginBottom: 6 }}>Zone *</label>
                    <input className="input" placeholder="e.g. Ohio North" value={form.zone} onChange={e => update('zone', e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#8899bb', display: 'block', marginBottom: 6 }}>County</label>
                    <input className="input" placeholder="e.g. Franklin" value={form.county} onChange={e => update('county', e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#8899bb', display: 'block', marginBottom: 6 }}>Datum</label>
                    <select className="input" value={form.datum} onChange={e => update('datum', e.target.value)} style={{ cursor: 'pointer' }}>
                      {['NAD83(2011)', 'NAVD88', 'NAD83(NSRS2007)', 'WGS84', 'UTM'].map(d => (
                        <option key={d} value={d} style={{ background: '#141d35' }}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#8899bb', display: 'block', marginBottom: 6 }}>Equipment Used</label>
                    <input className="input" placeholder="e.g. Trimble R10" value={form.equipment} onChange={e => update('equipment', e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: '#8899bb', display: 'block', marginBottom: 6 }}>Accuracy (m)</label>
                    <input className="input" style={{ fontFamily: 'DM Mono, monospace' }} placeholder="e.g. 0.005" value={form.accuracy} onChange={e => update('accuracy', e.target.value)} />
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, color: '#8899bb', display: 'block', marginBottom: 6 }}>Description *</label>
                  <textarea className="input" rows={3} placeholder="Describe the monument type, location context, and any relevant survey notes..."
                    value={form.description} onChange={e => update('description', e.target.value)}
                    style={{ resize: 'vertical', fontFamily: 'inherit' }} />
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, color: '#8899bb', display: 'block', marginBottom: 6 }}>Tags (comma-separated)</label>
                  <input className="input" placeholder="e.g. boundary, iron pin, urban, franklin county"
                    value={form.tags} onChange={e => update('tags', e.target.value)} />
                </div>
              </div>

              {/* Pricing */}
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Zap size={14} color="#4a9bff" /> Set Your Price
                </h3>
                <p style={{ fontSize: 13, color: '#8899bb', marginBottom: 16 }}>
                  You earn 70% of each purchase. Platform takes 15%, verifier takes 15% (if verified).
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ color: '#4a9bff', fontSize: 20, fontWeight: 600 }}>$</span>
                  <input className="input" style={{ maxWidth: 140, fontFamily: 'DM Serif Display, serif', fontSize: 24 }}
                    value={form.price} onChange={e => update('price', e.target.value)} type="number" min="1" step="0.5" />
                  <span style={{ color: '#8899bb', fontSize: 13 }}>USDC per purchase</span>
                </div>
                {form.price && (
                  <div style={{ marginTop: 12, padding: 12, background: 'rgba(16,185,129,0.08)', borderRadius: 8, border: '1px solid rgba(16,185,129,0.15)', fontSize: 13, color: '#34d399' }}>
                    You earn ${(parseFloat(form.price || '0') * 0.7).toFixed(2)} per purchase
                  </div>
                )}
              </div>

              <button className="btn-primary" style={{ padding: '14px 32px', fontSize: 15, alignSelf: 'flex-start' }}
                onClick={handleSubmit}>
                Preview & Submit →
              </button>
            </div>
          )}

          {/* STEP 2: Confirm */}
          {step === 'confirm' && (
            <div className="card" style={{ padding: 32 }}>
              <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 28, marginBottom: 24 }}>Confirm Your Upload</h2>

              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 20, marginBottom: 20, fontFamily: 'DM Mono, monospace', fontSize: 13, lineHeight: 2, color: '#8899bb' }}>
                <div><span style={{ color: '#4a5670' }}>State:</span> <span style={{ color: '#f0f4ff' }}>{form.state}</span></div>
                <div><span style={{ color: '#4a5670' }}>Zone:</span> <span style={{ color: '#f0f4ff' }}>{form.zone || '—'}</span></div>
                <div><span style={{ color: '#4a5670' }}>Northing:</span> <span style={{ color: '#4a9bff' }}>{form.northing || '—'}</span></div>
                <div><span style={{ color: '#4a5670' }}>Easting:</span> <span style={{ color: '#4a9bff' }}>{form.easting || '—'}</span></div>
                <div><span style={{ color: '#4a5670' }}>Elevation:</span> <span style={{ color: '#4a9bff' }}>{form.elevation || '—'}m</span></div>
                <div><span style={{ color: '#4a5670' }}>Datum:</span> <span style={{ color: '#f0f4ff' }}>{form.datum}</span></div>
                <div><span style={{ color: '#4a5670' }}>Price:</span> <span style={{ color: '#10b981' }}>${form.price} USDC</span></div>
                <div><span style={{ color: '#4a5670' }}>Your earnings:</span> <span style={{ color: '#10b981' }}>${(parseFloat(form.price || '0') * 0.7).toFixed(2)} per purchase</span></div>
              </div>

              <div style={{ padding: 16, background: 'rgba(26,115,245,0.08)', borderRadius: 10, border: '1px solid rgba(26,115,245,0.2)', fontSize: 13, color: '#8899bb', marginBottom: 24, display: 'flex', gap: 10 }}>
                <Info size={16} color="#4a9bff" style={{ flexShrink: 0, marginTop: 1 }} />
                <span>Submitting will record ownership of this point on the <strong style={{ color: '#4a9bff' }}>Hedera Consensus Service</strong>. This is permanent and immutable. You may set the point to unlist later but ownership record remains on-chain.</span>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn-ghost" onClick={() => setStep('form')}>← Go Back</button>
                <button className="btn-primary" onClick={handleConfirm} style={{ padding: '12px 28px' }}>
                  Confirm & Publish on HCS
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Success */}
          {step === 'success' && (
            <div className="card" style={{ padding: 48, textAlign: 'center' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'rgba(16,185,129,0.15)',
                border: '2px solid rgba(16,185,129,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px',
              }}>
                <CheckCircle size={32} color="#10b981" />
              </div>
              <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, marginBottom: 12 }}>Point Published!</h2>
              <p style={{ color: '#8899bb', fontSize: 15, marginBottom: 8 }}>
                Your coordinate has been recorded on the Hedera Consensus Service.
              </p>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, color: '#4a9bff', background: 'rgba(26,115,245,0.08)', padding: '8px 16px', borderRadius: 8, display: 'inline-block', marginBottom: 32 }}>
                SPC-{form.state.slice(0, 2).toUpperCase()}-{Math.floor(Math.random() * 900 + 100)}
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button className="btn-ghost" onClick={() => setStep('form')}>Upload Another Point</button>
                <a href="/dashboard" className="btn-primary">View My Dashboard →</a>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
