import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {CarouselButton, SkillItem, SkillsCarouselWrapper} from "./styles";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {SKILLS} from "../../containerComponents/Skills";

const SkillsCarousel = props => {

	const [currentIndex, setCurrentIndex] = useState(SKILLS.length / 2)
	const skillsContainerRef = useRef(undefined);

	let isMounted = useRef(false);

	useEffect(() => {
		if (!isMounted.current) {
			const randomIndex = Math.floor(Math.random() * ((SKILLS.length - 1) - 0) + 0);
			setCurrentIndex(randomIndex)
			setInterval(() => {
				onNext();
			}, 3000)
			isMounted.current = true;
		}
	}, []);


	useEffect(() => {
		skillsContainerRef?.current?.scroll({
			left: currentIndex * 150,
			behavior: 'smooth'
		});
	}, [skillsContainerRef, currentIndex]);

	const onNext = () => {
		setCurrentIndex(prev => SKILLS.length - 1 === prev ? 0 : ++prev)
	};

	const onPrev = () => {
		setCurrentIndex(prev => prev === 0 ? SKILLS.length : --prev)
	};

	return <>
		<SkillsCarouselWrapper>
			<CarouselButton onClick={onPrev}>
				<FontAwesomeIcon icon={faChevronLeft}/>
			</CarouselButton>
			<div className="skills-container" ref={skillsContainerRef}>
				{SKILLS.map(({LOGO, TEXT}) => (
					<SkillItem key={TEXT}>
						<i></i>
						<img src={LOGO} alt={TEXT} className={"logo"}/>
						<div className="text">
							{TEXT}
						</div>
					</SkillItem>
				))}
			</div>
			<CarouselButton onClick={onNext}>
				<FontAwesomeIcon icon={faChevronRight}/>
			</CarouselButton>
		</SkillsCarouselWrapper>
	</>
};

SkillsCarousel.propTypes = {
	props: PropTypes.object
};
SkillsCarousel.defaultProps = {
	props: {}
};

export default SkillsCarousel
