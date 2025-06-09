"use client";

import { faCode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LogoWrapper } from "./styles";

const Logo = ({ name }: { name: string }) => {
  return (
    <>
      <LogoWrapper>
        <FontAwesomeIcon icon={faCode} />
        <span className="text"> {name} </span>
      </LogoWrapper>
    </>
  );
};

export default Logo;
