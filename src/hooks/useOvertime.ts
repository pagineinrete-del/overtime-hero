import { useState, useMemo } from 'react';
import { OvertimeEntry, FilterPeriod, OvertimeStats } from '@/types/overtime';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, format } from 'date-fns';
import { it } from 'date-fns/locale';

// Demo data
const generateDemoData = (): OvertimeEntry[] => {
  const entries: OvertimeEntry[] = [];
  const descriptions = [
    'Completamento progetto cliente',
    'Riunione urgente',
    'Supporto tecnico',
    'Deploy in produzione',
    'Formazione team',
    'Revisione documentazione',
    'Debug sistema',
    'Chiamata cliente internazionale',
  ];

  const types: Array<'straordinario' | 'recupero' | 'festivo'> = ['straordinario', 'recupero', 'festivo'];
  
  for (let i = 0; i < 15; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 60));
    entries.push({
      id: `demo-${i}`,
      date,
      hours: Math.round((Math.random() * 4 + 0.5) * 2) / 2,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      notes: Math.random() > 0.5 ? 'Note aggiuntive per questa registrazione' : undefined,
      type: types[Math.floor(Math.random() * types.length)],
      createdAt: new Date(),
    });
  }

  return entries.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const useOvertime = (threshold: number = 40) => {
  const [entries, setEntries] = useState<OvertimeEntry[]>(generateDemoData());
  const [filter, setFilter] = useState<FilterPeriod>('month');

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

  const addEntry = (entry: Omit<OvertimeEntry, 'id' | 'createdAt'>) => {
    const newEntry: OvertimeEntry = {
      ...entry,
      id: `entry-${Date.now()}`,
      createdAt: new Date(),
    };
    setEntries((prev) => [newEntry, ...prev].sort((a, b) => b.date.getTime() - a.date.getTime()));
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const updateEntry = (id: string, updates: Partial<OvertimeEntry>) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...updates } : entry))
    );
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
    addEntry,
    deleteEntry,
    updateEntry,
  };
};
