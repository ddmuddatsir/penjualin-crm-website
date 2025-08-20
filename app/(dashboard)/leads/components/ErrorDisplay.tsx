import { Button } from "@/components/ui/button";

interface ErrorDisplayProps {
  error: Error | null;
  onRetry: () => void;
  title?: string;
}

export default function ErrorDisplay({
  error,
  onRetry,
  title = "Gagal memuat data leads",
}: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <div className="mb-4 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-red-800 dark:text-red-200 font-medium">
            {title}
          </h3>
          <p className="text-red-600 dark:text-red-300 text-sm mt-1">
            {error instanceof Error
              ? error.message
              : "Terjadi kesalahan yang tidak diketahui"}
          </p>
        </div>
        <Button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Coba Lagi
        </Button>
      </div>
    </div>
  );
}
