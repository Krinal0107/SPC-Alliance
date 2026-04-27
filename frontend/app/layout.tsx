import type { Metadata } from 'next'
import './globals.css'
import { Web3Provider } from './Web3Provider'

export const metadata: Metadata = {
  title: 'SPC Alliance — Survey Point Coordinate Marketplace',
  description: 'Buy and sell State Plane Coordinate points. The global marketplace for land surveyors.',
  keywords: ['SPC points', 'land survey', 'SPCS', 'survey marketplace', 'Hedera'],
  openGraph: {
    title: 'SPC Alliance',
    description: 'The global marketplace for State Plane Coordinate points',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  )
}
