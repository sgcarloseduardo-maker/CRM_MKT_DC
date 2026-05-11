import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { ReactNode } from "react";
import { Bricolage_Grotesque, Fraunces } from "next/font/google";

const bodyFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600"]
});

const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"]
});

export const metadata = {
  title: "CRM_MKT_DC",
  description: "CRM operacional privado para marketing afiliado multicanal"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        <div className="app-shell">
          <Sidebar />
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
