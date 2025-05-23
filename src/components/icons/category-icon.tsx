"use client"; // Required if we use dynamic imports from lucide-react or useEffect for it

import React, { Suspense } from 'react';
import type { LucideProps } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';

interface CategoryIconProps extends LucideProps {
  categoryName: string;
  fallbackIcon?: React.ElementType<LucideProps>;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  categoryName,
  fallbackIcon: FallbackIcon = LucideIcons.HelpCircle,
  ...props
}) => {
  const categoryInfo = CATEGORIES.find(cat => cat.name === categoryName);
  const IconComponent = categoryInfo ? LucideIcons[categoryInfo.iconName as keyof typeof LucideIcons] : FallbackIcon;

  if (!IconComponent) {
    // This case should ideally not be hit if CATEGORIES and lucide-react are in sync
    return <FallbackIcon {...props} />;
  }
  
  // Use Suspense if icons were code-split, but direct import is fine for lucide-react
  return <IconComponent {...props} className={cn(props.className, categoryInfo?.color)} />;
};

// Helper function to add cn if it's not available (it should be via lib/utils)
const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');
