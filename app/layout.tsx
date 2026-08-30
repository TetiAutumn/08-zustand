import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NoteHub — simple and efficient note manager",
  description:
    "NoteHub is a simple and efficient application for managing personal notes. Create, search and organize your notes in one place.",
  openGraph: {
    title: "NoteHub — simple and efficient note manager",
    description:
      "NoteHub is a simple and efficient application for managing personal notes. Create, search and organize your notes in one place.",
    url: "https://notehub.com/",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub — simple and efficient note manager",
      },
    ],
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={roboto.variable}>
        <TanStackProvider >
          <Header />
          {children}
          {modal}
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
