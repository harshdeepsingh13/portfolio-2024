"use client";

import { Container } from "@/app/_globalStyles";
import Link from "next/link";
import styled from "styled-components";

export const HeaderWrapper = styled.div`
  color: var(--secondary-text);
  border-bottom: thin solid var(--secondary);
  background-color: var(--main);
  z-index: 999;
  top: 0;
  position: sticky;
  font-size: 0.875rem;

  a {
    text-decoration: none;
    color: var(--secondary-text);
  }

  .action-item {
    display: block;
    cursor: pointer;

    svg {
      color: var(--accent-text);
    }

    &:hover {
      background-color: var(--main-hover);
    }
  }
`;

export const HeaderContainer = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: unset;
  padding-bottom: unset;

  .left {
    align-self: stretch;
    display: flex;
    align-items: stretch;
  }

  .center {
  }

  .right {
    gap: 0.25rem;
    display: flex;
    align-items: stretch;
    align-self: stretch;
  }
`

export const LogoContainer = styled(Link)`
  padding-left: 1rem;
  padding-right: 1rem;
  display: flex !important;
  align-items: center;

  h1 {
    margin: unset;
    font-size: initial;
  }

  @media (max-width: 950px) {
    svg {
      margin-right: unset !important;
    }

    .text {
      display: none;
    }
  }

`
export const NavLinkItem = styled(Link)`
  padding: 10px 20px;

  svg {
    margin-right: 10px;
  }

  @media (max-width: 950px) {
    padding: 10px 15px;
    svg {
      margin-right: unset;
    }

    .text {
      display: none;
    }
  }
`
export const NavLinksContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 1 0;
  align-self: center;

`;

export const SearchLink = styled(Link)`
  display: flex !important;
  align-items: center;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
`;

export const ThemeButton = styled.div`
  display: flex !important;
  align-items: center;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
`;
