import React from 'react';
import PropTypes from 'prop-types';
import {faCode} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {LogoWrapper} from "./styles";

const Logo = ({name}) => {
	return <>
		<LogoWrapper>
			<FontAwesomeIcon icon={faCode}/>
			<span className="text"> {name} </span>
		</LogoWrapper>
	</>
};

Logo.propTypes = {
	name: PropTypes.string.isRequired
};
Logo.defaultProps = {};

export default Logo
