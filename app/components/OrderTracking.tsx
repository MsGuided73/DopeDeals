"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Package, CheckCircle, Globe, ExternalLink, ShieldCheck } from 'lucide-react';

interface OrderTrackingProps {
  orderId: string;
  orderNumber?: string;
  isCompact?: boolean;
}

export default function OrderTracking({ orderId, orderNumber, isCompact = false }: OrderTrackingProps) {
  // Generate a consistent mock tracking number based on the order ID
  const mockTrackingId = `H420-USPS-${orderId.split('-').pop()?.toUpperCase() || '739281'}`;
  
  // Status stages for the timeline
  const stages = [
    { id: 'confirmed', label: 'Confirmed', icon: ShieldCheck, color: 'text-green-500' },
    { id: 'processing', label: 'Processing', icon: Package, color: 'text-blue-500' },
    { id: 'shipped', label: 'Departed', icon: Truck, color: 'text-orange-500' },
    { id: 'transit', label: 'In Transit', icon: Globe, color: 'text-purple-500' },
  ];

  // For mock purposes, we'll suggest it's in the 'Processing' or 'Departed' stage
  const currentStageIndex = 1; // Processing

  if (isCompact) {
    return (
      <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all group">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
            <Truck className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-left">
            <p className="text-[10px] uppercase font-black text-white/30 tracking-widest">Tracking Number</p>
            <p className="text-sm font-bold tracking-tight text-white/90">{mockTrackingId}</p>
          </div>
        </div>
        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/40 group-hover:text-white">
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Tracking Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-white/5 rounded-[2rem] border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
          <Truck className="w-32 h-32" />
        </div>
        
        <div className="text-left space-y-1 relative z-10">
          <h3 className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Logistic Identity</h3>
          <p className="text-2xl font-display-twilight italic tracking-widest text-white uppercase">{mockTrackingId}</p>
          <div className="flex items-center gap-2 pt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-green-500 uppercase tracking-widest">Awaiting Carrier Pickup</span>
          </div>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative z-10 flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/10 transition-all font-bold uppercase tracking-widest text-xs"
        >
          Track on Carrier
          <ExternalLink className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Timeline */}
      <div className="relative px-4">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/5 -translate-y-1/2" />
        <div 
          className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-green-500 to-blue-500 -translate-y-1/2 transition-all duration-1000" 
          style={{ width: `${(currentStageIndex / (stages.length - 1)) * 100}%` }}
        />

        <div className="flex justify-between relative z-10">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isActive = index <= currentStageIndex;
            const isCurrent = index === currentStageIndex;

            return (
              <div key={stage.id} className="flex flex-col items-center gap-4">
                <motion.div 
                  initial={false}
                  animate={{ 
                    scale: isCurrent ? 1.2 : 1,
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                    borderColor: isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)'
                  }}
                  className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-500 shadow-xl backdrop-blur-md`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? stage.color : 'text-white/10'}`} />
                  {isCurrent && (
                    <motion.div 
                      layoutId="activeGlow"
                      className="absolute inset-0 bg-white/5 rounded-2xl blur-xl"
                    />
                  )}
                </motion.div>
                <div className="text-center">
                  <p className={`text-[10px] uppercase font-black tracking-widest ${isActive ? 'text-white/80' : 'text-white/10'}`}>
                    {stage.label}
                  </p>
                  {isCurrent && (
                    <p className="text-[8px] text-green-500 font-bold uppercase tracking-tighter mt-1 animate-pulse">Live</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
