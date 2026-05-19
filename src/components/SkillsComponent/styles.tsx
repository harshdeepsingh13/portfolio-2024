"use client";

import { Row } from "@/app/_globalStyles";
import styled from "styled-components";
import Card from "../Card";

export const SkillsRow = styled(Row)`
  margin-top: 2.5rem;
  /*gap: 0.5rem;

  @media (min-width: 1024px) {
    gap: 1.25rem;
  }

  @media (min-width: 768px) {
    gap: 0.75rem;
  }*/
`;

export const SkillItem = styled(Card)<{ $delay?: number }>`
  animation: fadeIn 0.5s ease both;
  animation-delay: ${(props) => props.$delay ?? 0}s;
`;
// export const SkillItem = styled.div``;
