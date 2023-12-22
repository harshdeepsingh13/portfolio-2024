import styled from "styled-components";

const ANIMATION_DURATION = "2s"
export const LoaderWrapper = styled.div`
  position: relative;
  z-index: 2;
  height: ${props => props.size * 2.75}px;
  width: ${props => props.size * 2.75}px;
  display: grid;
  place-items: center;

  .cube-wrapper {
    transform-style: preserve-3d;
    animation: bouncing ${ANIMATION_DURATION} infinite;

  }

  .cube {
    transform-style: preserve-3d;
    transform: rotateX(45deg) rotateZ(45deg);
    animation: rotation ${ANIMATION_DURATION} infinite;

  }

  .cube-faces {
    transform-style: preserve-3d;
    height: ${props => props.size}px;
    width: ${props => props.size}px;
    position: relative;
    transform-origin: 0 0;
    transform: translateX(0) translateY(0) translateZ(-${props => props.size / 2}px);
  }

  .cube-face {
    position: absolute;
    inset: 0;
    background: var(--accent-text);
    border: solid 1px var(--border);

    &.shadow {
      transform: translateZ(-${props => props.size}px);
      animation: bouncing-shadow ${ANIMATION_DURATION} infinite;
    }

    &.top {
      transform: translateZ(${props => props.size}px);
    }

    &.front {
      transform-origin: 0 50%;
      transform: rotateY(-90deg);
    }

    &.back {
      transform-origin: 0 50%;
      transform: rotateY(-90deg) translateZ(-${props => props.size}px);
    }

    &.right {
      transform-origin: 50% 0;
      transform: rotateX(-90deg) translateY(-${props => props.size}px);
    }

    &.left {
      transform-origin: 50% 0;
      transform: rotateX(-90deg) translateY(-${props => props.size}px) translateZ(${props => props.size}px);
    }
  }

  @keyframes rotation {

    0% {
      transform: rotateX(45deg) rotateY(0) rotateZ(45deg);
      animation-timing-function: cubic-bezier(0.17, 0.84, 0.44, 1);
    }
    50% {
      transform: rotateX(45deg) rotateY(0) rotateZ(${45 + 360 / 2}deg);
      animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
    }
    100% {
      transform: rotateX(45deg) rotateY(0) rotateZ(${45 + 360}deg);
      animation-timing-function: cubic-bezier(0.17, 0.84, 0.44, 1);
    }
  }

  @keyframes bouncing {
    0% {
      transform: translateY(-${props => props.size * 0.5}px);
      animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
    }

    45% {
      transform: translateY(${props => props.size * 0.5}px);
      animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
    }

    100% {
      transform: translateY(-${props => props.size * 0.5}px);
      animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
    }
  }

  @keyframes bouncing-shadow {
    0% {
      transform: translateZ(-${props => props.size}px) scale(1.3);
      animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
      opacity: .05;
    }

    45% {
      transform: translateZ(0);
      animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
      opacity: .3;
    }

    100% {
      transform: translateZ(-${props => props.size}px) scale(1.3);
      animation-timing-function: cubic-bezier(0.76, 0.05, 0.86, 0.06);
      opacity: .05;
    }
  }


`;
