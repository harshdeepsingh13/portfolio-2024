import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {Container} from "../../GlobalStyles";
import ReactGA from "react-ga4";
import {LINK} from "../../config/config";

const Search = props => {
	
	let isMounted = useRef(false);
	
	useEffect(() => {
	    if(!isMounted.current){
			ReactGA.send({hitType: "pageview", page: LINK.SEARCH, title: "Search Page"});
	        isMounted.current = true;
	    }
	}, []);
	
	
	return <>
		<Container>
			Search
		</Container>
	</>
};

Search.propTypes = {
	props: PropTypes.object
};
Search.defaultProps = {
	props: {}
};

export default Search
