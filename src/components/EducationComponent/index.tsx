"use client";

import { Container, PageHeader } from "@/app/_globalStyles";
import { ExperienceRow, TimelineDivider } from "../ExperienceComponent/styles";
import TimelinePoint from "../TimelinePoint";
import EducationCard from "./EducationCard";
import { EducationItem, EducationWrapper } from "./styles";

const EducationComponent = ({ educationDetails }: { educationDetails: any }) => {
  return (
    <>
      <Container>
        <PageHeader>Education</PageHeader>
        <EducationWrapper>
          <TimelineDivider />
          {educationDetails?.map((education: any, index: number) => (
            <>
              <ExperienceRow className={"gx-2"}>
                {index % 2 === 0 ? (
                  <EducationCard key={education._id} education={education} />
                ) : (
                  <EducationItem lg={6} className={"hidden"} key={`hidden-${education._id}`} />
                )}
                <TimelinePoint />
                {index % 2 !== 0 ? (
                  <EducationCard key={education._id} education={education} />
                ) : (
                  <EducationItem lg={6} className={"hidden"} key={`hidden-${education._id}`} />
                )}
              </ExperienceRow>
            </>
          ))}
        </EducationWrapper>
      </Container>
    </>
  );
};

export default EducationComponent;
