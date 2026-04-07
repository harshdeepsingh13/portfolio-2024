import ExperienceComponent from "@/components/ExperienceComponent";
import { getData } from "@/lib/getData";
import { Metadata } from "next";

// Keep this route dynamic so latest work history is always server-rendered.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Work Experience | Harshdeep Singh",
  description: "An overview of my work experience across SaaS, eCommerce, and consulting companies.",
  // Canonical URL helps consolidate SEO signals to this route.
  alternates: {
    canonical: "https://theharshdeepsingh.com/experiences",
  },
  openGraph: {
    title: "Work Experience | Harshdeep Singh",
    description: "See where I’ve worked and the impact I’ve made as a full stack developer.",
    url: "https://theharshdeepsingh.com/experiences",
    siteName: "Harshdeep Singh",
    locale: "en_US",
    type: "profile",
  },
};

const Experiences = async () => {
  const experiences = await getData.getWorkExperiences();

  return (
    <>
      <ExperienceComponent experiences={experiences} />
    </>
  );
};

export default Experiences;
