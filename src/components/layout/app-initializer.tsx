
"use client";

import React, { useState, useEffect } from 'react';
import { hasActiveUserCompletedSetup, reinitializeActiveUserPrefix } from '@/lib/data-store';
import { UserSetupModal } from '@/components/features/onboarding/user-setup-modal';
import { Skeleton } from '@/components/ui/skeleton';

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showSetupModal, setShowSetupModal] = useState(false);

  useEffect(() => {
    // Ensure the active user prefix is fresh on initial load or after a potential clearAllUserData + reload
    reinitializeActiveUserPrefix(); 
    const setupComplete = hasActiveUserCompletedSetup();
    if (!setupComplete) {
      setShowSetupModal(true);
    }
    setIsLoading(false);
  }, []);

  const handleSetupComplete = () => {
    setShowSetupModal(false);
    // Force reload to ensure all components and hooks re-initialize
    // with the new active user context from localStorage.
    window.location.reload();
  };

  if (isLoading) {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="space-y-4 p-8">
                <Skeleton className="h-12 w-64" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-10 w-32 mt-4" />
            </div>
        </div>
    );
  }

  if (showSetupModal) {
    return <UserSetupModal isOpen={showSetupModal} onSetupComplete={handleSetupComplete} />;
  }

  return <>{children}</>;
}
