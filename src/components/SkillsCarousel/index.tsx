"use client";
import { SKILLS_ASSETS_MAPPING } from "@/config/config";
import { THEME, useThemeContext } from "@/context/ThemeContext";
import Image from "@/elements/Image";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useRef, useState } from "react";
import { CarouselButton, SkillItem, SkillsCarouselWrapper } from "./styles";

const SkillsCarousel = ({ skills = [] }: { skills: any }) => {
  const [currentIndex, setCurrentIndex] = useState(skills.length / 2);
  const skillsContainerRef = useRef(null as HTMLDivElement | null);

  const { theme } = useThemeContext();

  let isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      const randomIndex = Math.floor(Math.random() * (skills.length - 1 - 0) + 0);
      setCurrentIndex(randomIndex);
      setInterval(() => {
        onNext();
      }, 3000);
      isMounted.current = true;
    }
  }, []);

  useEffect(() => {
    skillsContainerRef?.current?.scroll({
      left: currentIndex * 150,
      behavior: "smooth",
    });
  }, [skillsContainerRef, currentIndex]);

  const onNext = () => {
    setCurrentIndex((prev) => (skills.length - 1 === prev ? 0 : ++prev));
  };

  const onPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? skills.length : --prev));
  };

  const defaultSkillsLogo: string = useMemo(
    () => (theme === THEME.LIGHT ? "assets/logos/code-dark.svg" : "assets/logos/code-light.svg"),
    [theme]
  );

  return (
    <>
      <SkillsCarouselWrapper>
        <CarouselButton onClick={onPrev}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </CarouselButton>
        <div className="skills-container" ref={skillsContainerRef}>
          {skills?.map((skill: string) => (
            <SkillItem key={skill}>
              <i></i>
              <Image
                src={SKILLS_ASSETS_MAPPING[skill as keyof typeof SKILLS_ASSETS_MAPPING] ?? defaultSkillsLogo}
                alt={skill}
                className={"logo"}
              />
              <div className="text">{skill}</div>
            </SkillItem>
          ))}
        </div>
        <CarouselButton onClick={onNext}>
          <FontAwesomeIcon icon={faChevronRight} />
        </CarouselButton>
      </SkillsCarouselWrapper>
    </>
  );
};

export default SkillsCarousel;
