"use client";
import { keyframes } from "@emotion/react";
import { styled } from "@mui/material/styles";

const floatParticle = keyframes`
  0%, 100% { transform: translateY(0) translateX(0); opacity: 0.25; }
  33%       { transform: translateY(-15px) translateX(8px); opacity: 0.8; }
  66%       { transform: translateY(8px) translateX(-5px); opacity: 0.5; }
`;

const orbPulse = keyframes`
  0%, 100% { transform: translate(-50%, -50%) scale(1);   opacity: 0.8; }
  50%      { transform: translate(-50%, -50%) scale(1.4); opacity: 1; }
`;

const Wrapper = styled("div")(() => ({
  position: "fixed",
  inset: 0,
  pointerEvents: "none",
  zIndex: 0,
  overflow: "hidden",
}));

const Particle = styled("div", {
  shouldForwardProp: (prop) =>
    !["size", "top", "left", "duration", "delay"].includes(prop as string),
})<{
  size: number;
  top: string;
  left: string;
  duration: string;
  delay: string;
}>(({ theme, size, top, left, duration, delay }) => ({
  position: "absolute",
  width: `${size}px`,
  height: `${size}px`,
  borderRadius: "50%",
  background: theme.palette.primary.main,
  top,
  left,
  animation: `${floatParticle} ${duration} ease-in-out infinite`,
  animationDelay: delay,
  transition: "none",
}));

const GlowOrb = styled("div")(({ theme }) => ({
  position: "absolute",
  width: "500px",
  height: "500px",
  borderRadius: "50%",
  background: `radial-gradient(circle, ${theme.palette.primary.alpha10} 0%, transparent 70%)`,
  top: "50%",
  left: "40%",
  transform: "translate(-50%, -50%)",
  pointerEvents: "none",
  transition: "none",
  animation: `${orbPulse} 6s ease-in-out infinite`,

  "@media (max-width: 768px)": {
    left: "50%",
  },
}));

const PARTICLES = [
  { size: 4, top: "15%", left: "10%", duration: "3s",   delay: "0s"   },
  { size: 3, top: "45%", left: "55%", duration: "4s",   delay: "1s"   },
  { size: 5, top: "70%", left: "25%", duration: "5s",   delay: "0.5s" },
  { size: 2, top: "25%", left: "80%", duration: "3.5s", delay: "1.5s" },
  { size: 4, top: "80%", left: "75%", duration: "4.5s", delay: "2s"   },
];

const ParticlesBackground = () => (
  <Wrapper>
    {PARTICLES.map((p, i) => (
      <Particle
        key={i}
        size={p.size}
        top={p.top}
        left={p.left}
        duration={p.duration}
        delay={p.delay}
      />
    ))}
    <GlowOrb />
  </Wrapper>
);

export default ParticlesBackground;
