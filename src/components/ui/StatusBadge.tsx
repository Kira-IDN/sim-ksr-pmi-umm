import { cn } from '@/utils/cn';

export type BadgeStatus = 'success' | 'warning' | 'danger' | 'info' | 'default';

interface StatusBadgeProps {
  status: BadgeStatus;
  label: string;
  className?: string;
}

export const StatusBadge = ({ status, label, className }: StatusBadgeProps) => {
  const statusStyles: Record<BadgeStatus, string> = {
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    default: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  return (
    <span className={cn('px-3 py-1 rounded-full text-xs font-semibold border', statusStyles[status], className)}>
      {label}
    </span>
  );
};
