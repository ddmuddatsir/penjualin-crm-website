import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  COLOR_WHITE,
  COLOR_GRAY_50,
  COLOR_BLUE_600,
  COLOR_GRAY_600,
  COLOR_GRAY_500,
} from "../../lib/colors";

export function FAQSection() {
  const faqs = [
    {
      question: "Apakah PenjualinCRM gratis?",
      answer:
        "Ya! Kami menyediakan paket Free yang memungkinkan Anda mengelola hingga 100 leads dengan fitur dasar. Untuk fitur yang lebih advanced dan unlimited leads, tersedia paket Pro mulai dari Rp 299.000/bulan.",
    },
    {
      question: "Bagaimana cara memulai menggunakan PenjualinCRM?",
      answer:
        "Sangat mudah! Cukup daftar dengan email Anda, verifikasi akun, dan Anda langsung bisa mulai menambahkan leads pertama. Proses setup hanya membutuhkan waktu kurang dari 5 menit.",
    },
    {
      question: "Apakah bisa integrasi dengan WhatsApp dan Email?",
      answer:
        "Tentu saja! PenjualinCRM terintegrasi dengan WhatsApp Business API, Gmail, Outlook, dan berbagai platform email marketing populer. Anda juga bisa mengatur automasi follow-up via WhatsApp dan email.",
    },
    {
      question: "Apakah data saya aman dan privasi terjaga?",
      answer:
        "Keamanan data adalah prioritas utama kami. Semua data disimpan di server cloud AWS dengan enkripsi end-to-end, backup otomatis harian, dan compliance dengan standar ISO 27001. Kami tidak akan pernah membagikan data Anda kepada pihak ketiga.",
    },
    {
      question: "Bisakah tim saya bekerja bersama dalam satu akun?",
      answer:
        "Ya! PenjualinCRM mendukung kolaborasi tim dengan fitur role management, assignment leads, shared pipeline, dan real-time notifications. Setiap anggota tim bisa memiliki akses yang disesuaikan dengan perannya.",
    },
    {
      question: "Apakah tersedia aplikasi mobile?",
      answer:
        "Saat ini PenjualinCRM dapat diakses melalui mobile browser dengan tampilan yang responsive. Aplikasi mobile native untuk iOS dan Android sedang dalam tahap pengembangan dan akan segera diluncurkan.",
    },
    {
      question: "Bagaimana sistem reporting dan analytics?",
      answer:
        "PenjualinCRM menyediakan dashboard analytics yang komprehensif dengan berbagai chart dan metrics seperti conversion rate, sales performance, lead sources, dan revenue tracking. Laporan dapat di-export ke PDF atau Excel.",
    },
    {
      question: "Apakah bisa import data dari CRM lain?",
      answer:
        "Ya! Kami menyediakan fitur import data dari CSV, Excel, atau langsung dari CRM populer seperti Salesforce, HubSpot, dan Pipedrive. Tim support kami juga siap membantu proses migrasi data Anda.",
    },
    {
      question: "Bagaimana customer support yang disediakan?",
      answer:
        "Kami menyediakan support 24/7 melalui live chat, email, dan knowledge base yang lengkap. Untuk pengguna Pro, tersedia juga phone support dan dedicated account manager untuk bantuan yang lebih personal.",
    },
    {
      question: "Apakah ada training atau tutorial?",
      answer:
        "Tentu! Kami menyediakan video tutorial lengkap, webinar mingguan, dokumentasi detail, dan onboarding session 1-on-1 untuk memastikan Anda dan tim bisa memaksimalkan penggunaan PenjualinCRM.",
    },
  ];

  return (
    <section
      className="py-20 px-4"
      style={{ background: COLOR_GRAY_50 }}
      id="faq"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl font-bold mb-4"
            style={{ color: COLOR_GRAY_500 }}
          >
            Frequently Asked Questions
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: COLOR_GRAY_600 }}
          >
            Temukan jawaban untuk pertanyaan yang sering diajukan tentang
            PenjualinCRM. Masih ada pertanyaan? Hubungi tim support kami yang
            siap membantu 24/7.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div
          className="rounded-xl p-8 shadow-lg"
          style={{ background: COLOR_WHITE }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-gray-200 rounded-lg px-6 py-2 hover:shadow-md transition-all duration-200"
              >
                <AccordionTrigger
                  className="text-left font-semibold text-lg hover:no-underline py-4"
                  style={{ color: COLOR_GRAY_600 }}
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent
                  className="text-base leading-relaxed pb-4"
                  style={{ color: COLOR_GRAY_600 }}
                >
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA at bottom */}
        <div className="text-center mt-12">
          <p className="text-lg mb-4" style={{ color: COLOR_GRAY_600 }}>
            Masih ada pertanyaan lain?
          </p>
          <button
            className="px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: COLOR_BLUE_600 }}
          >
            Hubungi Support Kami
          </button>
        </div>
      </div>
    </section>
  );
}
