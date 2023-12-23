import React from 'react';
import PropTypes from 'prop-types';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle} from "@fortawesome/free-solid-svg-icons";
import {TimelinePointWrapper} from "./styles";

const TimelinePoint = () => {
	return <>
		<TimelinePointWrapper lg={"auto"}>
			<FontAwesomeIcon icon={faCircle}/>
		</TimelinePointWrapper>
	</>
}

TimelinePoint.propTypes = {
	props: PropTypes.object
};
TimelinePoint.defaultProps = {
	props: {}
};

export default TimelinePoint
