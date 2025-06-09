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
  title: "Harshdeep Singh | Portfolio",
  description: "Know more about Harshdeep!",
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
