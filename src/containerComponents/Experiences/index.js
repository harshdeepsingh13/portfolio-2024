import React, {useEffect, useMemo, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {Container, CustomTab, CustomTabs, PageHeader} from "../../GlobalStyles";
import {
	ExperienceItem,
	ExperienceRow,
	ExperiencesWrapper,
	Position,
	Responsibilities,
	SecondaryInformation,
	TimelineDivider
} from "./styles";
import TimelinePoint from "../../components/TimelinePoint";
import {useUserDetailsContext} from "../../context/UserDetailsContext";
import FullPageLoader from "../../components/FullPageLoader";
import {faBuilding, faCalendar} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMapPin} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import ReactGA from "react-ga4";
import {LINK} from "../../config/config";

const TAB = {
	PROFESSIONAL_EXPERIENCE: {KEY: "PROFESSIONAL_EXPERIENCE", TEXT: "Professional Experience"},
	FREELANCE_EXPERIENCE: {KEY: "FREELANCE_EXPERIENCE", TEXT: "Freelance Experience"}
}

const Experiences = props => {

	const [activeTab, setActiveTab] = useState(TAB.PROFESSIONAL_EXPERIENCE.KEY);

	const {state, actions, loaders} = useUserDetailsContext();

	let isMounted = useRef(false);

	useEffect(() => {
		if (!isMounted.current) {
			ReactGA.send({hitType: "pageview", page: LINK.EXPERIENCES, title: "Experiences"});
			if (!state.experiences)
				actions.getExperiences();
			isMounted.current = true;
		}
	}, []);

	const experiences = useMemo(() => {
		switch (activeTab) {
			case TAB.PROFESSIONAL_EXPERIENCE.KEY:
				return state?.experiences?.filter(experience => !experience.isFreelanceExperience);
			case TAB.FREELANCE_EXPERIENCE.KEY:
				return state?.experiences?.filter(experience => experience.isFreelanceExperience);
		}
	}, [state?.experiences, activeTab]);

	return <>
		{loaders.getExperienceLoader &&
			<FullPageLoader/>
		}
		<Container>
			<PageHeader>Experiences</PageHeader>
			<CustomTabs variant={"pills"} activeKey={activeTab} onSelect={key => setActiveTab(key)} mountOnEnter unmountOnExit>
				<CustomTab eventKey={TAB.PROFESSIONAL_EXPERIENCE.KEY} title={TAB.PROFESSIONAL_EXPERIENCE.TEXT}>
					<ExperiencesWrapper>
						<TimelineDivider/>
						{experiences?.map((experience, index) => <>
							<ExperienceRow className={"gx-2"}>
								{index % 2 === 0 ?
									<ExperienceCard key={experience._id} experience={experience}/> :
									<ExperienceItem lg={6} className={"hidden"} key={`hidden-${experience._id}`}/>
								}
								<TimelinePoint/>
								{index % 2 !== 0 ?
									<ExperienceCard key={experience._id} experience={experience}/>
									: <ExperienceItem lg={6} className={"hidden"} key={`hidden-${experience._id}`}/>
								}

							</ExperienceRow>
						</>)}
					</ExperiencesWrapper>
				</CustomTab>
				<CustomTab eventKey={TAB.FREELANCE_EXPERIENCE.KEY} title={TAB.FREELANCE_EXPERIENCE.TEXT}>
					<ExperiencesWrapper>
						<TimelineDivider/>
						{experiences?.map((experience, index) => <>
							<ExperienceRow className={"gx-2"}>
								{index % 2 === 0 ?
									<ExperienceCard key={experience._id} experience={experience}/> :
									<ExperienceItem lg={6} className={"hidden"} key={`hidden-${experience._id}`}/>
								}
								<TimelinePoint/>
								{index % 2 !== 0 ?
									<ExperienceCard key={experience._id} experience={experience}/>
									: <ExperienceItem lg={6} className={"hidden"} key={`hidden-${experience._id}`}/>
								}

							</ExperienceRow>
						</>)}
					</ExperiencesWrapper>
				</CustomTab>
			</CustomTabs>
		</Container>
	</>;
};

const ExperienceCard = ({experience}) => {
	return <ExperienceItem lg={6}>
		<Position>
			{experience.position}
		</Position>
		<SecondaryInformation>
			<FontAwesomeIcon icon={faCalendar}/>
			{moment(experience.startDate).format("MMMM, yyyy")}
			&nbsp;-&nbsp;
			{experience.isPresent ?
				"Present" :
				moment(experience.endDate).format("MMMM, yyyy")
			}
		</SecondaryInformation>
		<SecondaryInformation>
			<FontAwesomeIcon icon={faBuilding}/>
			{experience.company}
		</SecondaryInformation>
		<SecondaryInformation>
			<FontAwesomeIcon icon={faMapPin}/>
			{experience.location}
		</SecondaryInformation>
		<Responsibilities dangerouslySetInnerHTML={{__html: experience.responsibilities}}/>
	</ExperienceItem>
}

Experiences.propTypes = {
	props: PropTypes.object
};
Experiences.defaultProps = {
	props: {}
};

export default Experiences
