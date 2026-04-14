"use client";

import { PageLead } from "@/app/_globalStyles";
import { SkillName, SKILLS_ASSETS_MAPPING } from "@/config/config";
import { useCallback } from "react";
import { Container, PageHeader } from "../../app/_globalStyles";
import { SkillItem, SkillsRow } from "./styles";

const SkillsComponent = ({ skills }: { skills: string[] }) => {
  const getBackgroundLogo = useCallback((skill: SkillName) => {
    return SKILLS_ASSETS_MAPPING[skill] ?? "assets/logos/code-default.svg";
  }, []);

  return (
    <>
      <Container>
        <PageHeader>Skills</PageHeader>
        <PageLead>
          A focused collection of the technologies, frameworks, and delivery tools I use to build production web
          applications, automate workflows, and ship reliable digital products.
        </PageLead>
        <SkillsRow sm={1} md={2} lg={3} className={"g-3"}>
          {skills?.map((skill) => (
            <SkillItem key={skill} sm background={getBackgroundLogo(skill as SkillName)}>
              {skill}
            </SkillItem>
          ))}
        </SkillsRow>
      </Container>
    </>
  );
};

export default SkillsComponent;
