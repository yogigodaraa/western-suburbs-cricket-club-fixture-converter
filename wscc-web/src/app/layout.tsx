import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Western Suburbs Cricket Club - Fixture Manager',
  description: 'Convert and manage cricket fixtures for Western Suburbs Cricket Club',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-[#003366] p-4 shadow-lg">
          <div className="container mx-auto flex items-center">
            <img 
              src="/images/logo.jpg" 
              alt="Western Suburbs Cricket Club Logo" 
              className="h-12 w-auto mr-4"
            />
            <h1 className="text-2xl font-bold text-white">
              Western Suburbs Cricket Club
            </h1>
          </div>
        </header>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  )
}