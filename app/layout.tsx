import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PwaRegister } from "@/components/shared/PwaRegister";

export const metadata: Metadata = {
  metadataBase: new URL("https://pockettools-seven.vercel.app"),
  title: {
    template: "%s | Pocket Tools",
    default: "Pocket Tools — Fast, Free & Private Online Calculators",
  },
  description:
    "Everyday online calculation tools and utilities: GST, EMI, BMI, Unit Converter, Password Generator, JSON Formatter, and more. 100% private and client-side.",
  keywords: [
    "calculators",
    "online tools",
    "gst calculator",
    "emi calculator",
    "bmi calculator",
    "unit converter",
    "password generator",
    "json formatter",
  ],
  authors: [{ name: "Pocket Tools Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Pocket Tools",
    title: "Pocket Tools — All-in-One Utility App",
    description: "Fast, simple, and free online tools for everyday calculations and utilities.",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  themeColor: "#5B5BF7",
  verification: {
    google: "AnWMgQj_MUO2HEr0wuVYyrhWKaMpAYoG9NkRrjdCAkk",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-text antialiased flex flex-col selection:bg-primary/20 selection:text-primary">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={["light", "dark"]}
          enableSystem={false}
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <PwaRegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
