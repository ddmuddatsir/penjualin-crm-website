interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  bgColorClass: string;
}

function FeatureCard({
  icon,
  title,
  description,
  bgColorClass,
}: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 text-2xl ${bgColorClass}`}
      >
        {icon}
      </div>
      <h3 className="font-semibold mb-2 text-foreground">{title}</h3>
      <p className="text-sm text-center text-muted-foreground">{description}</p>
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
      bgColorClass: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      icon: "🗂️",
      title: "Pipeline Visual",
      description:
        "Pantau progres penjualan dengan tampilan kanban interaktif.",
      bgColorClass: "bg-green-100 dark:bg-green-900/20",
    },
    {
      icon: "📊",
      title: "Dashboard Penjualan",
      description:
        "Lihat metrik performa dan insight penjualan secara real-time.",
      bgColorClass: "bg-yellow-100 dark:bg-yellow-900/20",
    },
    {
      icon: "📅",
      title: "Aktivitas Terjadwal",
      description: "Jadwalkan meeting, call, dan aktivitas sales dengan mudah.",
      bgColorClass: "bg-purple-100 dark:bg-purple-900/20",
    },
  ];

  return (
    <section className="py-16 px-4 max-w-4xl mx-auto bg-background" id="fitur">
      <h2 className="text-2xl font-bold text-center mb-10 text-foreground">
        Fitur Unggulan
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            bgColorClass={feature.bgColorClass}
          />
        ))}
      </div>
    </section>
  );
}
