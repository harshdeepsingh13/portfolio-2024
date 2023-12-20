import styled from "styled-components";
import {Container} from "../../GlobalStyles";
import {Col} from "react-bootstrap";


export const HomeWrapper = styled(Container)`
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

`
export const Name = styled.h2`
  font-size: 2.5em;
  margin: unset;
  letter-spacing: 4px;
  font-weight: 900;
  color: var(--secondary-text);


  @media (min-width: 640px) {
    font-size: 3em;
  }

  @media (min-width: 768px) {
    font-size: 3.5em;
    text-align: left;
  }

  @media (min-width: 1024px) {
    font-size: 4em;
  }


`;

export const ProfessionalSummary = styled.div`
  color: var(--tertiary-text);
  font-weight: 300;
  font-size: 0.8em;
  padding: 10px 0;

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

export const DetailsColumn = styled(Col)`
  text-align: center;

  @media (min-width: 768px) {
    text-align: left;
  }
`
