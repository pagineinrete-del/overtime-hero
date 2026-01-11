import { useState, useMemo, useEffect, useCallback } from 'react';
import { OvertimeEntry, FilterPeriod, OvertimeStats, OvertimeType } from '@/types/overtime';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, format, parseISO } from 'date-fns';
import { it } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const useOvertime = (threshold: number = 40) => {
  const [entries, setEntries] = useState<OvertimeEntry[]>([]);
  const [filter, setFilter] = useState<FilterPeriod>('month');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch entries from database
  const fetchEntries = useCallback(async () => {
    if (!user) {
      setEntries([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('overtime_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      const formattedEntries: OvertimeEntry[] = (data || []).map((entry) => ({
        id: entry.id,
        date: parseISO(entry.date),
        hours: Number(entry.hours),
        description: entry.description,
        notes: entry.notes || undefined,
        type: (entry.description.toLowerCase().includes('recupero') ? 'recupero' :
               entry.description.toLowerCase().includes('festiv') ? 'festivo' :
               entry.description.toLowerCase().includes('ordinari') ? 'ordinario' : 'straordinario') as OvertimeType,
        createdAt: new Date(entry.created_at),
      }));

      setEntries(formattedEntries);
    } catch (error: any) {
      toast({
        title: 'Errore',
        description: 'Impossibile caricare le registrazioni',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const filteredEntries = useMemo(() => {
    const now = new Date();
    let start: Date;
    let end: Date;

    switch (filter) {
      case 'week':
        start = startOfWeek(now, { weekStartsOn: 1 });
        end = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case 'year':
        start = startOfYear(now);
        end = endOfYear(now);
        break;
      default:
        return entries;
    }

    return entries.filter((entry) =>
      isWithinInterval(entry.date, { start, end })
    );
  }, [entries, filter]);

  const stats: OvertimeStats = useMemo(() => {
    const totalHours = filteredEntries.reduce((sum, entry) => sum + entry.hours, 0);
    const uniqueDays = new Set(filteredEntries.map((e) => format(e.date, 'yyyy-MM-dd'))).size;
    const maxHoursDay = filteredEntries.reduce((max, entry) => Math.max(max, entry.hours), 0);
    const recoveryHours = filteredEntries.filter(e => e.type === 'recupero').reduce((sum, e) => sum + e.hours, 0);
    const holidayHours = filteredEntries.filter(e => e.type === 'festivo').reduce((sum, e) => sum + e.hours, 0);
    const ordinaryHours = filteredEntries.filter(e => e.type === 'ordinario').reduce((sum, e) => sum + e.hours, 0);

    return {
      totalHours,
      averagePerDay: uniqueDays > 0 ? totalHours / uniqueDays : 0,
      entriesCount: filteredEntries.length,
      maxHoursDay,
      recoveryHours,
      holidayHours,
      ordinaryHours,
    };
  }, [filteredEntries]);

  const chartData = useMemo(() => {
    const groupedByWeek: Record<string, number> = {};
    
    filteredEntries.forEach((entry) => {
      const weekStart = startOfWeek(entry.date, { weekStartsOn: 1 });
      const key = format(weekStart, 'dd MMM', { locale: it });
      groupedByWeek[key] = (groupedByWeek[key] || 0) + entry.hours;
    });

    return Object.entries(groupedByWeek)
      .map(([name, hours]) => ({ name, hours }))
      .slice(-8);
  }, [filteredEntries]);

  const isOverThreshold = stats.totalHours > threshold;

  const addEntry = async (entry: Omit<OvertimeEntry, 'id' | 'createdAt'>) => {
    if (!user) {
      toast({
        title: 'Errore',
        description: 'Devi effettuare l\'accesso per aggiungere registrazioni',
        variant: 'destructive',
      });
      return;
    }

    try {
      const typeLabel = entry.type === 'recupero' ? 'Recupero - ' :
                        entry.type === 'festivo' ? 'Festivo - ' :
                        entry.type === 'ordinario' ? 'Ordinario - ' : '';
      
      const { data, error } = await supabase
        .from('overtime_entries')
        .insert({
          user_id: user.id,
          date: format(entry.date, 'yyyy-MM-dd'),
          hours: entry.hours,
          description: `${typeLabel}${entry.description}`,
          notes: entry.notes || null,
        })
        .select()
        .single();

      if (error) throw error;

      const newEntry: OvertimeEntry = {
        id: data.id,
        date: parseISO(data.date),
        hours: Number(data.hours),
        description: data.description,
        notes: data.notes || undefined,
        type: entry.type,
        createdAt: new Date(data.created_at),
      };

      setEntries((prev) => [newEntry, ...prev].sort((a, b) => b.date.getTime() - a.date.getTime()));

      toast({
        title: 'Registrazione aggiunta',
        description: `${entry.hours} ore registrate con successo`,
      });
    } catch (error: any) {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile aggiungere la registrazione',
        variant: 'destructive',
      });
    }
  };

  const deleteEntry = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('overtime_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setEntries((prev) => prev.filter((entry) => entry.id !== id));

      toast({
        title: 'Registrazione eliminata',
        description: 'La registrazione è stata eliminata con successo',
      });
    } catch (error: any) {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile eliminare la registrazione',
        variant: 'destructive',
      });
    }
  };

  const updateEntry = async (id: string, updates: Partial<OvertimeEntry>) => {
    if (!user) return;

    try {
      const updateData: any = {};
      if (updates.date) updateData.date = format(updates.date, 'yyyy-MM-dd');
      if (updates.hours !== undefined) updateData.hours = updates.hours;
      if (updates.description) updateData.description = updates.description;
      if (updates.notes !== undefined) updateData.notes = updates.notes || null;

      const { error } = await supabase
        .from('overtime_entries')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setEntries((prev) =>
        prev.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry))
      );

      toast({
        title: 'Registrazione aggiornata',
        description: 'Le modifiche sono state salvate',
      });
    } catch (error: any) {
      toast({
        title: 'Errore',
        description: error.message || 'Impossibile aggiornare la registrazione',
        variant: 'destructive',
      });
    }
  };

  return {
    entries: filteredEntries,
    allEntries: entries,
    filter,
    setFilter,
    stats,
    chartData,
    isOverThreshold,
    threshold,
    loading,
    addEntry,
    deleteEntry,
    updateEntry,
    refetch: fetchEntries,
  };
};
