import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StateProvider } from "@/context/StateContext";
import { ChatContextProvider } from "@/context/ChatContext";
import { SocketContextProvider } from "@/context/SocketContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Converssa - Real-Time Chat App",
  description: "Converssa is a modern real-time chat application for seamless conversations, featuring instant messaging, online status, and a smooth user experience.",
};

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
        <StateProvider>
          <SocketContextProvider>
            <ChatContextProvider>
              {children}
              <div id="photo-picker-element"></div>
            </ChatContextProvider>
          </SocketContextProvider>
        </StateProvider>
      </body>
    </html>
  );
}
