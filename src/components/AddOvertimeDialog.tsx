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
import { OvertimeEntry } from '@/types/overtime';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface AddOvertimeDialogProps {
  onAdd: (entry: Omit<OvertimeEntry, 'id' | 'createdAt'>) => void;
}

export const AddOvertimeDialog = ({ onAdd }: AddOvertimeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');

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

    if (!description.trim()) {
      toast({
        title: 'Errore',
        description: 'Inserisci una descrizione',
        variant: 'destructive',
      });
      return;
    }

    onAdd({
      date,
      hours: hoursNum,
      description: description.trim(),
      notes: notes.trim() || undefined,
    });

    toast({
      title: 'Straordinario registrato',
      description: `${hoursNum} ore aggiunte per ${format(date, 'd MMMM', { locale: it })}`,
    });

    setOpen(false);
    setDate(new Date());
    setHours('');
    setDescription('');
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Aggiungi Straordinario</span>
          <span className="sm:hidden">Aggiungi</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
              <Clock className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <DialogTitle>Nuovo Straordinario</DialogTitle>
              <DialogDescription>Registra le ore di lavoro straordinario</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
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

            <div className="space-y-2">
              <Label htmlFor="hours">Ore</Label>
              <Input
                id="hours"
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                placeholder="Es. 2.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrizione attività</Label>
            <Input
              id="description"
              placeholder="Es. Completamento progetto cliente"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Note (opzionale)</Label>
            <Textarea
              id="notes"
              placeholder="Aggiungi note o dettagli..."
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annulla
            </Button>
            <Button type="submit" className="gradient-primary text-primary-foreground">
              Salva
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
