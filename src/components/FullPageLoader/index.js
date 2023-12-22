import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {FullPageLoaderWrapper, LoaderMessage} from "./styles";
import Loader from "../Loader";
import {createPortal} from "react-dom";

const FullPageLoader = ({message}) => {

	const [loaderSize, setLoaderSize] = useState(60)

	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "initial";
		}
	}, []);

	useEffect(() => {
		if (window.innerWidth <= 992)
			setLoaderSize(40)
		else
			setLoaderSize(60)
	}, [window.innerWidth]);


	return <>
		<FullPageLoaderWrapper>
			<Loader size={loaderSize}/>
			<LoaderMessage>
				{message}...
			</LoaderMessage>
		</FullPageLoaderWrapper>
	</>
};

FullPageLoader.propTypes = {
	message: PropTypes.string
};
FullPageLoader.defaultProps = {
	message: "Painting the Digital Canvas, Please Wait"
};

export default props => createPortal(
	<FullPageLoader {...props}/>,
	document.getElementById("loader")
);
