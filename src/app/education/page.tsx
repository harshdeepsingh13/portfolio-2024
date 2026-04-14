import Breadcrumbs from "@/components/Breadcrumbs";
import EducationComponent from "@/components/EducationComponent";
import { getData } from "@/lib/getData";
import { Metadata } from "next";

// Keep this route dynamic so education entries stay in sync with MongoDB.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Education | Harshdeep Singh",
  description:
    "Details about my academic background, including degrees and certifications in Data Analytics and Computer Science.",
  // Canonical URL signals the authoritative route to search crawlers.
  alternates: {
    canonical: "https://theharshdeepsingh.com/education",
  },
  openGraph: {
    title: "Education | Harshdeep Singh",
    description: "Academic qualifications and ongoing learning journey of Harshdeep Singh.",
    url: "https://theharshdeepsingh.com/education",
    siteName: "Harshdeep Singh",
    locale: "en_US",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Education | Harshdeep Singh",
    description: "Academic background, Data Analytics training, Computer Science Engineering, and continuous learning.",
  },
};

const Education = async () => {
  const educationInformation = await getData.getEducationInformation();
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Education", href: "/education" },
        ]}
      />
      <EducationComponent educationDetails={educationInformation} />
    </>
  );
};

export default Education;
