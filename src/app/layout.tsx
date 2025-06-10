import { NavBar } from "@/components";
import { gaID } from "@/config/config";
import { ThemeContextProvider } from "@/context";
import "@/lib/fontawesome";
import { getData } from "@/lib/getData";
import StyledComponentsRegistry from "@/lib/styledComponentsRegistry";
import { GoogleAnalytics } from "@next/third-parties/google";
import "bootstrap/dist/css/bootstrap.min.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";
import "./globals.css";

const inter = Inter({
  weight: ["200", "300", "400", "500", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Harshdeep Singh | Full Stack Developer",
  description:
    "Portfolio of Harshdeep Singh – MERN stack developer, photographer, and creator. Explore my work, projects, and journey.",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/assets/favicon_light.ico",
        href: "/assets/favicon_light.ico",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/assets/favicon_dark.ico",
        href: "/assets/favicon_dark.ico",
      },
    ],
  },
  openGraph: {
    title: "Harshdeep Singh | Full Stack Developer",
    description:
      "Explore the personal portfolio of Harshdeep Singh — experienced in React, Node.js, MongoDB, Express, Java Springboot and more.",
    url: "https://theharshdeepsingh.com",
    siteName: "Harshdeep Singh",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/assets/og/default.png", // Path in /public folder
        width: 1200,
        height: 630,
        alt: "Harshdeep Singh – Full Stack Portfolio",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const basicInformation = await getData.getBasicInformation();

  return (
    <html lang="en" className={inter.className}>
      <body>
        <GoogleAnalytics gaId={gaID} />
        <StyledComponentsRegistry>
          <ThemeContextProvider>
            <NavBar basicInformation={basicInformation} />
            {/* <main>{children}</main> */}
            {children}
          </ThemeContextProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
