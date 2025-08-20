import Image from "next/image";

export function DashboardPreview() {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-xl font-bold mb-4 text-foreground">
          Dashboard Yang Powerful & Mudah Digunakan
        </h2>
        <p className="text-lg mb-12 text-muted-foreground">
          Kelola semua aktivitas penjualan Anda dalam satu tempat dengan
          interface yang intuitif dan modern.
        </p>

        <div className="relative w-full max-w-4xl mx-auto">
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl border border-border">
            <Image
              src="/Dashboard.png"
              alt="PenjualinCRM Dashboard Preview"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Optional: Add some decorative elements */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary/20 rounded-full"></div>
          <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-secondary/20 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
