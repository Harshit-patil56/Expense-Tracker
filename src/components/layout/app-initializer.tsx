
"use client";

import React, { useState, useEffect } from 'react';
import { hasCompletedSetup as checkSetupStatus } from '@/lib/data-store';
import { UserSetupModal } from '@/components/features/onboarding/user-setup-modal';
import { Skeleton } from '@/components/ui/skeleton';

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showSetupModal, setShowSetupModal] = useState(false);

  useEffect(() => {
    // This effect runs only on the client after hydration
    const setupComplete = checkSetupStatus();
    if (!setupComplete) {
      setShowSetupModal(true);
    }
    setIsLoading(false);
  }, []);

  const handleSetupComplete = () => {
    setShowSetupModal(false);
    // Potentially trigger a data refresh for other components if needed,
    // or simply let them re-render with the new setup state.
    // Forcing a reload can ensure all components pick up fresh local storage.
    window.location.reload();
  };

  if (isLoading) {
    // Basic loading state to prevent flash of unstyled content or app before check
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
