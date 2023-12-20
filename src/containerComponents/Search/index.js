import React from 'react';
import PropTypes from 'prop-types';
import {Container} from "../../GlobalStyles";

const Search = props => {
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
