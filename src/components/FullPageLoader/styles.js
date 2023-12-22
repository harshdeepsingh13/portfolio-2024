import styled from "styled-components";

export const FullPageLoaderWrapper = styled.div`
  z-index: 9999;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--main-60);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

export const LoaderMessage = styled.div`
  margin: 10px 0;
`;
