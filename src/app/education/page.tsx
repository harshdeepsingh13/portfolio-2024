import Breadcrumbs from "@/components/Breadcrumbs";
import EducationComponent from "@/components/EducationComponent";
import { getData } from "@/lib/getData";
import { Metadata } from "next";

// Keep this route dynamic so education entries stay in sync with MongoDB.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Education & Certifications | Harshdeep Singh — Full Stack Developer",
  description:
    "Details about my academic background, including degrees and certifications in Data Analytics and Computer Science.",
  // Canonical URL signals the authoritative route to search crawlers.
  alternates: {
    canonical: "https://theharshdeepsingh.com/education",
  },
  openGraph: {
    title: "Education & Certifications | Harshdeep Singh — Full Stack Developer",
    description: "Academic qualifications and ongoing learning journey of Harshdeep Singh.",
    url: "https://theharshdeepsingh.com/education",
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
    title: "Education & Certifications | Harshdeep Singh — Full Stack Developer",
    description: "Academic background, Data Analytics training, Computer Science Engineering, and continuous learning.",
    images: ["/assets/og/default.png"],
  },
};

const siteUrl = "https://theharshdeepsingh.com";

const Education = async () => {
  const educationInformation = await getData.getEducationInformation();

  const educationItemListJsonLd = educationInformation?.length
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Education & Certifications — Harshdeep Singh",
        url: `${siteUrl}/education`,
        numberOfItems: educationInformation.length,
        itemListElement: educationInformation.map((edu: any, index: number) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "EducationalOrganization",
            name: edu.instituteName,
            ...(edu.course && { description: edu.course }),
            ...(edu.location && {
              address: {
                "@type": "PostalAddress",
                addressLocality: edu.location,
              },
            }),
            alumni: { "@id": `${siteUrl}/#person` },
          },
        })),
      }
    : null;

  return (
    <>
      {educationItemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(educationItemListJsonLd) }}
        />
      )}
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
