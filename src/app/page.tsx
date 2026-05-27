import { LandingPage } from "@/components";
import { getData } from "@/lib/getData";
import { getGitHubStats } from "@/lib/github";
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

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What technologies does Harshdeep Singh specialize in?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "React, TypeScript, Node.js, MongoDB, AWS, LangChain, and AI automation tools including OpenAI API and Zapier.",
      },
    },
    {
      "@type": "Question",
      name: "Is Harshdeep Singh available for freelance work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Harshdeep is a Toptal-vetted freelance full stack developer available for contract and project-based engagements.",
      },
    },
    {
      "@type": "Question",
      name: "Where is Harshdeep Singh located?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Harshdeep Singh is based in Canada and works with clients globally.",
      },
    },
    {
      "@type": "Question",
      name: "What kind of projects has Harshdeep Singh built?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Harshdeep has built AI automation tools, SaaS platforms, marketplace applications, resume builders, and production-grade full-stack web apps using React, Node.js, and cloud infrastructure.",
      },
    },
  ],
};

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

export const revalidate = 3600;

export default async function Home() {
  const [skills, basicInformation, stats, githubStats] = await Promise.all([
    getData.getSkills(),
    getData.getBasicInformation(),
    getData.getPortfolioStats(),
    getGitHubStats(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <LandingPage basicInformation={basicInformation} skills={(skills as any)?.skills} stats={stats} githubStats={githubStats} />
    </>
  );
}
