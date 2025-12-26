import { Navigate } from 'react-router-dom';
import { Clock, TrendingUp, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { StatsCard } from '@/components/StatsCard';
import { FilterTabs } from '@/components/FilterTabs';
import { OvertimeChart } from '@/components/OvertimeChart';
import { OvertimeList } from '@/components/OvertimeList';
import { AddOvertimeDialog } from '@/components/AddOvertimeDialog';
import { ThresholdAlert } from '@/components/ThresholdAlert';
import { useOvertime } from '@/hooks/useOvertime';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user, loading } = useAuth();
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-4 sm:py-6 space-y-4 sm:space-y-6 px-4">
        {/* Alert */}
        {isOverThreshold && (
          <ThresholdAlert totalHours={stats.totalHours} threshold={threshold} />
        )}

        {/* Stats Cards */}
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Ore Totali"
            value={stats.totalHours.toFixed(1)}
            subtitle="questo periodo"
            icon={Clock}
            variant="primary"
          />
          <StatsCard
            title="Media"
            value={stats.averagePerDay.toFixed(1)}
            subtitle="ore/giorno"
            icon={TrendingUp}
          />
          <StatsCard
            title="Registrazioni"
            value={stats.entriesCount}
            subtitle="totali"
            icon={Calendar}
          />
          <StatsCard
            title="Max"
            value={stats.maxHoursDay.toFixed(1)}
            subtitle="ore/giorno"
            icon={AlertCircle}
            variant={stats.maxHoursDay > 4 ? 'warning' : 'default'}
          />
        </div>

        {/* Filters and Add Button */}
        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <FilterTabs value={filter} onChange={setFilter} />
          <AddOvertimeDialog onAdd={addEntry} />
        </div>

        {/* Chart */}
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-card">
          <div className="mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Andamento Settimanale</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Ore di straordinario per settimana</p>
          </div>
          <OvertimeChart data={chartData} />
        </div>

        {/* List */}
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-card">
          <div className="mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Storico Registrazioni</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Le tue ore di straordinario registrate</p>
          </div>
          <OvertimeList entries={entries} onDelete={deleteEntry} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-4 sm:py-6 mt-6 sm:mt-8">
        <div className="container text-center text-xs sm:text-sm text-muted-foreground space-y-1 px-4">
          <p>© 2025 OverTimeTracker — Gestisci le tue ore di straordinario</p>
          <p className="text-xs">App realizzata da <span className="font-semibold text-primary">GP</span></p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
