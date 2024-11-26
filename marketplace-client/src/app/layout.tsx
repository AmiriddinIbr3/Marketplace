import type { Metadata } from "next";
// import { Inter } from 'next/font/google'
import "./globals.css";

import Providers from "@/providers/Providers";
import SiteWrapper from "@/components/SiteWrapper/SiteWrapper";

// export const inter = Inter({
//   subsets: ['latin'],
//   variable: '--font-inter',
// })

export const metadata: Metadata = {
  title: "Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body /*className={inter.className}*/>
          <Providers>
            <SiteWrapper>
              {children}
            </SiteWrapper>
          </Providers>
      </body>
    </html>
  );
}
