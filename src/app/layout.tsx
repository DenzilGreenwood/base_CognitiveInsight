import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "sonner";
import { ConditionalAuthProvider } from '@/components/ConditionalAuthProvider';


export const metadata: Metadata = {
  title: 'CognitiveInsight',
  description: 'Collaborative Verifiable AI Auditability Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased">
        <ConditionalAuthProvider>
          <Toaster richColors position="top-center" />
          {children}
        </ConditionalAuthProvider>
      </body>
    </html>
  );
}
