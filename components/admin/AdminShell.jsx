'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader  from '@/components/admin/AdminHeader';

export default function AdminShell({ children, userEmail }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F1F5F9' }}>
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Content area – margin-left handled by .admin-content CSS class */}
      <div
        className="admin-content"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <AdminHeader onMenuToggle={() => setSidebarOpen(v => !v)} userEmail={userEmail} />
        <main style={{
          flex: 1,
          padding: 'clamp(20px, 3vw, 36px)',
          overflowX: 'hidden',
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
