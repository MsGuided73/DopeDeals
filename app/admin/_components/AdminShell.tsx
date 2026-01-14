"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useState } from 'react';
import ImageUploadModal from './ImageUploadModal';
import { ChevronDown, ChevronRight, Search, Bell, User, Settings, LogOut } from 'lucide-react';

const navGroups = [
  {
    title: 'Store',
    items: [
      { href: '/admin', label: 'Dashboard', icon: '📊', description: 'Overview & analytics' },
      { href: '/admin/products', label: 'Products', icon: '📦', description: 'Manage inventory' },
      { href: '/admin/categories', label: 'Categories', icon: '🏷️', description: 'Product organization' },
      { href: '/admin/inventory', label: 'Inventory', icon: '📈', description: 'Stock management' },
    ]
  },
  {
    title: 'Sales',
    items: [
      { href: '/admin/orders', label: 'Orders', icon: '📋', description: 'Order management' },
      { href: '/admin/customers', label: 'Customers', icon: '👥', description: 'Customer database' },
      { href: '/admin/shipping', label: 'Shipping', icon: '🚚', description: 'Shipping settings' },
      { href: '/admin/payments', label: 'Payments', icon: '💳', description: 'Payment processing' },
    ]
  },
  {
    title: 'Content',
    items: [
      { href: '/admin/assets', label: 'Assets', icon: '🖼️', description: 'File management' },
      { href: '/admin/seo', label: 'SEO', icon: '🔍', description: 'Search optimization' },
      { href: '/admin/page-builder', label: 'Pages', icon: '🎨', description: 'Content builder' },
      { href: '/admin/customization', label: 'Design', icon: '🎨', description: 'Site visual styles' },
    ]
  },
  {
    title: 'Tools',
    items: [
      { href: '/admin/csv-upload', label: 'Import', icon: '📁', description: 'Bulk operations' },
      { href: '/admin/integrations', label: 'Apps', icon: '🔗', description: 'Third-party tools' },
      { href: '/admin/ai', label: 'AI Tools', icon: '🤖', description: 'Automation' },
      { href: '/admin/compliance', label: 'Compliance', icon: '🔒', description: 'Legal compliance' },
    ]
  }
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['Store', 'Sales']));
  const [searchQuery, setSearchQuery] = useState('');

  const toggleGroup = (groupTitle: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupTitle)) {
      newExpanded.delete(groupTitle);
    } else {
      newExpanded.add(groupTitle);
    }
    setExpandedGroups(newExpanded);
  };

  const filteredNav = navGroups.map(group => ({
    ...group,
    items: group.items.filter(item =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.items.length > 0 || searchQuery === '');

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`bg-white shadow-xl transition-all duration-300 border-r border-gray-200 ${collapsed ? 'w-16' : 'w-80'}`}>
        {/* Logo & Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-dope-orange to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-lg">DD</span>
            </div>
            {!collapsed && (
              <div className="flex-1">
                <h1 className="font-bold text-gray-900 text-lg">Dope Deals</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            )}
          </div>

          {!collapsed && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-dope-orange focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {filteredNav.map(group => (
            <div key={group.title} className="mb-4">
              {!collapsed && (
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="w-full flex items-center justify-between px-6 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:bg-gray-50"
                >
                  {group.title}
                  {expandedGroups.has(group.title) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              )}

              {(expandedGroups.has(group.title) || collapsed) && (
                <div className="space-y-1">
                  {group.items.map(item => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors group ${
                          active
                            ? 'bg-dope-orange/10 border-r-4 border-dope-orange text-dope-orange'
                            : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        <span className="text-xl flex-shrink-0">{item.icon}</span>
                        {!collapsed && (
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">{item.label}</div>
                            <div className="text-xs text-gray-500 group-hover:text-gray-600 truncate">
                              {item.description}
                            </div>
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-center">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-full flex items-center justify-center gap-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-xl">{collapsed ? '→' : '←'}</span>
              {!collapsed && <span className="text-sm">Collapse</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-dope-orange rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Welcome back, Admin</h2>
                <p className="text-sm text-gray-600">Manage your store with ease</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Global Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products, orders..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-dope-orange focus:border-transparent w-64"
                />
              </div>

              {/* Actions */}
              <button
                onClick={() => setShowUpload(true)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Upload Media"
              >
                <span className="text-xl">📷</span>
              </button>

              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative" title="Notifications">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
              </button>

              <div className="border-l border-gray-300 h-6 mx-2"></div>

              {/* User Menu */}
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">A</span>
                  </div>
                  {!collapsed && <span className="font-medium text-gray-900 hidden sm:block">Admin User</span>}
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <hr className="my-2 border-gray-200" />
                  <button className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {children}
        </div>

        <ImageUploadModal open={showUpload} onClose={() => setShowUpload(false)} />
      </main>
    </div>
  );
}
