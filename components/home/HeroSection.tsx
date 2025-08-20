import Link from "next/link";
import { Button } from "@/components/ui/button";
import { COLOR_BLUE_600, COLOR_GRAY_600 } from "@/lib/colors";
import type { HeroSectionProps } from "@/types/components";

export function HeroSection({
  isAuthenticated,
  onGoToDashboard,
}: HeroSectionProps) {
  return (
    <section className="pt-20 px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">
        Kelola Penjualan Lebih Cepat & Terstruktur dengan{" "}
        <span style={{ color: COLOR_BLUE_600 }}>PenjualinCRM</span>
      </h1>
      <p className="text-lg mb-8" style={{ color: COLOR_GRAY_600 }}>
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
