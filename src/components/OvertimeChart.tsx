import { useRef, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ChartData {
  name: string;
  hours: number;
}

interface OvertimeChartProps {
  data: ChartData[];
}

export const OvertimeChart = ({ data }: OvertimeChartProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const exportChart = useCallback(async () => {
    if (!chartRef.current) return;

    try {
      const svg = chartRef.current.querySelector('svg');
      if (!svg) {
        toast({
          title: 'Errore',
          description: 'Impossibile esportare il grafico',
          variant: 'destructive',
        });
        return;
      }

      // Clone the SVG
      const clonedSvg = svg.cloneNode(true) as SVGSVGElement;
      
      // Get computed styles and set background
      const isDark = document.documentElement.classList.contains('dark');
      clonedSvg.style.backgroundColor = isDark ? 'hsl(215, 30%, 12%)' : 'hsl(0, 0%, 100%)';
      
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const svgData = new XMLSerializer().serializeToString(clonedSvg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width * 2;
        canvas.height = img.height * 2;
        ctx.scale(2, 2);
        ctx.fillStyle = isDark ? 'hsl(215, 30%, 12%)' : 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `overtime-chart-${new Date().toISOString().split('T')[0]}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);

        toast({
          title: 'Esportato!',
          description: 'Grafico salvato come immagine PNG',
        });
      };
      img.src = url;
    } catch (error) {
      toast({
        title: 'Errore',
        description: 'Si è verificato un errore durante l\'esportazione',
        variant: 'destructive',
      });
    }
  }, []);

  if (data.length === 0) {
    return (
      <div className="flex h-48 sm:h-64 items-center justify-center text-muted-foreground px-4 text-center">
        <p className="text-sm sm:text-base">Nessun dato disponibile per il periodo selezionato</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={exportChart} className="gap-2 h-9 text-xs sm:text-sm">
          <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden xs:inline">Esporta Grafico</span>
          <span className="xs:hidden">Esporta</span>
        </Button>
      </div>
      <div ref={chartRef} className="h-48 sm:h-64 w-full -ml-2 sm:ml-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 5, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval={0}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}h`}
              width={35}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.75rem',
                boxShadow: 'var(--shadow-lg)',
                fontSize: '12px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
              formatter={(value: number) => [`${value} ore`, 'Straordinari']}
            />
            <Bar
              dataKey="hours"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};