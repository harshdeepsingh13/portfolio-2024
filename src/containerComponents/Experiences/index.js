import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {Container, PageHeader} from "../../GlobalStyles";
import {
	ExperienceItem,
	ExperienceRow,
	ExperiencesWrapper,
	Position, Responsibilities,
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

const Experiences = props => {

	const {state, actions, loaders} = useUserDetailsContext();

	let isMounted = useRef(false);

	useEffect(() => {
		if (!isMounted.current) {
			if (!state.experiences)
				actions.getExperiences();
			isMounted.current = true;
		}
	}, []);


	return <>
		{loaders.getExperienceLoader &&
			<FullPageLoader/>
		}
		<Container>
			<PageHeader>Experiences</PageHeader>
			<ExperiencesWrapper>
				<TimelineDivider/>
				{state?.experiences?.map((experience, index) => <>
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
		</Container>
	</>
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
