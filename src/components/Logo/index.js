import React from 'react';
import PropTypes from 'prop-types';
import {faCode} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {LogoWrapper} from "./styles";

const Logo = props => {
	return <>
		<LogoWrapper>
			<FontAwesomeIcon icon={faCode}/>
			<span className="text"> Harshdeep Singh </span>
		</LogoWrapper>
	</>
};

Logo.propTypes = {
	props: PropTypes.object
};
Logo.defaultProps = {
	props: {}
};

export default Logo
