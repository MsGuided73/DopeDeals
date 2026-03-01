'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  CreditCard, 
  Award, 
  Settings,
  LayoutDashboard
} from 'lucide-react';

interface AccountNavBarProps {
  userRole?: string;
}

export function AccountNavBar({ userRole }: AccountNavBarProps) {
  const pathname = usePathname();
  
  const navItems = [
    { label: 'Overview', href: '/account', icon: LayoutDashboard },
    { label: 'Orders', href: '/orders', icon: ShoppingBag },
    { label: 'Profile', href: '/profile', icon: User },
    { label: 'Payments', href: '/payment-methods', icon: CreditCard },
    { label: 'Wishlist', href: '/wishlist', icon: Heart },
    { label: 'Rewards', href: '/rewards', icon: Award },
  ];

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive 
                ? 'bg-orange-500/10 text-orange-500 font-medium border border-orange-500/20' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {Icon && <Icon size={18} className={isActive ? 'text-orange-500' : 'text-gray-400'} />}
            <span>{item.label}</span>
          </Link>
        );
      })}
      {userRole === 'admin' && (
        <div className="pt-4 mt-4 border-t border-white/10">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-orange-400 hover:bg-orange-500/10 transition-all duration-200"
          >
            <Settings size={18} />
            <span>Admin Panel</span>
          </Link>
        </div>
      )}
    </nav>
  );
}
