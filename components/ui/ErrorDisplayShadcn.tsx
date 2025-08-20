import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ErrorDisplayProps {
  error: Error | null;
  onRetry: () => void;
}

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Gagal memuat data deals</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>
          {error instanceof Error
            ? error.message
            : "Terjadi kesalahan yang tidak diketahui"}
        </span>
        <Button
          onClick={onRetry}
          variant="destructive"
          size="sm"
          className="ml-4"
        >
          Coba Lagi
        </Button>
      </AlertDescription>
    </Alert>
  );
}
