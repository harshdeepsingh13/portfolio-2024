"use client";

import { Container, CustomTab, CustomTabs, PageLead } from "@/app/_globalStyles";
import { useMemo, useState } from "react";
import { PageHeader } from "../../app/_globalStyles";
import TimelinePoint from "../TimelinePoint";
import ExperienceCard from "./ExperienceCard";
import { ExperienceItem, ExperienceRow, ExperiencesWrapper, TimelineDivider } from "./styles";

const TAB = {
  PROFESSIONAL_EXPERIENCE: { KEY: "PROFESSIONAL_EXPERIENCE", TEXT: "Professional Experience" },
  FREELANCE_EXPERIENCE: { KEY: "FREELANCE_EXPERIENCE", TEXT: "Freelance Experience" },
};

const ExperienceComponent = ({ experiences: experiencesProps }: { experiences: any }) => {
  const [activeTab, setActiveTab] = useState(TAB.PROFESSIONAL_EXPERIENCE.KEY);

  const experiences = useMemo(() => {
    switch (activeTab) {
      case TAB.PROFESSIONAL_EXPERIENCE.KEY:
        return experiencesProps?.filter((experience: any) => !experience.isFreelanceExperience);
      case TAB.FREELANCE_EXPERIENCE.KEY:
        return experiencesProps?.filter((experience: any) => experience.isFreelanceExperience);
    }
  }, [experiencesProps, activeTab]);

  return (
    <>
      <Container>
        <PageHeader>Professional Experiences</PageHeader>
        <PageLead>
          A timeline of full-stack, SaaS, eCommerce, consulting, and support roles that shaped my ability to ship
          production software, improve performance, and work across teams.
        </PageLead>
        <CustomTabs value={activeTab} onChange={(_: any, v: string) => setActiveTab(v)}>
          <CustomTab value={TAB.PROFESSIONAL_EXPERIENCE.KEY} label={TAB.PROFESSIONAL_EXPERIENCE.TEXT} />
          <CustomTab value={TAB.FREELANCE_EXPERIENCE.KEY} label={TAB.FREELANCE_EXPERIENCE.TEXT} />
        </CustomTabs>
        <ExperiencesWrapper>
          <TimelineDivider />
          {experiences?.map((experience: any, index: number) => (
            <ExperienceRow className={"gx-2"} key={experience._id}>
              {index % 2 === 0 ? (
                <ExperienceCard key={experience._id} experience={experience} delay={0.15 + index * 0.1} />
              ) : (
                <ExperienceItem className={"hidden"} key={`hidden-${experience._id}`} />
              )}
              <TimelinePoint />
              {index % 2 !== 0 ? (
                <ExperienceCard key={experience._id} experience={experience} delay={0.15 + index * 0.1} />
              ) : (
                <ExperienceItem className={"hidden"} key={`hidden2-${experience._id}`} />
              )}
            </ExperienceRow>
          ))}
        </ExperiencesWrapper>
      </Container>
    </>
  );
};

export default ExperienceComponent;
