import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {Container, PageHeader} from "../../GlobalStyles";
import {CourseName, EducationItem, EducationWrapper} from "./styles";
import {ExperienceRow, SecondaryInformation, TimelineDivider} from "../Experiences/styles";
import TimelinePoint from "../../components/TimelinePoint";
import {useUserDetailsContext} from "../../context/UserDetailsContext";
import FullPageLoader from "../../components/FullPageLoader";
import {faBuildingColumns, faMapPin} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCalendar} from "@fortawesome/free-regular-svg-icons";
import moment from "moment/moment";
import ReactGA from "react-ga4";
import {LINK} from "../../config/config";

const Education = props => {

    const {state, actions, loaders} = useUserDetailsContext();

    let isMounted = useRef(false);

    useEffect(() => {
        if (!isMounted.current) {
            ReactGA.send({hitType: "pageview", page: LINK.EDUCATION, title: "Education Details"});
            if (!state?.educationDetails) {
                actions.getEducationDetails();
            }
            isMounted.current = true;
        }
    }, []);


    return <>
        {loaders.getEducationDetailsLoader &&
            <FullPageLoader/>
        }
        <Container>
            <PageHeader>Education</PageHeader>
            <EducationWrapper>
                <TimelineDivider/>
                {state?.educationDetails?.map((education, index) => <>
                    <ExperienceRow className={"gx-2"}>
                        {index % 2 === 0 ?
                            <EducationCard key={education._id} education={education}/> :
                            <EducationItem lg={6} className={"hidden"} key={`hidden-${education._id}`}/>
                        }
                        <TimelinePoint/>
                        {index % 2 !== 0 ?
                            <EducationCard key={education._id} education={education}/>
                            : <EducationItem lg={6} className={"hidden"} key={`hidden-${education._id}`}/>
                        }

                    </ExperienceRow>
                </>)}
            </EducationWrapper>
        </Container>
    </>
};

const EducationCard = ({education}) => {
    return <EducationItem lg={6}>
        <CourseName>{education.course}</CourseName>
        <SecondaryInformation>
            <FontAwesomeIcon icon={faCalendar}/>
            {moment(education.startDate).format("MMMM, yyyy")}
            &nbsp;-&nbsp;
            {education.isPresent ?
                "Present" :
                moment(education.endDate).format("MMMM, yyyy")
            }
        </SecondaryInformation>
        <SecondaryInformation>
            <FontAwesomeIcon icon={faBuildingColumns}/>
            {education.instituteName}{education.university && ", "}{education.university}
        </SecondaryInformation>
        <SecondaryInformation>
            <FontAwesomeIcon icon={faMapPin}/>
            {education.location}
        </SecondaryInformation>
    </EducationItem>
}

Education.propTypes = {
    props: PropTypes.object
};
Education.defaultProps = {
    props: {}
};

export default Education
