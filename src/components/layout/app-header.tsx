"use client";
import React from 'react';
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Compass, PanelLeft } from "lucide-react";
import Link from 'next/link';

export function AppHeader() {
  const { isMobile, toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      {isMobile && (
         <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
         >
            <PanelLeft className="h-6 w-6" />
         </Button>
      )}
      {!isMobile && (
        <div className="hidden md:flex items-center gap-2 text-lg font-semibold">
            <Compass className="h-6 w-6 text-primary" />
            <span className="sr-only">Fiscal Compass</span>
        </div>
      )}
      {/* Add other header elements like user menu here if needed */}
    </header>
  );
}
