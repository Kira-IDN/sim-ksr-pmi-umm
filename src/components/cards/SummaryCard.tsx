import React from 'react';
import { cn } from '@/utils/cn';

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ElementType;
  colorClass?: string;
  className?: string;
}

export const SummaryCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  colorClass = 'bg-gray-50 text-gray-500', 
  className 
}: SummaryCardProps) => (
  <div className={cn("bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4", className)}>
    {Icon && (
      <div className={cn("p-4 rounded-xl", colorClass)}>
        <Icon className="w-6 h-6" />
      </div>
    )}
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  </div>
);
