import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OvertimeStats } from '@/types/overtime';
import { OvertimeEntry } from '@/types/overtime';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import jsPDF from 'jspdf';

interface ExportPdfButtonProps {
  stats: OvertimeStats;
  entries: OvertimeEntry[];
  filterLabel: string;
}

export const ExportPdfButton = ({ stats, entries, filterLabel }: ExportPdfButtonProps) => {
  const exportToPdf = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Riepilogo Ore Straordinarie', pageWidth / 2, 20, { align: 'center' });
      
      // Period
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Periodo: ${filterLabel}`, pageWidth / 2, 30, { align: 'center' });
      doc.text(`Data esportazione: ${format(new Date(), 'd MMMM yyyy', { locale: it })}`, pageWidth / 2, 38, { align: 'center' });
      
      // Separator
      doc.setDrawColor(200);
      doc.line(20, 45, pageWidth - 20, 45);
      
      // Summary Section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Riepilogo Ore', 20, 55);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      
      const summaryData = [
        { label: 'Ore Totali', value: `${stats.totalHours.toFixed(1)} ore` },
        { label: 'Straordinario Ordinario', value: `${stats.ordinaryHours.toFixed(1)} ore` },
        { label: 'Ore da Recuperare', value: `${stats.recoveryHours.toFixed(1)} ore` },
        { label: 'Straordinari Festivi', value: `${stats.holidayHours.toFixed(1)} ore` },
        { label: 'Media Giornaliera', value: `${stats.averagePerDay.toFixed(1)} ore` },
        { label: 'Numero Registrazioni', value: `${stats.entriesCount}` },
      ];
      
      let yPos = 65;
      summaryData.forEach((item) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${item.label}:`, 25, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(item.value, 90, yPos);
        yPos += 8;
      });
      
      // Separator
      yPos += 5;
      doc.line(20, yPos, pageWidth - 20, yPos);
      yPos += 10;
      
      // Entries Table
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Dettaglio Registrazioni', 20, yPos);
      yPos += 10;
      
      // Table headers
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Data', 20, yPos);
      doc.text('Tipo', 55, yPos);
      doc.text('Ore', 100, yPos);
      doc.text('Descrizione', 120, yPos);
      yPos += 5;
      doc.line(20, yPos, pageWidth - 20, yPos);
      yPos += 5;
      
      // Table rows
      doc.setFont('helvetica', 'normal');
      const typeLabels: Record<string, string> = {
        straordinario: 'Straord.',
        ordinario: 'Ordinario',
        recupero: 'Recupero',
        festivo: 'Festivo',
      };
      
      entries.slice(0, 30).forEach((entry) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.text(format(entry.date, 'dd/MM/yy'), 20, yPos);
        doc.text(typeLabels[entry.type] || entry.type, 55, yPos);
        doc.text(`${entry.hours}h`, 100, yPos);
        
        // Truncate description if too long
        const maxDescLength = 40;
        const desc = entry.description.length > maxDescLength 
          ? entry.description.substring(0, maxDescLength) + '...'
          : entry.description;
        doc.text(desc, 120, yPos);
        
        yPos += 7;
      });
      
      if (entries.length > 30) {
        yPos += 5;
        doc.setFont('helvetica', 'italic');
        doc.text(`... e altre ${entries.length - 30} registrazioni`, 20, yPos);
      }
      
      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(
          `Pagina ${i} di ${pageCount} - TempoPiù`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }
      
      // Save
      doc.save(`riepilogo-ore-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      
      toast({
        title: 'PDF Esportato!',
        description: 'Il riepilogo è stato salvato come PDF',
      });
    } catch (error) {
      toast({
        title: 'Errore',
        description: 'Impossibile generare il PDF',
        variant: 'destructive',
      });
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={exportToPdf} className="gap-2 h-9 text-xs sm:text-sm">
      <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      <span className="hidden xs:inline">Esporta PDF</span>
      <span className="xs:hidden">PDF</span>
    </Button>
  );
};
