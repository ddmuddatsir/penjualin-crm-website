import Link from "next/link";
import { COLOR_GRAY_100, COLOR_GRAY_500 } from "@/lib/colors";

export function Footer() {
  const footerLinks = [
    { href: "/login", text: "Login" },
    { href: "/register", text: "Register" },
    { href: "#", text: "Tentang Kami" },
    { href: "#", text: "Kebijakan Privasi" },
    { href: "#", text: "Kontak" },
  ];

  return (
    <footer
      className="py-8 px-4 mt-auto"
      style={{ background: COLOR_GRAY_100 }}
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          {footerLinks.map((link, index) => (
            <Link key={index} href={link.href} className="hover:underline">
              {link.text}
            </Link>
          ))}
        </div>
        <div className="text-sm" style={{ color: COLOR_GRAY_500 }}>
          © 2024 PenjualinCRM. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
