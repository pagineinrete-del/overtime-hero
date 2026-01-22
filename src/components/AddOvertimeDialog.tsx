import { useState } from 'react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { CalendarIcon, Plus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OvertimeEntry, OvertimeType } from '@/types/overtime';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface AddOvertimeDialogProps {
  onAdd: (entry: Omit<OvertimeEntry, 'id' | 'createdAt'>) => void;
}

export const AddOvertimeDialog = ({ onAdd }: AddOvertimeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [hours, setHours] = useState('');
  
  const [notes, setNotes] = useState('');
  const [type, setType] = useState<OvertimeType>('straordinario');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const hoursNum = parseFloat(hours);
    if (isNaN(hoursNum) || hoursNum <= 0 || hoursNum > 24) {
      toast({
        title: 'Errore',
        description: 'Inserisci un numero di ore valido (1-24)',
        variant: 'destructive',
      });
      return;
    }

    onAdd({
      date,
      hours: hoursNum,
      description: notes.trim() || '-',
      notes: notes.trim() || undefined,
      type,
    });

    const typeLabels = { straordinario: 'Straordinario', recupero: 'Recupero', festivo: 'Festivo' };
    toast({
      title: `${typeLabels[type]} registrato`,
      description: `${hoursNum} ore aggiunte per ${format(date, 'd MMMM', { locale: it })}`,
    });

    setOpen(false);
    setDate(new Date());
    setHours('');
    
    setNotes('');
    setType('straordinario');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto gap-2 gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity h-11 sm:h-10">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Aggiungi Straordinario</span>
          <span className="sm:hidden">Aggiungi Ore</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto mx-4 rounded-xl">
        <DialogHeader>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl gradient-primary">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg">Nuovo Straordinario</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">Registra le ore di lavoro straordinario</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-3 sm:mt-4 space-y-4 sm:space-y-5">
          <div className="space-y-1.5 sm:space-y-2">
            <Label className="text-sm">Tipo</Label>
            <Select value={type} onValueChange={(v) => setType(v as OvertimeType)}>
              <SelectTrigger className="h-11 sm:h-10 text-sm">
                <SelectValue placeholder="Seleziona tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="straordinario">🕐 Straordinario</SelectItem>
                <SelectItem value="recupero">🔄 Ore di Recupero</SelectItem>
                <SelectItem value="festivo">🎉 Festivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="date" className="text-sm">Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal h-11 sm:h-10 text-sm',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP', { locale: it }) : 'Seleziona data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="hours" className="text-sm">Ore</Label>
              <Input
                id="hours"
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                placeholder="Es. 2.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="h-11 sm:h-10 text-base sm:text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="notes" className="text-sm">Note (opzionale)</Label>
            <Textarea
              id="notes"
              placeholder="Aggiungi note o dettagli..."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="text-base sm:text-sm resize-none"
            />
          </div>


          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-11 sm:h-10">
              Annulla
            </Button>
            <Button type="submit" className="gradient-primary text-primary-foreground h-11 sm:h-10">
              Salva
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
