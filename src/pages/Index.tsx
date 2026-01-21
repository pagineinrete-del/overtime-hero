import { Clock, TrendingUp, Calendar, RotateCcw, PartyPopper, ClipboardList, Loader2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { StatsCard } from '@/components/StatsCard';
import { FilterTabs } from '@/components/FilterTabs';
import { OvertimeChart } from '@/components/OvertimeChart';
import { OvertimeList } from '@/components/OvertimeList';
import { AddOvertimeDialog } from '@/components/AddOvertimeDialog';
import { ThresholdAlert } from '@/components/ThresholdAlert';
import { ExportPdfButton } from '@/components/ExportPdfButton';
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
    loading,
    addEntry,
    deleteEntry,
  } = useOvertime(40);

  if (loading) {
    return (
      <div className="min-h-screen bg-background safe-area-inset">
        <Header />
        <div className="flex items-center justify-center h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background safe-area-inset">
      <Header />
      <main className="container py-4 sm:py-6 space-y-4 sm:space-y-6 px-4 sm:px-6">
        {/* Alert */}
        {isOverThreshold && (
          <ThresholdAlert totalHours={stats.totalHours} threshold={threshold} />
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
          <StatsCard
            title="Ore Totali"
            value={stats.totalHours.toFixed(1)}
            subtitle="ore questo periodo"
            icon={Clock}
            variant="primary"
          />
          <StatsCard
            title="Straord. Ordinario"
            value={stats.ordinaryHours.toFixed(1)}
            subtitle="ore ordinarie"
            icon={ClipboardList}
          />
          <StatsCard
            title="Ore di Recupero"
            value={stats.recoveryHours.toFixed(1)}
            subtitle="ore recuperate"
            icon={RotateCcw}
            variant="success"
          />
          <StatsCard
            title="Straordinari Festivi"
            value={stats.holidayHours.toFixed(1)}
            subtitle="ore festive"
            icon={PartyPopper}
            variant="warning"
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
        </div>

        {/* Filters and Add Button */}
        <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <FilterTabs value={filter} onChange={setFilter} />
          <div className="flex gap-2 w-full sm:w-auto">
            <ExportPdfButton 
              stats={stats} 
              entries={entries} 
              filterLabel={filter === 'week' ? 'Settimana' : filter === 'month' ? 'Mese' : filter === 'year' ? 'Anno' : 'Tutti'} 
            />
            <AddOvertimeDialog onAdd={addEntry} />
          </div>
        </div>

        {/* Chart */}
        <div className="rounded-lg sm:rounded-xl border border-border bg-card p-3 sm:p-5 shadow-card">
          <div className="mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Andamento Settimanale</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Ore di straordinario per settimana</p>
          </div>
          <OvertimeChart data={chartData} />
        </div>

        {/* List */}
        <div className="rounded-lg sm:rounded-xl border border-border bg-card p-3 sm:p-5 shadow-card">
          <div className="mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Storico Registrazioni</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Le tue ore di straordinario registrate</p>
          </div>
          <OvertimeList entries={entries} onDelete={deleteEntry} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-4 sm:py-6 mt-6 sm:mt-8 safe-area-bottom">
        <div className="container text-center text-xs sm:text-sm text-muted-foreground space-y-1 px-4">
          <p>© 2025 OverTimeTracker — Gestisci le tue ore di straordinario</p>
          <p className="text-[10px] sm:text-xs">App realizzata da <a href="https://gennaropaolillo.it" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">gennaropaolillo.it</a></p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
