import Breadcrumbs from "@/components/Breadcrumbs";
import ExperienceComponent from "@/components/ExperienceComponent";
import { getData } from "@/lib/getData";
import { Metadata } from "next";

// Keep this route dynamic so latest work history is always server-rendered.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Work Experience | Full Stack Developer Experience | Harshdeep Singh",
  description:
    "An overview of my work experience across SaaS, eCommerce, consulting, and product engineering teams.",
  // Canonical URL helps consolidate SEO signals to this route.
  alternates: {
    canonical: "https://theharshdeepsingh.com/experiences",
  },
  openGraph: {
    title: "Work Experience | Full Stack Developer Experience | Harshdeep Singh",
    description: "See where I’ve worked and the impact I’ve made as a full stack developer.",
    url: "https://theharshdeepsingh.com/experiences",
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
    title: "Work Experience | Full Stack Developer Experience | Harshdeep Singh",
    description:
      "Full stack developer experience across SaaS, eCommerce, consulting, marketplace platforms, and production deployments.",
    images: ["/assets/og/default.png"],
  },
};

const siteUrl = "https://theharshdeepsingh.com";

const Experiences = async () => {
  const experiences = await getData.getWorkExperiences();

  const experiencesItemListJsonLd = experiences?.length
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Work Experience — Harshdeep Singh",
        url: `${siteUrl}/experiences`,
        numberOfItems: experiences.length,
        itemListElement: experiences.map((exp: any, index: number) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Role",
            roleName: exp.position,
            ...(exp.startDate && {
              startDate: new Date(exp.startDate).toISOString().split("T")[0],
            }),
            ...(exp.endDate && !exp.isPresent && {
              endDate: new Date(exp.endDate).toISOString().split("T")[0],
            }),
            ...(exp.responsibilities && { description: exp.responsibilities }),
            member: { "@id": `${siteUrl}/#person` },
            organization: {
              "@type": "Organization",
              name: exp.company,
              ...(exp.location && {
                address: {
                  "@type": "PostalAddress",
                  addressLocality: exp.location,
                },
              }),
            },
          },
        })),
      }
    : null;

  return (
    <>
      {experiencesItemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(experiencesItemListJsonLd) }}
        />
      )}
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Work Experience", href: "/experiences" }]} />
      <ExperienceComponent experiences={experiences} />
    </>
  );
};

export default Experiences;
