import { Clock, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { Header } from '@/components/Header';
import { StatsCard } from '@/components/StatsCard';
import { FilterTabs } from '@/components/FilterTabs';
import { OvertimeChart } from '@/components/OvertimeChart';
import { OvertimeList } from '@/components/OvertimeList';
import { AddOvertimeDialog } from '@/components/AddOvertimeDialog';
import { ThresholdAlert } from '@/components/ThresholdAlert';
import { useOvertime } from '@/hooks/useOvertime';

const Index = () => {
  const {
    entries,
    filter,
    setFilter,
    stats,
    chartData,
    isOverThreshold,
    threshold,
    addEntry,
    deleteEntry,
  } = useOvertime(40);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6 space-y-6">
        {/* Alert */}
        {isOverThreshold && (
          <ThresholdAlert totalHours={stats.totalHours} threshold={threshold} />
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Ore Totali"
            value={stats.totalHours.toFixed(1)}
            subtitle="ore questo periodo"
            icon={Clock}
            variant="primary"
          />
          <StatsCard
            title="Media Giornaliera"
            value={stats.averagePerDay.toFixed(1)}
            subtitle="ore per giorno"
            icon={TrendingUp}
          />
          <StatsCard
            title="Registrazioni"
            value={stats.entriesCount}
            subtitle="questo periodo"
            icon={Calendar}
          />
          <StatsCard
            title="Max Giornaliero"
            value={stats.maxHoursDay.toFixed(1)}
            subtitle="ore in un giorno"
            icon={AlertCircle}
            variant={stats.maxHoursDay > 4 ? 'warning' : 'default'}
          />
        </div>

        {/* Filters and Add Button */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <FilterTabs value={filter} onChange={setFilter} />
          <AddOvertimeDialog onAdd={addEntry} />
        </div>

        {/* Chart */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">Andamento Settimanale</h2>
            <p className="text-sm text-muted-foreground">Ore di straordinario per settimana</p>
          </div>
          <OvertimeChart data={chartData} />
        </div>

        {/* List */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-card">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground">Storico Registrazioni</h2>
            <p className="text-sm text-muted-foreground">Le tue ore di straordinario registrate</p>
          </div>
          <OvertimeList entries={entries} onDelete={deleteEntry} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-6 mt-8">
        <div className="container text-center text-sm text-muted-foreground space-y-1">
          <p>© 2025 OverTimeTracker — Gestisci le tue ore di straordinario</p>
          <p className="text-xs">App realizzata da <span className="font-semibold text-primary">GP</span></p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
