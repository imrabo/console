'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <div className={cn('mb-24 w-full max-w-full min-w-0 space-y-6 p-4 md:p-6 lg:mb-0', className)}>
      {children}
    </div>
  );
}
