import { Metadata } from 'next';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Cognitive Insight',
  description: 'Administrative interface for managing pilot requests and workspace operations',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requireAdmin={true}>
      {children}
    </ProtectedRoute>
  );
}
