"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    question: "Apa itu PenjualinCRM?",
    answer:
      "PenjualinCRM adalah platform manajemen hubungan pelanggan yang dirancang khusus untuk tim penjualan Indonesia. Kami menyediakan tools lengkap untuk mengelola lead, deal, dan aktivitas penjualan.",
  },
  {
    question: "Bagaimana cara memulai menggunakan PenjualinCRM?",
    answer:
      "Anda bisa memulai dengan mendaftar akun gratis, lalu mengikuti panduan setup yang akan membantu Anda mengonfigurasi team dan import data existing.",
  },
  {
    question: "Apakah data saya aman?",
    answer:
      "Ya, kami menggunakan enkripsi tingkat enterprise dan mematuhi standar keamanan internasional untuk melindungi data pelanggan.",
  },
  {
    question: "Bisakah saya mengintegrasikan dengan tools lain?",
    answer:
      "PenjualinCRM mendukung integrasi dengan berbagai tools populer seperti email marketing, calendar, dan platform komunikasi.",
  },
  {
    question: "Bagaimana sistem pricing-nya?",
    answer:
      "Kami menawarkan berbagai paket mulai dari gratis untuk team kecil hingga enterprise untuk organisasi besar. Harga disesuaikan dengan fitur dan jumlah user.",
  },
];

export function FAQSectionShadcn() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
