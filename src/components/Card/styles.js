import {Col} from "react-bootstrap";
import styled from "styled-components";

export const CardWrapper = styled(Col)`
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
        transform: perspective(1000px) rotateX(var(--rot-x)) rotateY(var(--rot-y)) scale(1.01);
        ${props => props.accentColor && `background-image: radial-gradient(circle at var(--drop-x) var(--drop-y),
    ${props.accentColor}, transparent);`};
            /*background-image: radial-gradient(circle at var(--drop-x) var(--drop-y),
    ${props => props.accentColor},
    transparent);*/
    }
`;

export const CardLinksContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const CardLink = styled.a`
  color: var(--tertiary-text);
  padding: 5px;
  border: thin solid var(--border);
  background-color: var(--main-60);
  border-radius: 10px;

  &:hover {
    border-color: var(--border-hover);
  }

`;

export const CardTag = styled.div`
  color: var(--tertiary-text);
  padding: 5px;
  border: thin solid var(--border);
  background-color: var(--main-60);
  border-radius: 10px;

  &:hover {
    border-color: var(--border-hover);
  }
`;
