"use client";

import { Row } from "@/app/_globalStyles";
import { THEME, useThemeContext } from "@/context/ThemeContext";
import Image from "@/elements/Image";
import { faFacebookF, faGithub, faInstagram, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { sendGAEvent } from "@next/third-parties/google";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Col } from "react-bootstrap";
import {
  DetailsColumn,
  HeroContent,
  HomeWrapper,
  Name,
  ProfessionalSummary,
  ResumeBtn,
  ScanContainer,
  ScanLine,
  SocialMediaContainer,
  SocialMediaItem,
  StatCard,
  StatLabel,
  StatNum,
  StatsGrid,
  StatsPanel,
  StatsPanelLabel,
  TypewriterCursor,
} from "./styles";

const useCountUp = (target: number, duration = 1200, startDelay = 0) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (target === 0) return;
      let current = 0;
      const steps = 30;
      const increment = target / steps;
      const intervalMs = duration / steps;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, intervalMs);
      return () => clearInterval(timer);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [target, duration, startDelay]);
  return count;
};

const AnimatedStatCard = ({
  value,
  suffix,
  label,
  delay,
  href,
  external,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
  href?: string;
  external?: boolean;
}) => {
  const count = useCountUp(value, 1200, delay * 1000);
  const card = (
    <StatCard $delay={delay}>
      <StatNum>
        {count}
        {suffix}
      </StatNum>
      <StatLabel>{label}</StatLabel>
    </StatCard>
  );

  if (external && href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
        {card}
      </a>
    );
  }
  if (href) {
    return (
      <Link href={href} style={{ textDecoration: "none", display: "block" }}>
        {card}
      </Link>
    );
  }
  return card;
};

interface PortfolioStats {
  projectCount: number;
  yearsExperience: number;
  clientsServed: number;
}

interface GitHubStats {
  repos: number;
  commits: number;
  linesOfCode: number;
}

const LandingPage = ({
  basicInformation,
  skills,
  stats,
  githubStats,
}: {
  basicInformation: any;
  skills: any;
  stats: PortfolioStats;
  githubStats: GitHubStats;
}) => {
  const { theme } = useThemeContext();
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    const name: string = basicInformation?.name ?? "";
    let i = 0;
    const id = setInterval(() => {
      setDisplayed(name.slice(0, ++i));
      if (i >= name.length) clearInterval(id);
    }, 80);
    return () => clearInterval(id);
  }, [basicInformation?.name]);

  const accounts = useMemo(() => {
    const accounts = [{ icon: faEnvelope, link: "mailto:harshdeepsingh13@gmail.com", text: "email" }];
    const links = basicInformation?.socialMediaLinks;
    if (links?.facebook) accounts.push({ icon: faFacebookF, link: links.facebook, text: "facebook" });
    if (links?.github) accounts.push({ icon: faGithub, link: links.github, text: "github" });
    if (links?.instagram) accounts.push({ icon: faInstagram, link: links.instagram, text: "instagram" });
    if (links?.linkedin) accounts.push({ icon: faLinkedinIn, link: links.linkedin, text: "linkedin" });
    return accounts;
  }, [basicInformation?.socialMediaLinks]);

  const onToptalLinkClick = () => {
    sendGAEvent("event", "link_toptal");
  };

  const onSocialLinkClick = (text: string) => {
    sendGAEvent("event", "social_link_click", { to: text });
  };

  const githubUrl = basicInformation?.socialMediaLinks?.github ?? "https://github.com/harshdeepsingh13";
  const statItems = [
    { value: stats?.projectCount ?? 0, suffix: "+", label: "Projects", href: "/projects", external: false },
    { value: Math.floor(stats?.yearsExperience ?? 0), suffix: ((stats?.yearsExperience ?? 0) % 1 >= 0.5) ? "+" : "", label: "Yrs Exp", href: "/experiences", external: false },
    { value: githubStats?.linesOfCode ?? 0, suffix: "K+", label: "Lines of Code", href: githubUrl, external: true },
    { value: githubStats?.commits ?? 0, suffix: "+", label: "Commits", href: githubUrl, external: true },
    { value: githubStats?.repos ?? 0, suffix: "+", label: "Repos", href: `${githubUrl}?tab=repositories`, external: true },
    { value: stats?.clientsServed ?? 0, suffix: "+", label: "Clients", href: "/experiences", external: false },
  ];

  return (
    <>
      <HomeWrapper>
        <ScanContainer>
          <ScanLine />
        </ScanContainer>
        <HeroContent>
        <Row>
          <DetailsColumn lg={8}>
            <Name>
              {displayed}
              <TypewriterCursor />
            </Name>
            <ProfessionalSummary>{basicInformation?.objective}</ProfessionalSummary>
            <SocialMediaContainer>
              {accounts?.map(({ icon, link, text }) => (
                <SocialMediaItem
                  href={link}
                  target={"_blank"}
                  rel={"noreferrer noopener"}
                  key={link}
                  onClick={() => onSocialLinkClick(text)}
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
              onClick={onToptalLinkClick}
            >
              Freelancer at
              <Image
                src={theme === THEME.DARK ? "assets/logos/toptal-logo-dark.svg" : "assets/logos/toptal-logo.svg"}
                alt="Toptal Logo"
              />
            </a>
          </DetailsColumn>
          <Col lg={4}>
            <StatsPanel>
              <StatsPanelLabel>At a Glance</StatsPanelLabel>
              <StatsGrid>
                {statItems.map(({ value, suffix, label, href, external }, index) => (
                  <AnimatedStatCard
                    key={label}
                    value={value}
                    suffix={suffix}
                    label={label}
                    delay={0.5 + index * 0.08}
                    href={href}
                    external={external}
                  />
                ))}
              </StatsGrid>
              <ResumeBtn as={Link} href="/resume">View Resume →</ResumeBtn>
            </StatsPanel>
          </Col>
        </Row>
        </HeroContent>
      </HomeWrapper>
    </>
  );
};

export default LandingPage;
