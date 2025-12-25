import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'warning' | 'success';
  className?: string;
}

export const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  className,
}: StatsCardProps) => {
  const variants = {
    default: 'bg-card',
    primary: 'gradient-primary text-primary-foreground',
    warning: 'bg-warning/10 border-warning/20',
    success: 'bg-success/10 border-success/20',
  };

  const iconVariants = {
    default: 'bg-secondary text-muted-foreground',
    primary: 'bg-primary-foreground/20 text-primary-foreground',
    warning: 'bg-warning/20 text-warning',
    success: 'bg-success/20 text-success',
  };

  const textVariants = {
    default: 'text-foreground',
    primary: 'text-primary-foreground',
    warning: 'text-warning',
    success: 'text-success',
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border p-5 shadow-card transition-all duration-300 hover:shadow-card-hover animate-fade-in',
        variants[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={cn(
              'text-sm font-medium',
              variant === 'primary' ? 'text-primary-foreground/80' : 'text-muted-foreground'
            )}
          >
            {title}
          </p>
          <p
            className={cn(
              'mt-1 text-3xl font-bold tracking-tight',
              textVariants[variant]
            )}
          >
            {value}
          </p>
          {subtitle && (
            <p
              className={cn(
                'mt-1 text-xs',
                variant === 'primary' ? 'text-primary-foreground/70' : 'text-muted-foreground'
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-lg',
            iconVariants[variant]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};
