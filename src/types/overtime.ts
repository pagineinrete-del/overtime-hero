export interface OvertimeEntry {
  id: string;
  date: Date;
  hours: number;
  description: string;
  notes?: string;
  createdAt: Date;
}

export type FilterPeriod = 'week' | 'month' | 'year' | 'all';

export interface OvertimeStats {
  totalHours: number;
  averagePerDay: number;
  entriesCount: number;
  maxHoursDay: number;
}
