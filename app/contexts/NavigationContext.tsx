"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  hasMasthead: boolean;
  setHasMasthead: (hasMasthead: boolean) => void;
  hasCustomFooter: boolean;
  setHasCustomFooter: (hasCustomFooter: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [hasMasthead, setHasMasthead] = useState(false);
  const [hasCustomFooter, setHasCustomFooter] = useState(false);

  return (
    <NavigationContext.Provider value={{ hasMasthead, setHasMasthead, hasCustomFooter, setHasCustomFooter }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
