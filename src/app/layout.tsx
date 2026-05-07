import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NekiBridge — Smart Clothing Donation Platform",
    template: "%s | NekiBridge",
  },
  description:
    "Connect with verified Pakistani NGOs to donate clothing smartly. Track your donations from pickup to distribution. Making every donation count.",
  keywords: [
    "clothing donation",
    "Pakistan",
    "NGO",
    "charity",
    "clothes bank",
    "donate clothes",
    "NekiBridge",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen custom-scrollbar">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
