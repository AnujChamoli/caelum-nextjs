import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Analytics } from "@vercel/analytics/next"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://caelum.com"
  ),
  title: {
    default: "Caelum - Transform Your School Investment Journey",
    template: "%s | Caelum",
  },
  description:
    "Caelum helps investors and educators navigate the school investment landscape with AI-powered tools and expert guidance.",
  keywords: [
    "school investment",
    "education",
    "caelum",
    "investor",
    "teacher",
    "AI assistant",
  ],
  authors: [{ name: "Caelum" }],
  creator: "Caelum",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Caelum",
    title: "Caelum - Transform Your School Investment Journey",
    description: "AI-powered platform for school investors and educators.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Caelum",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Caelum - Transform Your School Investment Journey",
    description: "AI-powered platform for school investors and educators.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${poppins.variable}`}>
      <body className="font-montserrat antialiased">
        <Providers>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Providers>
      </body>
    </html>
  );
}
