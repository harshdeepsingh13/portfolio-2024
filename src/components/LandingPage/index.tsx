"use client";

import { Row } from "@/app/_globalStyles";
import Image from "@/elements/Image";
import { faFacebookF, faGithub, faInstagram, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";
import { Col } from "react-bootstrap";
import SkillsCarousel from "../SkillsCarousel";
import { DetailsColumn, HomeWrapper, Name, ProfessionalSummary, SocialMediaContainer, SocialMediaItem } from "./styles";

const LandingPage = ({ basicInformation, skills }: { basicInformation: any; skills: any }) => {
  const accounts = useMemo(() => {
    let accounts = [{ icon: faEnvelope, link: "mailto:harshdeepsingh13@gmail.com", text: "email" }];
    accounts.push({ icon: faFacebookF, link: basicInformation?.socialMediaLinks?.facebook, text: "facebook" });
    accounts.push({ icon: faGithub, link: basicInformation?.socialMediaLinks?.github, text: "github" });
    accounts.push({ icon: faInstagram, link: basicInformation?.socialMediaLinks?.instagram, text: "instagram" });
    accounts.push({ icon: faLinkedinIn, link: basicInformation?.socialMediaLinks?.linkedin, text: "linkedin" });
    return accounts;
  }, [basicInformation?.socialMediaLinks]);

  return (
    <>
      <HomeWrapper>
        <Row>
          <DetailsColumn lg={8}>
            <Name>{basicInformation?.name}</Name>
            <ProfessionalSummary>{basicInformation?.objective}</ProfessionalSummary>
            <SocialMediaContainer>
              {accounts?.map(({ icon, link, text }) => (
                <SocialMediaItem
                  href={link}
                  target={"_blank"}
                  rel={"noreferrer noopener"}
                  key={link}
                  // onClick={() => onSocialLinkClick(text)}
                >
                  <FontAwesomeIcon icon={icon} />
                </SocialMediaItem>
              ))}
            </SocialMediaContainer>
            <a
              className="freelancer-at-toptal"
              target={"_blank"}
              href={"https://www.toptal.com/resume/harshdeep-singh"}
              rel={"noreferrer noopener"}
              // onClick={onToptalLinkClick}
            >
              Freelancer at
              <Image
                // src={theme === THEME.DARK ? "assets/logos/toptal-logo-dark.svg" : "assets/logos/toptal-logo.svg"}
                src={"assets/logos/toptal-logo.svg"}
                alt="Toptal Logo"
              />
            </a>
          </DetailsColumn>
          <Col lg={4}>
            <SkillsCarousel skills={skills} />
          </Col>
        </Row>
      </HomeWrapper>
    </>
  );
};

export default LandingPage;
