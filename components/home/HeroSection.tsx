import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { HeroSectionProps } from "@/types/components";

export function HeroSection({
  isAuthenticated,
  onGoToDashboard,
}: HeroSectionProps) {
  return (
    <section className="pt-20 px-4 text-center bg-background">
      <h1 className="text-4xl font-bold mb-4 text-foreground">
        Kelola Penjualan Lebih Cepat & Terstruktur dengan{" "}
        <span className="text-primary">PenjualinCRM</span>
      </h1>
      <p className="text-lg mb-8 text-muted-foreground">
        Platform CRM & Pipeline Management modern untuk tim sales.
      </p>
      <div className="flex justify-center gap-4">
        {isAuthenticated ? (
          <Button size="lg" onClick={onGoToDashboard}>
            Go to Dashboard
          </Button>
        ) : (
          <>
            <Link href="/register">
              <Button size="lg">Mulai Sekarang</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Login
              </Button>
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
