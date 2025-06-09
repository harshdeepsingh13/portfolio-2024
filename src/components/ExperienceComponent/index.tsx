"use client";

import { Container, CustomTab, CustomTabs } from "@/app/_globalStyles";
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
        <PageHeader>Experiences</PageHeader>
        <CustomTabs
          variant={"pills"}
          activeKey={activeTab}
          onSelect={(key: any) => setActiveTab(key)}
          mountOnEnter
          unmountOnExit
        >
          <CustomTab eventKey={TAB.PROFESSIONAL_EXPERIENCE.KEY} title={TAB.PROFESSIONAL_EXPERIENCE.TEXT}>
            <ExperiencesWrapper>
              <TimelineDivider />
              {experiences?.map((experience: any, index: number) => (
                <>
                  <ExperienceRow className={"gx-2"} key={experience._id}>
                    {index % 2 === 0 ? (
                      <ExperienceCard key={experience._id} experience={experience} />
                    ) : (
                      <ExperienceItem lg={6} className={"hidden"} key={`hidden-${experience._id}`} />
                    )}
                    <TimelinePoint />
                    {index % 2 !== 0 ? (
                      <ExperienceCard key={experience._id} experience={experience} />
                    ) : (
                      <ExperienceItem lg={6} className={"hidden"} key={`hidden-${experience._id}`} />
                    )}
                  </ExperienceRow>
                </>
              ))}
            </ExperiencesWrapper>
          </CustomTab>
          <CustomTab eventKey={TAB.FREELANCE_EXPERIENCE.KEY} title={TAB.FREELANCE_EXPERIENCE.TEXT}>
            <ExperiencesWrapper>
              <TimelineDivider />
              {experiences?.map((experience: any, index: number) => (
                <>
                  <ExperienceRow className={"gx-2"} key={experience._id}>
                    {index % 2 === 0 ? (
                      <ExperienceCard key={experience._id} experience={experience} />
                    ) : (
                      <ExperienceItem lg={6} className={"hidden"} key={`hidden-${experience._id}`} />
                    )}
                    <TimelinePoint />
                    {index % 2 !== 0 ? (
                      <ExperienceCard key={experience._id} experience={experience} />
                    ) : (
                      <ExperienceItem lg={6} className={"hidden"} key={`hidden-${experience._id}`} />
                    )}
                  </ExperienceRow>
                </>
              ))}
            </ExperiencesWrapper>
          </CustomTab>
        </CustomTabs>
      </Container>
    </>
  );
};

export default ExperienceComponent;
