import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
// import Header from "@/components/header";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ko" className="bg-black">
        <body className="overscroll-none bg-black">
          {/* <Header /> */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
