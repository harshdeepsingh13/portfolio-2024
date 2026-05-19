import Breadcrumbs from "@/components/Breadcrumbs";
import ResumeComponent from "@/components/ResumeComponent";
import { Metadata } from "next";

const siteUrl = "https://theharshdeepsingh.com";

const resumeProfilePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${siteUrl}/resume#profilepage`,
  url: `${siteUrl}/resume`,
  name: "Resume | Harshdeep Singh — Full Stack Developer",
  description: "Download the resume and review the professional highlights of Harshdeep Singh, Full Stack Developer.",
  inLanguage: "en-US",
  isPartOf: { "@id": `${siteUrl}/#website` },
  about: { "@id": `${siteUrl}/#person` },
  mainEntity: { "@id": `${siteUrl}/#person` },
};

export const metadata: Metadata = {
  title: "Resume | Harshdeep Singh — Full Stack Developer (React, Node.js, Canada)",
  description: "Download my resume or explore my professional highlights in one place.",
  alternates: {
    canonical: "https://theharshdeepsingh.com/resume",
  },
  openGraph: {
    title: "Resume | Harshdeep Singh — Full Stack Developer (React, Node.js, Canada)",
    description: "Access the downloadable resume and quick career highlights of Harshdeep Singh.",
    url: "https://theharshdeepsingh.com/resume",
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
    title: "Resume | Harshdeep Singh — Full Stack Developer (React, Node.js, Canada)",
    description: "Download the resume and review the professional highlights of Harshdeep Singh.",
    images: ["/assets/og/default.png"],
  },
};

const Resume = () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(resumeProfilePageJsonLd) }}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Resume", href: "/resume" }]} />
      <ResumeComponent />
    </>
  );
};

export default Resume;
