import { keyframes } from "@emotion/react";

export const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

export const scanAnim = keyframes`
  from { top: 0%; }
  to   { top: 100%; }
`;

export const blink = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
`;

export const heartbeat = keyframes`
  0%, 100% { transform: scale(1); }
  14%       { transform: scale(1.3); }
  28%       { transform: scale(1); }
  42%       { transform: scale(1.3); }
  70%       { transform: scale(1); }
`;
