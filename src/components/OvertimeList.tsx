import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Clock, Trash2, FileText } from 'lucide-react';
import { OvertimeEntry } from '@/types/overtime';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OvertimeListProps {
  entries: OvertimeEntry[];
  onDelete: (id: string) => void;
}

export const OvertimeList = ({ entries, onDelete }: OvertimeListProps) => {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center px-4">
        <div className="mb-3 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-secondary">
          <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-foreground">Nessuna registrazione</h3>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          Aggiungi le tue ore di straordinario per iniziare
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {entries.map((entry, index) => (
        <div
          key={entry.id}
          className={cn(
            'group relative overflow-hidden rounded-lg sm:rounded-xl border border-border bg-card p-3 sm:p-4 transition-all duration-300 hover:border-primary/20 hover:shadow-card-hover animate-slide-up'
          )}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-start justify-between gap-2 sm:gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {format(entry.date, 'EEE d MMM', { locale: it })}
                </span>
              </div>
              <h4 className="mt-0.5 sm:mt-1 text-sm sm:text-base font-semibold text-foreground truncate">
                {entry.description}
              </h4>
              {entry.notes && (
                <div className="mt-1.5 sm:mt-2 flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 shrink-0 mt-0.5" />
                  <p className="line-clamp-2">{entry.notes}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-bold text-primary">{entry.hours}</span>
                <span className="ml-0.5 sm:ml-1 text-xs sm:text-sm text-muted-foreground">ore</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground opacity-100 sm:opacity-0 transition-opacity sm:group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(entry.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
