import { LandingPage } from "@/components";
import { getData } from "@/lib/getData";
import { sendGAEvent } from "@next/third-parties/google";

export default async function Home() {
  const skills: any = await getData.getSkills();
  const basicInformation = await getData.getBasicInformation();

  return <LandingPage basicInformation={basicInformation} skills={skills?.skills} />;
}
