import styled from "styled-components";
import {Col} from "react-bootstrap";
import {Row} from "../../GlobalStyles";

export const SkillsWrapper = styled.div`

`

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

export const SkillItem = styled(Col)`
  padding: 25px;
  border: thin solid var(--border);
  border-radius: 20px;
  color: var(--tertiary-text);
  margin-left: calc(var(--bs-gutter-x));
  margin-right: calc(var(--bs-gutter-x));
  width: calc(100% - var(--bs-gutter-x) * 2) !important;
  background: linear-gradient(90deg, var(--main) 0%, var(--main) 60%, var(--main-60) 100%), no-repeat right 40%/40% url(${props => props.background});

  @media (min-width: 576px) {
    width: calc(100% - var(--bs-gutter-x) * 2) !important;
  }

  @media (min-width: 768px) {
    width: calc(50% - var(--bs-gutter-x) * 2) !important;
  }

  @media (min-width: 992px) {
    width: calc(33.3333% - var(--bs-gutter-x) * 2) !important;
  }


  &:hover {
    border-color: var(--border-hover);
    transform: scale(1.01);
  }


`;
