import styled from "styled-components";
import BootstrapContainer from "react-bootstrap/Container"

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
