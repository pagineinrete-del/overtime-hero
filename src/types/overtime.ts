export type OvertimeType = 'straordinario' | 'recupero' | 'festivo';

export interface OvertimeEntry {
  id: string;
  date: Date;
  hours: number;
  description: string;
  notes?: string;
  type: OvertimeType;
  createdAt: Date;
}

export type FilterPeriod = 'week' | 'month' | 'year' | 'all';

export interface OvertimeStats {
  totalHours: number;
  averagePerDay: number;
  entriesCount: number;
  maxHoursDay: number;
  recoveryHours: number;
  holidayHours: number;
}
