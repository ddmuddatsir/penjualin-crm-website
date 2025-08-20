import { Star, Quote } from "lucide-react";
import {
  COLOR_WHITE,
  COLOR_BLUE_600,
  COLOR_GRAY_600,
  COLOR_GRAY_500,
  COLOR_YELLOW_100,
} from "@/lib/colors";

interface TestimonialProps {
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  text: string;
  bgColor: string;
}

function TestimonialCard({
  name,
  role,
  company,
  avatar,
  rating,
  text,
  bgColor,
}: TestimonialProps) {
  return (
    <div
      className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      style={{ background: COLOR_WHITE }}
    >
      {/* Quote Icon */}
      <div className="mb-4">
        <Quote
          size={32}
          style={{ color: COLOR_BLUE_600 }}
          className="opacity-60"
        />
      </div>

      {/* Rating Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            style={{
              color: i < rating ? COLOR_YELLOW_100 : "#e5e7eb",
              fill: i < rating ? COLOR_YELLOW_100 : "#e5e7eb",
            }}
          />
        ))}
      </div>

      {/* Testimonial Text */}
      <p
        className="text-base leading-relaxed mb-6 italic"
        style={{ color: COLOR_GRAY_600 }}
      >
        &quot;{text}&quot;
      </p>

      {/* Profile */}
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold text-white"
          style={{ backgroundColor: bgColor }}
        >
          {avatar}
        </div>
        <div>
          <h4
            className="font-semibold text-lg"
            style={{ color: COLOR_GRAY_500 }}
          >
            {name}
          </h4>
          <p className="text-sm" style={{ color: COLOR_GRAY_600 }}>
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
      bgColor: "#3B82F6",
    },
    {
      name: "Rizky Firmansyah",
      role: "Founder",
      company: "EduTech Startup",
      avatar: "🧑‍🎓",
      rating: 5,
      text: "Team collaboration feature-nya amazing! Semua sales rep bisa sync progress leads, dan manager bisa monitor performance tim dengan mudah. Highly recommended!",
      bgColor: "#8B5CF6",
    },
    {
      name: "Linda Permata",
      role: "Sales Coordinator",
      company: "Healthcare Solutions",
      avatar: "👩‍⚕️",
      rating: 5,
      text: "Customer support 24/7 nya benar-benar responsive. Setiap ada pertanyaan langsung dibantu dengan sabar. Onboarding process juga very smooth dan comprehensive.",
      bgColor: "#EF4444",
    },
  ];

  return (
    <section className="py-20 px-4" id="testimonials">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: COLOR_GRAY_600 }}
          >
            Apa Kata Mereka Tentang Kami
          </h2>
          <p
            className="text-lg max-w-xl mx-auto"
            style={{ color: COLOR_GRAY_600 }}
          >
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
        <div
          className="rounded-xl p-8 text-center"
          style={{ background: COLOR_WHITE }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div
                className="text-3xl font-bold mb-2"
                style={{ color: COLOR_BLUE_600 }}
              >
                5,000+
              </div>
              <p style={{ color: COLOR_GRAY_600 }}>Happy Customers</p>
            </div>
            <div>
              <div
                className="text-3xl font-bold mb-2"
                style={{ color: COLOR_BLUE_600 }}
              >
                4.9/5
              </div>
              <p style={{ color: COLOR_GRAY_600 }}>Average Rating</p>
            </div>
            <div>
              <div
                className="text-3xl font-bold mb-2"
                style={{ color: COLOR_BLUE_600 }}
              >
                98%
              </div>
              <p style={{ color: COLOR_GRAY_600 }}>Customer Satisfaction</p>
            </div>
            <div>
              <div
                className="text-3xl font-bold mb-2"
                style={{ color: COLOR_BLUE_600 }}
              >
                24/7
              </div>
              <p style={{ color: COLOR_GRAY_600 }}>Support Available</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
