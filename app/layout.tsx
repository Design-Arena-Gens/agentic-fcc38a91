import type { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "CT Scan vs MRI Analyzer",
  description:
    "Upload medical imaging and get AI-backed insights into modality classification and diagnostic cues."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-8 sm:px-8">
          {children}
        </div>
      </body>
    </html>
  );
}
