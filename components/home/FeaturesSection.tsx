import {
  COLOR_BLUE_100,
  COLOR_GREEN_100,
  COLOR_YELLOW_100,
  COLOR_PURPLE_100,
  COLOR_GRAY_500,
} from "@/lib/colors";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  bgColor: string;
}

function FeatureCard({ icon, title, description, bgColor }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-4 text-2xl"
        style={{ background: bgColor }}
      >
        {icon}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-center" style={{ color: COLOR_GRAY_500 }}>
        {description}
      </p>
    </div>
  );
}

export function FeaturesSection() {
  const features = [
    {
      icon: "📋",
      title: "Manajemen Lead",
      description:
        "Kelola prospek dan data pelanggan secara terpusat dan efisien.",
      bgColor: COLOR_BLUE_100,
    },
    {
      icon: "🗂️",
      title: "Pipeline Visual",
      description:
        "Pantau progres penjualan dengan tampilan kanban interaktif.",
      bgColor: COLOR_GREEN_100,
    },
    {
      icon: "📊",
      title: "Dashboard Penjualan",
      description:
        "Lihat metrik performa dan insight penjualan secara real-time.",
      bgColor: COLOR_YELLOW_100,
    },
    {
      icon: "📅",
      title: "Aktivitas Terjadwal",
      description: "Jadwalkan meeting, call, dan aktivitas sales dengan mudah.",
      bgColor: COLOR_PURPLE_100,
    },
  ];

  return (
    <section className="py-16 px-4 max-w-4xl mx-auto" id="fitur">
      <h2 className="text-2xl font-bold text-center mb-10">Fitur Unggulan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            bgColor={feature.bgColor}
          />
        ))}
      </div>
    </section>
  );
}
