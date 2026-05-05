import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
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
        {/* Fundraise Up: the new standard for online giving */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,n,a){if(!w[n]){var l='call,catch,on,once,set,then,track,openCheckout'
              .split(','),i,o=function(n){return'function'==typeof n?o.l.push([arguments])&&o
              :function(){return o.l.push([n,arguments])&&o}},t=d.getElementsByTagName(s)[0],
              j=d.createElement(s);j.async=!0;j.src='https://cdn.fundraiseup.com/widget/'+a+'';
              t.parentNode.insertBefore(j,t);o.s=Date.now();o.v=5;o.h=w.location.href;o.l=[];
              for(i=0;i<8;i++)o[l[i]]=o(l[i]);w[n]=o}
              })(window,document,'script','FundraiseUp','AECFDSSY');
            `,
          }}
        />
        {/* End Fundraise Up */}
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
