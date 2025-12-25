import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ThresholdAlertProps {
  totalHours: number;
  threshold: number;
}

export const ThresholdAlert = ({ totalHours, threshold }: ThresholdAlertProps) => {
  const excess = totalHours - threshold;

  return (
    <Alert className="border-warning/30 bg-warning/10 animate-scale-in">
      <AlertTriangle className="h-5 w-5 text-warning" />
      <AlertTitle className="text-warning font-semibold">Attenzione: Soglia superata</AlertTitle>
      <AlertDescription className="text-warning/80">
        Hai superato il limite di {threshold} ore di straordinario di{' '}
        <strong>{excess.toFixed(1)} ore</strong>. Considera di rivedere il carico di lavoro.
      </AlertDescription>
    </Alert>
  );
};
