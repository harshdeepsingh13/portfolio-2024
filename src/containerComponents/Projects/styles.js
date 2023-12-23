import styled from "styled-components";
import {Row} from "../../GlobalStyles";
import Card from "../../components/Card";
import {CardTag} from "../../components/Card/styles";

export const ProjectsWrapper = styled.div``;

export const ProjectsRow = styled(Row)`
  margin-top: 1.25rem;
`;

export const ProjectItem = styled(Card)`

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .name-container {
    display: flex;
    align-items: stretch;
    justify-content: space-between;
    gap: 1em;
    margin: 10px 0;
    border-bottom: thin solid var(--border);
    padding: 10px 0;
    font-weight: 400;
  }

  .tag-line-container {
    color: var(--tertiary-text);
    font-style: italic;
    font-weight: 300;
    margin: 10px 0;
  }

  .technology-stack-container {
    color: var(--tertiary-text);
    font-size: 0.8em;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 1em;
    margin-top: 15px;
    border-top: thin solid var(--border);
    padding-top: 10px;
    font-weight: 400;
    justify-self: flex-end;
  }

  .summary-container {
    font-size: 0.9em;
    color: var(--secondary-text);
    font-weight: 300;
    margin: 1.5em 0 1.8em 0;
  }
`;

export const ProjectLogo = styled.img`
  aspect-ratio: 1/1;
  width: 60px;
  display: block;
`;


export const TechItem = styled(CardTag)``;
