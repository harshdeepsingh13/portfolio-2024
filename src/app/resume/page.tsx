import Breadcrumbs from "@/components/Breadcrumbs";
import ResumeComponent from "@/components/ResumeComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume | Harshdeep Singh",
  description: "Download my resume or explore my professional highlights in one place.",
  alternates: {
    canonical: "https://theharshdeepsingh.com/resume",
  },
  openGraph: {
    title: "Resume | Harshdeep Singh",
    description: "Access the downloadable resume and quick career highlights of Harshdeep Singh.",
    url: "https://theharshdeepsingh.com/resume",
    siteName: "Harshdeep Singh",
    locale: "en_US",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume | Harshdeep Singh",
    description: "Download the resume and review the professional highlights of Harshdeep Singh.",
  },
};

const Resume = () => {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Resume", href: "/resume" }]} />
      <ResumeComponent />
    </>
  );
};

export default Resume;
