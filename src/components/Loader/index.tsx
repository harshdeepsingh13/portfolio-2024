"use client";

import { LoaderWrapper } from "./styles";

const Loader = ({ size = 50 }: { size?: number }) => {
  return (
    <>
      <LoaderWrapper size={size}>
        <div className="cube-wrapper">
          <div className="cube">
            <div className="cube-faces">
              <div className="cube-face shadow"></div>
              <div className="cube-face bottom"></div>
              <div className="cube-face top"></div>
              <div className="cube-face left"></div>
              <div className="cube-face right"></div>
              <div className="cube-face back"></div>
              <div className="cube-face front"></div>
            </div>
          </div>
        </div>
      </LoaderWrapper>
    </>
  );
};
export default Loader;
