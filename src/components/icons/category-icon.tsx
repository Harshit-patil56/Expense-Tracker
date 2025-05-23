
"use client"; 

import React from 'react';
import type { LucideProps } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { CATEGORIES } from '@/lib/constants';
import { cn } from '@/lib/utils'; // Use the shared cn utility

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
    return <FallbackIcon {...props} />;
  }
  
  return <IconComponent {...props} className={cn(props.className, categoryInfo?.color)} />;
};
