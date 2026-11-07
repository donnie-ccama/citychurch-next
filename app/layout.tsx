import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.citykid.me"),
  title: "Citychurch — for the heart of the city.",
  description:
    "Citychurch is a vibrant community dedicated to faith, growth, and service in the heart of the city.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('citychurch-theme');
                  const isDark = theme === 'dark' ||
                    (theme === null && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router root layout applies to every page; next/font would rename the 'Source Serif 4' family referenced in inline styles */}
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased themed-transition">
        <ScrollReveal />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
