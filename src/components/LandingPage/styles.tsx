import { Container, PageHeader } from "@/app/_globalStyles";
import { Col } from "react-bootstrap";
import styled, { keyframes } from "styled-components";

const scanAnim = keyframes`
  from { top: 0%; }
  to   { top: 100%; }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

export const HomeWrapper = styled(Container)`
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  isolation: isolate;
`;

export const ScanContainer = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
`;

export const ScanLine = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--scan-line-bg, linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.28), transparent));
  animation: ${scanAnim} 8s linear infinite;
  transition: none;
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
`;
export const Name = styled(PageHeader)`
  @media (min-width: 768px) {
    font-size: 3.5em;
    text-align: left;
  }
`;

export const ProfessionalSummary = styled.div`
  color: var(--tertiary-text);
  font-weight: 300;
  font-size: 0.8em;
  padding: 10px 0;
  animation: fadeSlideUp 0.6s 0.3s ease both;

  @media (min-width: 768px) {
    font-size: 1em;
  }
`;

export const SocialMediaContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 10px 0;
  color: var(--accent-text);
  align-items: center;
  justify-content: center;
  animation: fadeSlideUp 0.6s 0.5s ease both;

  @media (min-width: 768px) {
    justify-content: flex-start;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;

export const SocialMediaItem = styled.a`
  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    color: var(--accent-text-hover);
  }
`;

export const TypewriterCursor = styled.span`
  display: inline-block;
  width: 3px;
  height: 0.85em;
  background: var(--accent-cyan);
  margin-left: 4px;
  vertical-align: middle;
  animation: ${blink} 1s step-end infinite;
`;

export const StatsPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  justify-content: center;
  padding: 1rem 0;
  animation: fadeSlideUp 0.6s 0.4s ease both;
`;

export const StatsPanelLabel = styled.div`
  font-size: 0.7em;
  font-weight: 500;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--accent-cyan);
  opacity: 0.7;
  margin-bottom: 4px;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

export const StatCard = styled.div<{ $delay?: number }>`
  background: var(--accent-cyan-glow);
  animation: fadeIn 0.5s ease both;
  animation-delay: ${(props) => props.$delay ?? 0}s;
  border: 1px solid var(--accent-cyan-border);
  border-radius: 12px;
  padding: 16px 12px;
  text-align: center;
  transition: border-color 300ms, box-shadow 300ms, transform 250ms ease;
  cursor: pointer;

  &:hover {
    border-color: var(--accent-cyan-20);
    box-shadow: 0 0 24px var(--accent-cyan-10), 0 4px 16px rgba(0, 0, 0, 0.2);
    transform: translateY(-4px) scale(1.03);
  }
`;

export const StatNum = styled.div`
  font-family: 'Outfit', sans-serif;
  font-size: 2em;
  font-weight: 900;
  color: var(--accent-cyan);
  line-height: 1;
`;

export const StatLabel = styled.div`
  font-size: 0.65em;
  font-weight: 300;
  color: var(--tertiary-text);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-top: 4px;
`;

export const ResumeBtn = styled.a`
  display: block;
  text-align: center;
  padding: 10px;
  border: 1px solid var(--accent-cyan-border);
  border-radius: 10px;
  color: var(--accent-cyan);
  font-weight: 600;
  font-size: 0.8em;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-decoration: none;
  background: var(--accent-cyan-glow);
  transition: background 300ms, border-color 300ms, box-shadow 300ms, transform 250ms ease;

  &:hover {
    border-color: var(--accent-cyan-20);
    box-shadow: 0 0 24px var(--accent-cyan-10), 0 4px 16px rgba(0, 0, 0, 0.2);
    color: var(--accent-cyan);
    transform: translateY(-4px) scale(1.03);
  }
`;

export const DetailsColumn = styled(Col)`
  text-align: center;

  .freelancer-at-toptal {
    color: var(--tertiary-text);
    margin: 1.5em 0;
    text-decoration: none;
    display: inline-block;

    &:hover {
      transform: scale(1.01);
      color: var(--tertiary-text-hover);
    }

    img {
      width: 150px;
    }
  }

  @media (min-width: 768px) {
    text-align: left;
  }
`;
