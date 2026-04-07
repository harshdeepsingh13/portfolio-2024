import { LandingPage } from "@/components";
import { getData } from "@/lib/getData";

// Render at request time so home page reflects latest DB updates without rebuild.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const skills: any = await getData.getSkills();
  const basicInformation = await getData.getBasicInformation();

  return <LandingPage basicInformation={basicInformation} skills={skills?.skills} />;
}
