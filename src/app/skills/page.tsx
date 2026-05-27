import Breadcrumbs from "@/components/Breadcrumbs";
import SkillsComponent from "@/components/SkillsComponent";
import { getData } from "@/lib/getData";
import { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Skills | React, Node.js, TypeScript & AI Automation | Harshdeep Singh",
  description:
    "A curated list of technologies, frameworks, and tools I specialize in — from React and Node.js to MongoDB and beyond.",
  // Canonical URL avoids duplicate-indexing issues for the same content.
  alternates: {
    canonical: "https://theharshdeepsingh.com/skills",
  },
  openGraph: {
    title: "Skills | React, Node.js, TypeScript & AI Automation | Harshdeep Singh",
    description: "Explore the technical skills and proficiencies I bring as a full stack developer.",
    url: "https://theharshdeepsingh.com/skills",
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
    title: "Skills | React, Node.js, TypeScript & AI Automation | Harshdeep Singh",
    description:
      "Technical skills across React, Node.js, TypeScript, MongoDB, AWS, Playwright, LangChain, and more.",
    images: ["/assets/og/default.png"],
  },
};

const Skills = async () => {
  const skillsInformation: any = await getData.getSkills();
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Skills", href: "/skills" }]} />
      <SkillsComponent skills={skillsInformation?.skills} />
    </>
  );
};

export default Skills;
