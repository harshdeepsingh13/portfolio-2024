import { Footer, NavBar, ParticlesBackground } from "@/components";
import { gaID } from "@/config/config";
import { ThemeContextProvider } from "@/context";
import EmotionRegistry from "@/lib/emotionRegistry";
import "@/lib/fontawesome";
import { getData } from "@/lib/getData";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import React from "react";

const outfit = Outfit({
  weight: ["200", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

export const revalidate = 3600;

const siteUrl = "https://theharshdeepsingh.com";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: "Harshdeep Singh",
  url: siteUrl,
  jobTitle: "Full Stack Developer",
  description:
    "Full-stack software engineer with experience in React, TypeScript, Node.js, AI automation, and cloud technologies.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "CA",
  },
  knowsAbout: [
    "React",
    "TypeScript",
    "Node.js",
    "JavaScript",
    "MongoDB",
    "Express.js",
    "AWS",
    "LangChain",
    "OpenAI API",
    "Playwright",
    "Spring Boot",
    "CI/CD",
    "Full Stack Development",
    "AI Automation",
  ],
  sameAs: [
    "https://www.linkedin.com/in/harshdeepsingh13/",
    "https://github.com/harshdeepsingh13/",
    "https://www.toptal.com/resume/harshdeep-singh",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: "Harshdeep Singh",
  url: siteUrl,
  description:
    "Portfolio of Harshdeep Singh, a full stack developer focused on React, TypeScript, Node.js, and AI automation.",
  publisher: {
    "@id": `${siteUrl}/#person`,
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Harshdeep Singh | Full Stack Developer",
  description:
    "Portfolio of Harshdeep Singh, a Canada-based full stack developer specializing in React, TypeScript, Node.js, AI automation, and production web applications.",
  authors: [{ name: "Harshdeep Singh", url: siteUrl }],
  alternates: {
    canonical: "https://theharshdeepsingh.com",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { media: "(prefers-color-scheme: light)", url: "/assets/favicon_light.ico" },
      { media: "(prefers-color-scheme: dark)",  url: "/assets/favicon_dark.ico"  },
    ],
  },
  openGraph: {
    title: "Harshdeep Singh | Full Stack Developer",
    description:
      "Explore the personal portfolio of Harshdeep Singh — experienced in React, Node.js, MongoDB, Express, Java Springboot and more.",
    url: siteUrl,
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
  twitter: {
    card: "summary_large_image",
    title: "Harshdeep Singh | Full Stack Developer",
    description:
      "Portfolio of Harshdeep Singh – React, TypeScript, Node.js, AI automation, and full-stack engineering.",
    images: ["/assets/og/default.png"],
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
    <html lang="en" className={outfit.className} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t||'dark');}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <GoogleAnalytics gaId={gaID} />
        <EmotionRegistry>
          <ThemeContextProvider>
            <ParticlesBackground />
            <NavBar basicInformation={basicInformation} />
            <main>
              {children}
              <Footer />
            </main>
          </ThemeContextProvider>
        </EmotionRegistry>
      </body>
    </html>
  );
}
