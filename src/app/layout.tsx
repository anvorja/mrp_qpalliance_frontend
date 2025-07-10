import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import { Sidebar } from "@/components/shared/Sidebar";
//import { Header } from "@/components/shared/Header";
import {Toaster} from "sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import {ThemeFavicon} from "@/components/ThemeFavicon";
import { AuthProvider } from '@/contexts/AuthContext';
import {AuthHeader} from "@/components/shared/AuthHeader";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "QPAlliance MRP - Inventario",
    description: "Sistema de gestión de inventario para procesos de manufactura",
    icons: {
        icon: "https://res.cloudinary.com/dv2xu8dwr/image/upload/v1745894289/erp_6_nserdt.png"
    }
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <AuthProvider>
                <ThemeFavicon />
                <div className="flex h-screen">
                    <Sidebar />
                    <div className="flex-1 flex flex-col bg-purple-50/50 dark:bg-neutral-900/95">
                        <AuthHeader />
                        <main className="flex-1 p-6 overflow-auto">
                            {children}
                        </main>
                    </div>
                </div>
                <Toaster/>
            </AuthProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}