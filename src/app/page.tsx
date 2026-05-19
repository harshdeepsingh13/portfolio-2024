import { LandingPage } from "@/components";
import { getData } from "@/lib/getData";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Harshdeep Singh | Full Stack Developer, React & AI Automation Engineer",
  description:
    "Portfolio of Harshdeep Singh, a Canada-based full stack developer specializing in React, TypeScript, Node.js, AI automation, and production web applications.",
  alternates: {
    canonical: "https://theharshdeepsingh.com",
  },
  openGraph: {
    title: "Harshdeep Singh | Full Stack Developer, React & AI Automation Engineer",
    description:
      "Explore the portfolio, skills, projects, and professional experience of Harshdeep Singh.",
    url: "https://theharshdeepsingh.com",
    siteName: "Harshdeep Singh",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/assets/og/default.png",
        width: 1200,
        height: 630,
        alt: "Harshdeep Singh – Full Stack Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Harshdeep Singh | Full Stack Developer, React & AI Automation Engineer",
    description:
      "Portfolio of Harshdeep Singh, focused on React, TypeScript, Node.js, AI automation, and full-stack engineering.",
    images: ["/assets/og/default.png"],
  },
};

const siteUrl = "https://theharshdeepsingh.com";

const profilePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${siteUrl}/#profilepage`,
  url: siteUrl,
  name: "Harshdeep Singh | Full Stack Developer, React & AI Automation Engineer",
  description:
    "Portfolio of Harshdeep Singh, a Canada-based full stack developer specializing in React, TypeScript, Node.js, AI automation, and production web applications.",
  inLanguage: "en-US",
  isPartOf: { "@id": `${siteUrl}/#website` },
  about: { "@id": `${siteUrl}/#person` },
  mainEntity: { "@id": `${siteUrl}/#person` },
};

// Render at request time so home page reflects latest DB updates without rebuild.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const skills: any = await getData.getSkills();
  const basicInformation = await getData.getBasicInformation();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageJsonLd) }}
      />
      <LandingPage basicInformation={basicInformation} skills={skills?.skills} />
    </>
  );
}
