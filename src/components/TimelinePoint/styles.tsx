import {Col} from "react-bootstrap";
import styled from "styled-components";

export const TimelinePointWrapper = styled(Col)`
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--main);
  color: var(--accent-text);
  z-index: 2;
  @media (max-width: 992px) {
    display: none;
  }
`;
