import styled from "styled-components";
import {Container as BootstrapContainer, Row as BootstrapRow} from "react-bootstrap"

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
