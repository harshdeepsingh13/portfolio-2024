import styled from "styled-components";

export const SkillsCarouselWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-text);
  user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-user-select: none;

  .skills-container {
    overflow: hidden;
    display: flex;
    align-items: center;
    width: 150px;

  }

`;
export const SkillItem = styled.div`
  text-align: center;
  padding: 15px;
  width: 150px;

  .logo {
    width: 120px;
    height: 120px;
    aspect-ratio: 1/1;
    fill: red;
    svg {
      fill: red;
    }
  }

  .text {
    margin-top: 20px;
    width: 100%;
  }
`;


export const CarouselButton = styled.div`
  border: thin solid var(--border);
  border-radius: 50%;
  background-color: transparent;
  padding: 5px;
  font-weight: 500;
  margin: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    width: 0.7em;
    height: 0.7em;
  }

  &:hover {
    border-color: var(--border-hover);
  }
`;
