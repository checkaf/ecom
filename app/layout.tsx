import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from '../context/CartContext';
import Link from 'next/link';
import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clothing Store",
  description: "Modern e-commerce clothing store",
};

function Navbar() {
  const { data: session, status } = useSession();
  return (
    <nav className="w-full bg-white border-b mb-8 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-xl font-bold text-blue-700">Clothing Store</Link>
        <Link href="/cart" className="text-gray-700 hover:text-blue-700">Cart</Link>
        <Link href="/admin" className="text-gray-700 hover:text-blue-700">Admin</Link>
      </div>
      <div className="flex items-center gap-4">
        {status === 'authenticated' ? (
          <>
            <Link href="/account" className="text-gray-700 hover:text-blue-700">Account</Link>
            <button onClick={() => signOut()} className="text-gray-700 hover:text-blue-700">Logout</button>
          </>
        ) : (
          <button onClick={() => signIn()} className="text-gray-700 hover:text-blue-700">Login</button>
        )}
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <CartProvider>
            <Navbar />
            {children}
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
