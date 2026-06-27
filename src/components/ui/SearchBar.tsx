import { Search } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
}

export const SearchBar = ({ wrapperClassName, ...props }: SearchBarProps) => {
  return (
    <div className={cn("relative flex items-center", wrapperClassName)}>
      <Search className="w-5 h-5 text-gray-400 absolute left-3" />
      <input
        type="text"
        className={cn(
          "w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-ksr-primary/20 focus:border-ksr-primary transition-colors text-sm",
          "dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100",
          props.className
        )}
        {...props}
      />
    </div>
  );
};
