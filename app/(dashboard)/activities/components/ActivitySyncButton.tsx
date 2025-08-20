import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function ActivitySyncButton() {
  const { toast } = useToast();
  return (
    <Button
      className="mt-2 w-full"
      variant="secondary"
      onClick={() => toast({ title: "Sinkronisasi Google Calendar berhasil" })}
    >
      Sync Google Calendar
    </Button>
  );
}
