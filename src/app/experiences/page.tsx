import ExperienceComponent from "@/components/ExperienceComponent";
import { getData } from "@/lib/getData";

const Experiences = async () => {
  const experiences = await getData.getWorkExperiences();

  return (
    <>
      <ExperienceComponent experiences={experiences} />
    </>
  );
};

export default Experiences;
