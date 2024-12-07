import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/layout/templates/nav'

export const metadata: Metadata = {
    title: 'DentiSmile'
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`antialiased`}>
                <div className="grid grid-rows-[60px_1fr_0px] items-center justify-items-center">
                    <Nav />
                    {children}
                </div>
            </body>
        </html>
    )
}
