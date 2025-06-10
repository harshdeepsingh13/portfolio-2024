import EducationComponent from "@/components/EducationComponent";
import { getData } from "@/lib/getData";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Education | Harshdeep Singh",
  description: "Details about my academic background, including degrees and certifications in Data Analytics and Computer Science.",
  openGraph: {
    title: "Education | Harshdeep Singh",
    description: "Academic qualifications and ongoing learning journey of Harshdeep Singh.",
    url: "https://theharshdeepsingh.com/education",
    siteName: "Harshdeep Singh",
    locale: "en_US",
    type: "profile",
  },
};

const Education = async () => {
  const educationInformation = await getData.getEducationInformation();
  return <><EducationComponent educationDetails={educationInformation} /></>;
};

export default Education;
