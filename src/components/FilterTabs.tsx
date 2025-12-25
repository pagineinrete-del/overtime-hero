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
    <div className="inline-flex items-center gap-1 rounded-lg bg-secondary p-1">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onChange(filter.value)}
          className={cn(
            'rounded-md px-4 py-2 text-sm font-medium transition-all duration-200',
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
