import './globals.css'
import { ConvexClientProvider } from '../components/convex-provider';

export const metadata = {
  title: 'EduQuest - AI-Powered Question Generation',
  description: 'Upload learning materials and automatically generate exam questions',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  )
}