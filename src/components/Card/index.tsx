import { ReactNode, useCallback } from "react";
import { CardWrapper } from "./styles";

const Card = ({
  children,
  sm,
  background,
  accentColor,
  ...props
}: {
  children?: ReactNode;
  sm?: boolean;
  background?: string;
  accentColor?: string;
  lg?: number | boolean;
  className?: string;
  key?: string | number;
}) => {
  const onHoverItem = useCallback((event: any) => {
    const { target: el } = event;
    const width = el.offsetWidth;
    const height = el.offsetHeight;
    const tiltDegree = 5;

    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const cX = rect.x + width / 2;
    const cY = rect.y + height / 2;

    const mX = event.clientX - cX;
    const mY = event.clientY - cY;

    const rY = ((tiltDegree * mX) / (width / 2)).toFixed(2);
    const rX = ((-1 * (tiltDegree * mY)) / (height / 2)).toFixed(2);

    el.style.setProperty("--rot-x", `${rX}deg`);
    el.style.setProperty("--rot-y", `${rY}deg`);
    el.style.setProperty("--drop-x", `${x}px`);
    el.style.setProperty("--drop-y", `${y}px`);
  }, []);

  return (
    <>
      <CardWrapper onMouseMove={onHoverItem} sm={sm} background={background} accentColor={accentColor} {...props}>
        {children}
      </CardWrapper>
    </>
  );
};

export default Card;
