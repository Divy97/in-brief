import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata = {
  title: "Quizify - Generate Smart Questionnaires",
  description: "Transform articles and videos into interactive questionnaires",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.className}>
      <body className="bg-white text-slate-900 antialiased">
        <div className="min-h-screen flex flex-col">
          {/* Navbar */}
          <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-x-8">
                  <Link href="/" className="flex items-center gap-2">
                    <span className="text-xl font-semibold">Quizify</span>
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Main content */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer className="border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
              <p className="text-sm text-slate-500">
                Build by{" "}
                <Link
                  href="https://github.com/Divy97"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  DIvy Parekh
                </Link>
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
