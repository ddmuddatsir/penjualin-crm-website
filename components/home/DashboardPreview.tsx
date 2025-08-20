import Image from "next/image";
import { COLOR_GRAY_600 } from "@/lib/colors";

export function DashboardPreview() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-xl font-bold mb-4">
          Dashboard Yang Powerful & Mudah Digunakan
        </h2>
        <p className="text-lg mb-12" style={{ color: COLOR_GRAY_600 }}>
          Kelola semua aktivitas penjualan Anda dalam satu tempat dengan
          interface yang intuitif dan modern.
        </p>

        <div className="relative w-full max-w-4xl mx-auto">
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl border border-gray-200">
            <Image
              src="/Dashboard.png"
              alt="PenjualinCRM Dashboard Preview"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Optional: Add some decorative elements */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-blue-500 rounded-full opacity-20"></div>
          <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-purple-500 rounded-full opacity-20"></div>
        </div>
      </div>
    </section>
  );
}
