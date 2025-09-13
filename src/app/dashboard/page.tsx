'use client';

import { Suspense } from 'react';
import type { UserRole } from '@/lib/types';
import AdminView from '@/components/dashboard/admin-view';
import StudentView from '@/components/dashboard/student-view';
import ParentView from '@/components/dashboard/parent-view';
import { useSearchParams } from 'next/navigation';

function DashboardPageContent({ role }: { role: UserRole }) {
  switch (role) {
    case 'admin':
      return <AdminView />;
    case 'student':
      return <StudentView />;
    case 'parent':
      return <ParentView />;
    default:
      // Fallback to a default view if role is not recognized
      return <StudentView />;
  }
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  // Fix: Ensure searchParams is available before accessing
  const roleParam = searchParams ? searchParams.get('role') : null;
  const role = (roleParam as UserRole) || 'student';
  
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <DashboardPageContent role={role} />
    </Suspense>
  );
}
