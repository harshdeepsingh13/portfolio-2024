import Breadcrumbs from "@/components/Breadcrumbs";
import SkillsComponent from "@/components/SkillsComponent";
import { getData } from "@/lib/getData";
import { Metadata } from "next";

// Keep this route dynamic so skill changes are visible immediately after DB updates.
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Skills | React, Node.js, TypeScript & AI Automation | Harshdeep Singh",
    description:
      "Technical skills across React, Node.js, TypeScript, MongoDB, AWS, Playwright, LangChain, and more.",
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
