import { FilterPeriod } from '@/types/overtime';
import { cn } from '@/lib/utils';

interface FilterTabsProps {
  value: FilterPeriod;
  onChange: (value: FilterPeriod) => void;
}

const filters: { value: FilterPeriod; label: string }[] = [
  { value: 'week', label: 'Settimana' },
  { value: 'month', label: 'Mese' },
  { value: 'year', label: 'Anno' },
  { value: 'all', label: 'Tutto' },
];

export const FilterTabs = ({ value, onChange }: FilterTabsProps) => {
  return (
    <div className="inline-flex items-center gap-0.5 sm:gap-1 rounded-lg bg-secondary p-0.5 sm:p-1 w-full sm:w-auto">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onChange(filter.value)}
          className={cn(
            'flex-1 sm:flex-none rounded-md px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-200',
            value === filter.value
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};
