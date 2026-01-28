import type { Metadata } from "next";
import { Inter, Crimson_Pro } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/lib/theme";
import "./globals.css";

/** Inline script: apply stored theme before first paint to avoid flash (no React) */
const THEME_SCRIPT = `
(function(){
  var k = 'fiction-movie-theme';
  try {
    if (localStorage.getItem(k) === 'light') document.documentElement.classList.add('light');
    else document.documentElement.classList.remove('light');
  } catch(e) {}
})();
`;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const crimson = Crimson_Pro({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-crimson",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fiction Movie – AI-Powered Indian Fiction",
  description:
    "You are the director. AI is the writer. Create controlled, chapter-driven stories with rules, memory, and Indian mythology, folklore, and sci-fi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${crimson.variable}`} suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased flex flex-col" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <ThemeProvider>
          <Header />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
