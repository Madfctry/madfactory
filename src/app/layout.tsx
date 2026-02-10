import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: "MadFactory — We don't launch memes. We build YOUR ideas.",
    template: '%s | MadFactory',
  },
  description:
    'Submit your product idea, community votes, we build the winner, and launch it as a token on Bags. Earn 30% of all trading fees forever.',
  keywords: ['crypto', 'solana', 'bags.fm', 'product ideas', 'community', 'token launch', 'fee share'],
  openGraph: {
    title: "MadFactory — We don't launch memes. We build YOUR ideas.",
    description:
      'Submit idea → Vote → We build → Launch on Bags → Earn 30% fees forever.',
    url: 'https://madfactory.xyz',
    siteName: 'MadFactory',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: "MadFactory — We don't launch memes. We build YOUR ideas.",
    description:
      'Submit idea → Vote → We build → Launch on Bags → Earn 30% fees forever.',
    creator: '@madfctry',
  },
  metadataBase: new URL('https://madfactory.xyz'),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-bg-primary text-text-primary`}>
        <Navbar />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
