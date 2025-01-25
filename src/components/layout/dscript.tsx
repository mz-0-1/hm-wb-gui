// app/layout.tsx
import { Dancing_Script } from 'next/font/google'

const dancingScript = Dancing_Script({ 
  subsets: ['latin'],
  variable: '--font-dancing-script'  
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={dancingScript.variable}>
      <body>{children}</body>
    </html>
  );
}