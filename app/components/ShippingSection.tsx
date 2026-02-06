'use client';

import React from 'react';
import { Truck, MapPin, AlertTriangle, CheckCircle, Info } from 'lucide-react';


// If shadcn accordion is not available, I'll build a simple one.
// Given the dependencies (radix-ui/react-accordion is in package.json), I'll assume standard shadcn components are in @/components/ui/accordion.
// But safely, I'll build a custom one to avoid path guessing if @/components/ui path is unsure.
// Actually, package.json has @radix-ui/react-accordion.
// I'll stick to a simple custom implementation to be safe and fast.

interface ShippingSectionProps {
  restrictions: {
    restricted_states: string[];
    restricted_counties: string[];
    restricted_cities: string[];
    ships_ground_only?: boolean;
    requires_adult_signature?: boolean;
    notes?: string;
  };
}

export function ShippingSection({ restrictions }: ShippingSectionProps) {
  const hasRestrictions = 
    restrictions.restricted_states.length > 0 || 
    restrictions.restricted_counties.length > 0 || 
    restrictions.restricted_cities.length > 0;

  return (
    <div className="bg-blue-50/50 rounded-xl border border-blue-100 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-4">
          <Truck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
          <div className="space-y-2 w-full">
            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Shipping Information</h4>
            
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Free shipping on orders over $75</span>
            </div>

            {restrictions.requires_adult_signature && (
               <div className="flex items-center gap-2 text-sm text-slate-700">
                <Info className="w-4 h-4 text-blue-500" />
                <span>Adult Signature Required (21+)</span>
              </div>
            )}

            {hasRestrictions && (
              <div className="mt-3 pt-3 border-t border-blue-200/50">
                 <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-100">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-bold block mb-1">Shipping Restrictions Apply</span>
                      <p>This product cannot ship to: {restrictions.restricted_states.join(', ')}</p>
                    </div>
                 </div>
              </div>
            )}
            
             <p className="text-xs text-slate-500 pt-2">
              Discreet billing and packaging. Tracking provided.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
