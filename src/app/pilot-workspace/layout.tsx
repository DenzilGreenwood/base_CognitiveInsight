import { Metadata } from 'next';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export const metadata: Metadata = {
  title: 'Pilot Workspace | Cognitive Insight',
  description: 'Collaborative workspace for pilot program participants',
};

export default function PilotWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute requirePilotAccess={true}>
      {children}
    </ProtectedRoute>
  );
}
