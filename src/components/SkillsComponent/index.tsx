"use client";

import { PageLead } from "@/app/_globalStyles";
import { SkillName, SKILLS_ASSETS_MAPPING } from "@/config/config";
import Grid2 from "@mui/material/Grid";
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
        <SkillsRow spacing={2}>
          {skills?.map((skill, index) => (
            <Grid2 key={skill} size={{ xs: 12, sm: 6, md: 4 }}>
              <SkillItem background={getBackgroundLogo(skill as SkillName)} delay={0.15 + index * 0.06}>
                {skill}
              </SkillItem>
            </Grid2>
          ))}
        </SkillsRow>
      </Container>
    </>
  );
};

export default SkillsComponent;
