import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { UsageProvider } from "./contexts/UsageContext";
import { ConditionalLayout } from "./components/conditional-layout";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "MeetMatee - AI-Powered Meeting Assistant",
  description: "Automatic summaries, action items, and intelligent insights for every meeting.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
  verification: {
    google: "hlZPTakWkIsvmOhOuHiIKCXKJ715uKYlE3LlUu35Qx0",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={{
        signIn: {
          start: {
            title: "Sign in to MeetMatee",
          },
        },
        signUp: {
          start: {
            title: "Sign up for MeetMatee",
          },
        },
      }}
    >
      <html lang="en" suppressHydrationWarning className="dark">
        <head>
          <meta name="google-site-verification" content="hlZPTakWkIsvmOhOuHiIKCXKJ715uKYlE3LlUu35Qx0" />
          <link rel="icon" href="/icon.png" type="image/png" />
          <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
          <link rel="shortcut icon" href="/icon.png" type="image/png" />
          <link rel="apple-touch-icon" href="/apple-icon.png" />
          <script src="https://script.supademo.com/supademo.js" async></script>
        </head>

        <body
          className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${bricolageGrotesque.variable} antialiased bg-background text-foreground`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <UsageProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
            </UsageProvider>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
