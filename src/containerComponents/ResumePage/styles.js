import styled from "styled-components";
import {Button} from "react-bootstrap";

export const DownloadButton = styled(Button)`
  text-align: center;
  margin: 3.5em auto;
  display: block;
  width: 300px;
  border-radius: unset;
  padding: 10px;
  background-color: var(--main-text);
  color: var(--main);

  &:hover, &:active{
    background-color: var(--main-text-hover) !important;
    color: var(--main-hover) !important;
  }

  svg{
    margin-right: 1em;
  }

`;
