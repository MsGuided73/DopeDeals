"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';

interface ComplianceContextType {
  userZipCode: string | null;
  restrictedProductIds: string[];
  setUserZipCode: (zip: string | null) => void;
  isLoading: boolean;
  checkProductEligibility: (productIds: string[]) => Promise<void>;
}

const ComplianceContext = createContext<ComplianceContextType | undefined>(undefined);

export function ComplianceProvider({ children }: { children: ReactNode }) {
  const [userZipCode, setUserZipCodeState] = useState<string | null>(null);
  const [restrictedProductIds, setRestrictedProductIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load ZIP from localStorage on mount
  useEffect(() => {
    const savedZip = localStorage.getItem('hw420_user_zip');
    if (savedZip) {
      setUserZipCodeState(savedZip);
    }
  }, []);

  const setUserZipCode = (zip: string | null) => {
    setUserZipCodeState(zip);
    if (zip) {
      localStorage.setItem('hw420_user_zip', zip);
    } else {
      localStorage.removeItem('hw420_user_zip');
    }
  };

  const pendingProductIdsRef = useRef<Set<string>>(new Set());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkProductEligibility = useCallback(async (productIds: string[]) => {
    if (!userZipCode || productIds.length === 0) return;

    // Add to pending batch
    productIds.forEach(id => pendingProductIdsRef.current.add(id));

    // Clear existing timeout if present
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout to process the batch
    timeoutRef.current = setTimeout(async () => {
      const idsToCheck = Array.from(pendingProductIdsRef.current);
      pendingProductIdsRef.current.clear(); // reset for next batch

      if (idsToCheck.length === 0) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/eligibility?zip=${userZipCode}&productIds=${idsToCheck.join(',')}`);
        if (response.ok) {
          const { restrictedProducts } = await response.json();
          // Update restricted list - merging with existing based on current state
          setRestrictedProductIds(prev => Array.from(new Set([...prev, ...restrictedProducts])));
        }
      } catch (error) {
        console.error('Failed to check product eligibility:', error);
      } finally {
        setIsLoading(false);
      }
    }, 50); // 50ms batching window
  }, [userZipCode]);

  // Re-check visibility when ZIP changes
  useEffect(() => {
    if (userZipCode && restrictedProductIds.length > 0) {
      // Small delay to prevent layout thrashing if needed
      checkProductEligibility(restrictedProductIds);
    }
  }, [userZipCode]);

  return (
    <ComplianceContext.Provider value={{ 
      userZipCode, 
      restrictedProductIds, 
      setUserZipCode, 
      isLoading,
      checkProductEligibility
    }}>
      {children}
    </ComplianceContext.Provider>
  );
}

export function useCompliance() {
  const context = useContext(ComplianceContext);
  if (context === undefined) {
    throw new Error('useCompliance must be used within a ComplianceProvider');
  }
  return context;
}
