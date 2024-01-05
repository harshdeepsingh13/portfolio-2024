import styled from "styled-components";
import {CardTitle, Row} from "../../GlobalStyles";
import Card from "../../components/Card";

export const ExperiencesWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  padding: 2em 0;
  margin-top: 2rem;
  gap: 1.2em;

  @media (max-width: 992px){
    margin-top: 1em;
    padding-top: unset;
  }
`;

export const TimelineDivider = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 0.5px;
  border: thin solid var(--border);

  @media (max-width: 992px) {
    display: none;
  }
`;

export const ExperienceRow = styled(Row)`
  justify-content: space-between;
  align-items: center;
`;

export const ExperienceItem = styled(Card)`
  width: calc(50% - 32px) !important;
  margin: unset;
  //width: calc(100% - var(--bs-gutter-x) * 2) !important;

  @media (max-width: 992px) {
    &.hidden{
      display: none;}
    width: 100% !important;
  }

  /*@media (min-width: 576px) {
    width: calc(50% - 32px); !important;
  }

  @media (min-width: 768px) {
    width: calc(50% - 32px); !important;
  }

  @media (min-width: 992px) {
    width: calc(50% - 32px); !important;
  }*/
`;

export const Position = styled(CardTitle)`
  font-size: 1.2em;
  font-weight: 500;
  margin: 10px 0;
`;

export const SecondaryInformation = styled.h5`
  margin: 10px 0;
  font-size: 0.9em;
  font-weight: 400;
  color: var(--tertiary-text);
  display: flex;

  svg {
    margin-right: 1em;
  }
`;

export const Responsibilities = styled.div`
  margin: 15px 0;
  font-size: 0.9em;
  font-weight: 400;
  color: var(--tertiary-text);

  ul {
    padding-left: 1rem;

    li {
      margin-bottom: 5px;
    }
  }
`;
