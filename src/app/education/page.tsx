import EducationComponent from "@/components/EducationComponent";
import { getData } from "@/lib/getData";

const Education = async () => {
  const educationInformation = await getData.getEducationInformation();
  return <><EducationComponent educationDetails={educationInformation} /></>;
};

export default Education;
