"use client";

import { PageLead } from "@/app/_globalStyles";
import { cloudinaryResLink } from "@/config/config";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sendGAEvent } from "@next/third-parties/google";
import { Container, PageHeader } from "../../app/_globalStyles";
import { DownloadButton } from "./styles";

const ResumeComponent = () => {
  const onResumeDownload = () => {
    let a = document.createElement("a");
    a.target = "_blank";
    a.href = `${cloudinaryResLink}Resume%20-%20Harshdeep%20Singh.pdf`;
    console.log(a.href);
    a.click();
    sendGAEvent("event", "download_resume");
  };
  return (
    <>
      <Container>
        <PageHeader>Download Resume</PageHeader>
        <PageLead>
          Download a concise summary of my experience, skills, and project work if you want a quick overview of my
          background as a full stack developer.
        </PageLead>
        <DownloadButton onClick={onResumeDownload}>
          <FontAwesomeIcon icon={faDownload} /> Download Resume
        </DownloadButton>
      </Container>
    </>
  );
};

export default ResumeComponent;
