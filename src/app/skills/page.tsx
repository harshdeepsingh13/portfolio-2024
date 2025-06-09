import SkillsComponent from "@/components/SkillsComponent";
import { getData } from "@/lib/getData";

const Skills = async () => {
  const skillsInformation: any = await getData.getSkills();
  return (
    <>
        <SkillsComponent skills={skillsInformation?.skills} />
    </>
  );
};

export default Skills;
