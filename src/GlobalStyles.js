import styled from "styled-components";
import {Container as BootstrapContainer, Row as BootstrapRow, Tabs, Tab} from "react-bootstrap"

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
