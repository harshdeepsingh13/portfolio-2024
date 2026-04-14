import { Container as BootstrapContainer, Row as BootstrapRow, Tab, Tabs } from "react-bootstrap";
import styled from "styled-components";

export const Container = styled(BootstrapContainer)`
  max-width: 1200px;
  min-width: 1200px;
  margin: 0px auto;
  padding: 3rem 15px;
  width: 100%;

  @media (max-width: 1350px) {
    & {
      max-width: 1000px;
      min-width: 1000px;
    }
  }

  @media (max-width: 1075px) {
    & {
      max-width: -webkit-fill-available;
      min-width: -webkit-fill-available;
      max-width: -moz-available;
      min-width: -moz-available;
    }
  }
`

export const Row = styled(BootstrapRow)`
  width: 100%;
`;

export const PageHeader = styled.h2`
  font-size: 2.5em;
  margin: unset;
  letter-spacing: 4px;
  font-weight: 900;
  color: var(--secondary-text);
  text-align: center;


  @media (min-width: 640px) {
    font-size: 3em;
  }

  @media (min-width: 768px) {
    font-size: 3.5em;
  }

  @media (min-width: 1024px) {
    font-size: 4em;
  }

`;

export const PageLead = styled.p`
  margin: 1rem auto;
  max-width: 760px;
  text-align: center;
  color: var(--tertiary-text);
  font-weight: 300;
  line-height: 1.8;
  letter-spacing: 0.2px;

  @media (min-width: 768px) {
    text-align: center;
    /* margin-left: 0; */
    /* margin-right: 0; */
  }
`;

export const BreadcrumbsNav = styled.nav`
  margin-bottom: 1rem;
  color: var(--tertiary-text);
  font-size: 0.85rem;
`;

export const BreadcrumbsList = styled.ol`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const BreadcrumbItem = styled.li`
  display: flex;
  align-items: center;

  &:not(:last-child)::after {
    content: "/";
    margin-left: 0.35rem;
    color: var(--accent-text);
  }
`;

export const BreadcrumbLink = styled.a`
  color: inherit;
  text-decoration: none;

  &:hover {
    color: var(--main-text-hover);
    text-decoration: underline;
  }
`;

export const CardTitle = styled.h4`
  margin: 5px 0;
  font-size: 1.01em;
`;

export const CustomTabs = styled(Tabs)`
  /*justify-content: center;
  border-color: var(--border);
  --bs-nav-tabs-border-color: var(--border);
  margin: 1em 0;

  .nav-link{
    border-bottom: unset;
    background-color: unset;
    color: var(--accent-text);

    &.active{
      background-color: var(--main);
      border-color: var(--border);
      color: var(--main-text);
    }
    &:hover{
      border-color: var(--border);
      --bs-nav-tabs-link-hover-border-color: var(--border);
    }
  }*/

  margin: 2em 0 1em 0;
  justify-content: center;

  .nav-link{
    color: var(--accent-text);

    &.active{
      background-color: var(--accent-text);
    }

    @media (max-width: 460px) {
      font-size: 0.8em;
    }

  }

`;

export const CustomTab = styled(Tab)``;
