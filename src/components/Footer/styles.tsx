"use client";

import styled, { keyframes } from "styled-components";

const heartbeat = keyframes`
  0%,100% { transform: scale(1); }
  14%      { transform: scale(1.3); }
  28%      { transform: scale(1); }
  42%      { transform: scale(1.2); }
  70%      { transform: scale(1); }
`;

export const FooterWrapper = styled.footer`
  text-align: center;
  padding: 1.5rem;
  font-size: 0.8em;
  font-weight: 300;
  color: var(--tertiary-text);
  border-top: 1px solid var(--border);
  letter-spacing: 1px;
`;

export const HeartIcon = styled.span`
  color: #e11d48;
  display: inline-block;
  animation: ${heartbeat} 1.6s ease-in-out infinite;
`;
