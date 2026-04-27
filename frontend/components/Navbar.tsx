'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10,15,30,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
        <img
          src="/logo.svg"
          alt="SPC Alliance Logo"
          style={{
            width: 40,
            height: 40,
            filter: 'drop-shadow(0 0 8px rgba(26,115,245,0.3))',
          }}
        />
        <span style={{
          fontFamily: 'DM Serif Display, serif',
          fontSize: 22,
          color: '#f0f4ff',
          letterSpacing: '-0.02em',
          fontWeight: 600,
          textShadow: '0 0 10px rgba(26,115,245,0.2)',
        }}>
          SPC Alliance
        </span>
      </Link>

      {/* Desktop nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="hidden md:flex">
        {[
          { label: 'Marketplace', href: '/marketplace' },
          { label: 'Upload Points', href: '/upload' },
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'How It Works', href: '#how-it-works' },
        ].map(({ label, href }) => (
          <Link key={href} href={href} style={{
            color: '#8899bb', textDecoration: 'none',
            fontSize: 14, fontWeight: 500,
            padding: '8px 14px', borderRadius: 8,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { (e.target as HTMLElement).style.color = '#f0f4ff'; (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
          onMouseLeave={e => { (e.target as HTMLElement).style.color = '#8899bb'; (e.target as HTMLElement).style.background = 'transparent'; }}>
            {label}
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Link href="/auth" className="btn-ghost" style={{ padding: '8px 20px', fontSize: 13 }}>
          Sign In
        </Link>
        <Link href="/auth?mode=signup" className="btn-primary" style={{ padding: '8px 20px', fontSize: 13 }}>
          Get Started
        </Link>
      </div>
    </nav>
  )
}
