"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';
import ImageUploadModal from './ImageUploadModal';

const nav = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Products', icon: '📦' },
  { href: '/admin/categories', label: 'Categories & Brands', icon: '🏷️' },
  { href: '/admin/orders', label: 'Orders', icon: '📋' },
  { href: '/admin/inventory', label: 'Inventory', icon: '📊' },
  { href: '/admin/customers', label: 'Customers', icon: '👥' },
  { href: '/admin/compliance', label: 'Compliance', icon: '🔒' },
  { href: '/admin/shipping', label: 'Shipping', icon: '🚚' },
  { href: '/admin/payments', label: 'Payments', icon: '💳' },
  { href: '/admin/integrations', label: 'Integrations', icon: '🔗' },
  { href: '/admin/seo', label: 'SEO/Content', icon: '🔍' },
  { href: '/admin/ai', label: 'AI Console', icon: '🤖' },
  { href: '/admin/page-builder', label: 'Page Builder', icon: '🎨' },
  { href: '/admin/monitoring', label: 'Monitoring', icon: '📈' },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className={`bg-white shadow-lg transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
        <div className="p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">DD</span>
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-gray-900">Dope Deals Admin</h1>
              <p className="text-xs text-gray-500">v0.1.0</p>
            </div>
          )}
        </div>
        <nav className="mt-4">
          {nav.map(item => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 hover:bg-blue-50 ${active ? 'bg-blue-50 border-r-2 border-blue-600 text-blue-600' : 'text-gray-700'}`}>
                <span className="text-xl">{item.icon}</span>
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button onClick={() => setCollapsed(!collapsed)} className="w-full flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <span className="text-xl">{collapsed ? '→' : '←'}</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-2xl">👋</span>
            <div>
              <h2 className="font-semibold text-gray-900">Welcome back, Admin!</h2>
              <p className="text-sm text-gray-600">Here&apos;s what&apos;s happening with your store today.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowUpload(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><span className="text-xl">🖼️</span></button>
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><span className="text-xl">🔔</span></button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"><span className="text-white text-sm font-bold">A</span></div>
              <span className="font-medium text-gray-900">Admin User</span>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-6">{children}</div>
        <ImageUploadModal open={showUpload} onClose={() => setShowUpload(false)} />
      </main>
    </div>
  );
}

