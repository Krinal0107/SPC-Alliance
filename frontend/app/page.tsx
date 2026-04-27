import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { MapPin, Shield, Zap, Globe, ArrowRight, CheckCircle, TrendingUp, Users, Database } from 'lucide-react'

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 64 }}>

        {/* HERO */}
        <section className="grid-bg" style={{
          minHeight: '92vh',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '80px 24px 60px',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Glow orb */}
          <div style={{
            position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
            width: 600, height: 600, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(26,115,245,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* Floating coordinate dots */}
          {[
            { top: '25%', left: '12%', delay: '0s', coord: 'N 1,234,567.89' },
            { top: '60%', left: '8%', delay: '1s', coord: 'E 987,654.32' },
            { top: '30%', right: '10%', delay: '0.5s', coord: 'Z 892.45m' },
            { top: '65%', right: '12%', delay: '1.5s', coord: 'OH-NORTH' },
          ].map(({ top, left, right, delay, coord }, i) => (
            <div key={i} style={{
              position: 'absolute', top, left, right,
              animation: `float 4s ease-in-out ${delay} infinite`,
            }}>
              <div style={{
                background: 'rgba(20,29,53,0.9)',
                border: '1px solid rgba(26,115,245,0.3)',
                borderRadius: 8, padding: '6px 12px',
                fontFamily: 'DM Mono, monospace', fontSize: 11,
                color: '#4a9bff',
              }}>{coord}</div>
            </div>
          ))}

          <div style={{ textAlign: 'center', maxWidth: 760, position: 'relative', zIndex: 1 }}>
            <div className="badge badge-blue animate-fade-up" style={{ marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4a9bff', display: 'inline-block' }} />
              Powered by Hedera Consensus Service
            </div>

            <h1 className="animate-fade-up delay-100" style={{
              fontFamily: 'DM Serif Display, serif',
              fontSize: 'clamp(42px, 7vw, 80px)',
              fontWeight: 400, lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#f0f4ff',
              marginBottom: 24,
              opacity: 0,
            }}>
              The Global Marketplace<br />
              <em style={{ color: '#4a9bff', fontStyle: 'italic' }}>for Survey Points</em>
            </h1>

            <p className="animate-fade-up delay-200" style={{
              fontSize: 18, color: '#8899bb', lineHeight: 1.7,
              maxWidth: 560, margin: '0 auto 40px',
              opacity: 0,
            }}>
              Buy and sell State Plane Coordinate points. Stop paying for redundant fieldwork.
              Access verified SPCS data from firms across the US — instantly.
            </p>

            <div className="animate-fade-up delay-300" style={{
              display: 'flex', gap: 12, justifyContent: 'center',
              flexWrap: 'wrap', opacity: 0,
            }}>
              <Link href="/marketplace" className="btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>
                Browse Points <ArrowRight size={16} />
              </Link>
              <Link href="/upload" className="btn-ghost" style={{ fontSize: 16, padding: '14px 32px' }}>
                Upload Your Data
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="animate-fade-up delay-400" style={{
            display: 'flex', gap: 48, marginTop: 72,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: 40, opacity: 0,
            flexWrap: 'wrap', justifyContent: 'center',
          }}>
            {[
              { num: '847K+', label: 'SPC Points Available' },
              { num: '312', label: 'Survey Firms' },
              { num: '2,841', label: 'Points Purchased' },
              { num: '$2.6M', label: 'Total Value Locked' },
            ].map(({ num, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 32, color: '#f0f4ff', letterSpacing: '-0.02em' }}>{num}</div>
                <div style={{ fontSize: 13, color: '#4a5670', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" style={{ padding: '100px 24px', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="badge badge-blue" style={{ marginBottom: 16 }}>How It Works</div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 42, fontWeight: 400, letterSpacing: '-0.02em', marginBottom: 16 }}>
              Three steps to smarter surveying
            </h2>
            <p style={{ color: '#8899bb', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
              No more redundant field visits. Access the coordinates you need or monetize the ones you have.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {[
              {
                step: '01', icon: <Database size={24} />,
                title: 'Upload Your Points',
                desc: 'Survey firms upload their SPCS data. Each point is recorded on the Hedera Consensus Service, establishing immutable ownership. Points can optionally be verified by third-party firms.',
                color: '#1a73f5',
              },
              {
                step: '02', icon: <Globe size={24} />,
                title: 'Search & Discover',
                desc: 'Browse millions of verified coordinate points by state, zone, county, or proximity. View accuracy ratings, datum info, and equipment used before purchasing.',
                color: '#10b981',
              },
              {
                step: '03', icon: <Zap size={24} />,
                title: 'Buy & Deploy',
                desc: 'Purchase points instantly in USDC via smart contract. Revenue is automatically distributed to the point owner, verifiers, and platform. No middlemen.',
                color: '#f59e0b',
              },
            ].map(({ step, icon, title, desc, color }) => (
              <div key={step} className="card" style={{ padding: 32 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: `${color}20`,
                  border: `1px solid ${color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color, marginBottom: 20,
                }}>{icon}</div>
                <div style={{ fontSize: 11, color: '#4a5670', fontFamily: 'DM Mono, monospace', marginBottom: 8 }}>STEP {step}</div>
                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, color: '#f0f4ff' }}>{title}</h3>
                <p style={{ color: '#8899bb', lineHeight: 1.7, fontSize: 14 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
              {[
                { icon: <Shield size={20} />, title: 'Verified Accuracy', desc: 'Third-party verification by licensed survey firms with accuracy ratings down to 3mm.' },
                { icon: <Zap size={20} />, title: 'Instant Smart Contracts', desc: 'Purchases execute Hedera smart contracts. Revenue splits automatically among owner, verifiers, platform.' },
                { icon: <Globe size={20} />, title: 'Global Coverage', desc: 'SPCS for US, British National Grid, and UTM support for worldwide surveying networks.' },
                { icon: <TrendingUp size={20} />, title: 'Earn Passively', desc: 'Upload once, earn every time your point is purchased. Your legacy data becomes an asset.' },
                { icon: <Users size={20} />, title: 'Firm Accounts', desc: 'Multi-user firm accounts with role-based access, bulk upload tools, and revenue reporting.' },
                { icon: <Database size={20} />, title: 'HCS Immutability', desc: 'Every point recorded on Hedera Consensus Service. Ownership is provable and permanent.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} style={{ padding: 24, display: 'flex', gap: 16 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: 'rgba(26,115,245,0.1)',
                    border: '1px solid rgba(26,115,245,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#4a9bff', flexShrink: 0,
                  }}>{icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#f0f4ff', marginBottom: 6 }}>{title}</div>
                    <div style={{ color: '#8899bb', fontSize: 13, lineHeight: 1.6 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MARKET SIZE */}
        <section style={{ padding: '100px 24px', maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div className="badge badge-blue" style={{ marginBottom: 20 }}>Market Opportunity</div>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 42, fontWeight: 400, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Billions of points. Zero public source.
          </h2>
          <p style={{ color: '#8899bb', fontSize: 16, maxWidth: 600, margin: '0 auto 60px', lineHeight: 1.7 }}>
            The US has 158 million individual parcels of land — each with multiple corners. Roadways, waterways, railways, easements, utilities, and topography all defined by SPC points. The US represents less than 2% of the earth's land surface.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {[
              { num: '158M', label: 'US Land Parcels', sub: 'Each with multiple corners' },
              { num: 'Billions', label: 'Total SPC Points', sub: 'US alone — untapped data' },
              { num: '17,000+', label: 'Survey Firms', sub: 'US national marketing target' },
              { num: '2%', label: 'US Land Surface', sub: 'Global expansion opportunity' },
            ].map(({ num, label, sub }) => (
              <div key={label} className="card" style={{ padding: '28px 20px' }}>
                <div style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, color: '#4a9bff', marginBottom: 8 }}>{num}</div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#f0f4ff', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 12, color: '#4a5670' }}>{sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section style={{ padding: '80px 24px', background: 'rgba(26,115,245,0.03)', borderTop: '1px solid rgba(26,115,245,0.1)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <div className="badge badge-blue" style={{ marginBottom: 20 }}>Revenue Model</div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 40, fontWeight: 400, letterSpacing: '-0.02em', marginBottom: 48 }}>
              Fair revenue for everyone
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
              {[
                { pct: '70%', who: 'Point Owner', desc: 'The firm that uploaded the coordinate', color: '#1a73f5' },
                { pct: '15%', who: 'Verifier', desc: 'Third-party firm that confirmed accuracy', color: '#10b981' },
                { pct: '15%', who: 'Platform', desc: 'SPC Alliance hosting and infrastructure', color: '#f59e0b' },
              ].map(({ pct, who, desc, color }) => (
                <div key={who} className="card" style={{ padding: 28 }}>
                  <div style={{ fontSize: 48, fontFamily: 'DM Serif Display, serif', color, marginBottom: 12 }}>{pct}</div>
                  <div style={{ fontWeight: 600, fontSize: 16, color: '#f0f4ff', marginBottom: 6 }}>{who}</div>
                  <div style={{ fontSize: 13, color: '#8899bb' }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section style={{ padding: '100px 24px', maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="badge badge-blue" style={{ marginBottom: 16 }}>The Team</div>
            <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 40, fontWeight: 400, letterSpacing: '-0.02em' }}>
              Built by surveyors, for surveyors
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              {
                name: 'Ela', role: 'CEO',
                bio: 'Chief of Staff at SheFi. Leading the venture with focus on developer ecosystems and Web3 talent.',
                initials: 'EL',
              },
              {
                name: 'Krinal', role: 'COO',
                bio: 'Previous owner of Exacta Land Services (2019 PE exit). 30 years in land surveying. Creator of SurveyStars platform.',
                initials: 'KL',
              },
              {
                name: 'Chandra', role: 'CTO',
                bio: 'Former CTO of Cardinal Commerce, acquired by VISA in 2016. Focus on payment architecture and Web2/Web3 integration.',
                initials: 'CH',
              },
            ].map(({ name, role, bio, initials }) => (
              <div key={name} className="card" style={{ padding: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: 'linear-gradient(135deg, #1a73f5, #0a40b8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'DM Serif Display, serif', fontSize: 18, color: 'white',
                  }}>{initials}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 16, color: '#f0f4ff' }}>{name}</div>
                    <div className="badge badge-blue" style={{ marginTop: 4, fontSize: 11 }}>{role}</div>
                  </div>
                </div>
                <p style={{ color: '#8899bb', fontSize: 13, lineHeight: 1.7 }}>{bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA FOOTER */}
        <section style={{
          padding: '80px 24px',
          background: 'linear-gradient(180deg, transparent, rgba(26,115,245,0.08))',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'center',
        }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 48, fontWeight: 400, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Ready to stop paying for<br /><em style={{ color: '#4a9bff' }}>redundant fieldwork?</em>
          </h2>
          <p style={{ color: '#8899bb', fontSize: 16, marginBottom: 40 }}>
            Join 312 survey firms already contributing to the network.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/auth?mode=signup" className="btn-primary" style={{ fontSize: 16, padding: '14px 36px' }}>
              Create Free Account <ArrowRight size={16} />
            </Link>
            <Link href="/marketplace" className="btn-ghost" style={{ fontSize: 16, padding: '14px 36px' }}>
              Browse Marketplace
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '40px 24px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 16,
          maxWidth: 1100, margin: '0 auto',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'linear-gradient(135deg, #1a73f5, #0a40b8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><MapPin size={14} color="white" /></div>
            <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 16, color: '#f0f4ff' }}>SPC Alliance</span>
          </div>
          <div style={{ fontSize: 12, color: '#4a5670' }}>
            © 2025 SPC Alliance. Built on Hedera. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy', 'Terms', 'Docs', 'Contact'].map(l => (
              <Link key={l} href="#" style={{ color: '#4a5670', fontSize: 13, textDecoration: 'none' }}>{l}</Link>
            ))}
          </div>
        </footer>

      </main>
    </>
  )
}
