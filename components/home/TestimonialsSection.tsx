import { Star, Quote } from "lucide-react";

interface TestimonialProps {
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  text: string;
}

function TestimonialCard({
  name,
  role,
  company,
  avatar,
  rating,
  text,
}: TestimonialProps) {
  return (
    <div className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card border border-border">
      {/* Quote Icon */}
      <div className="mb-4">
        <Quote size={32} className="text-primary opacity-60" />
      </div>

      {/* Rating Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${
              i < rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>

      {/* Testimonial Text */}
      <p className="text-base leading-relaxed mb-6 italic text-muted-foreground">
        &quot;{text}&quot;
      </p>

      {/* Profile */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold text-white bg-primary">
          {avatar}
        </div>
        <div>
          <h4 className="font-semibold text-lg text-foreground">{name}</h4>
          <p className="text-sm text-muted-foreground">
            {role} • {company}
          </p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Andi Pratama",
      role: "Sales Manager",
      company: "TechStart Indonesia",
      avatar: "🧑‍💼",
      rating: 5,
      text: "PenjualinCRM benar-benar mengubah cara tim sales kami bekerja. Productivity meningkat 60% dan closing rate naik dari 15% menjadi 35%. Interface-nya sangat user-friendly!",
    },
    {
      name: "Rizky Firmansyah",
      role: "Founder",
      company: "EduTech Startup",
      avatar: "🧑‍🎓",
      rating: 5,
      text: "Team collaboration feature-nya amazing! Semua sales rep bisa sync progress leads, dan manager bisa monitor performance tim dengan mudah. Highly recommended!",
    },
    {
      name: "Linda Permata",
      role: "Sales Coordinator",
      company: "Healthcare Solutions",
      avatar: "👩‍⚕️",
      rating: 5,
      text: "Customer support 24/7 nya benar-benar responsive. Setiap ada pertanyaan langsung dibantu dengan sabar. Onboarding process juga very smooth dan comprehensive.",
    },
  ];

  return (
    <section className="py-20 px-4 bg-background" id="testimonials">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-2xl font-bold mb-4 text-foreground">
            Apa Kata Mereka Tentang Kami
          </h2>
          <p className="text-lg max-w-xl mx-auto text-muted-foreground">
            Ribuan bisnis di Indonesia sudah merasakan manfaat PenjualinCRM.
            Dengarkan cerita sukses mereka yang telah meningkatkan penjualan
            dengan platform kami.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>

        {/* Stats Bar */}
        <div className="rounded-xl p-8 text-center bg-card border border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold mb-2 text-primary">5,000+</div>
              <p className="text-muted-foreground">Happy Customers</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2 text-primary">4.9/5</div>
              <p className="text-muted-foreground">Average Rating</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2 text-primary">98%</div>
              <p className="text-muted-foreground">Customer Satisfaction</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2 text-primary">24/7</div>
              <p className="text-muted-foreground">Support Available</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
