import ResumeComponent from "@/components/ResumeComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume | Harshdeep Singh",
  description: "Download my resume or explore my professional highlights in one place.",
  openGraph: {
    title: "Resume | Harshdeep Singh",
    description: "Access the downloadable resume and quick career highlights of Harshdeep Singh.",
    url: "https://theharshdeepsingh.com/resume",
    siteName: "Harshdeep Singh",
    locale: "en_US",
    type: "profile",
  },
};

const Resume = () => {
  return (
    <>
      <ResumeComponent />
    </>
  );
};

export default Resume;
