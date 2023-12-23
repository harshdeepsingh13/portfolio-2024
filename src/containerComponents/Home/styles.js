import styled from "styled-components";
import {Container, PageHeader} from "../../GlobalStyles";
import {Col} from "react-bootstrap";


export const HomeWrapper = styled(Container)`
  flex: 1 1 0%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

`
export const Name = styled(PageHeader)`
  @media (min-width: 768px) {
    font-size: 3.5em;
    text-align: left;
  }
`

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

  .freelancer-at-toptal {
    color: var(--tertiary-text);
    margin: 1.5em 0;
    text-decoration: none;
    display: inline-block;

    &:hover{
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
`
