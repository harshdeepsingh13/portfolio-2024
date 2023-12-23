import React, {useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import {Container, PageHeader} from "../../GlobalStyles";
import {faDownload} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {DownloadButton} from "./styles";
import {cloudinaryResLink, LINK} from "../../config/config";
import ReactGA from "react-ga4";

const ResumePage = props => {
    
    let isMounted = useRef(false);
    
    useEffect(() => {
        if(!isMounted.current){
            ReactGA.send({hitType: "pageview", page: LINK.RESUME, title: "Download Resume Page"});
            isMounted.current = true;
        }
    }, []);
    
    
    const onResumeDownload = () => {
        let a = document.createElement('a');
        a.target = '_blank';
        a.href = `${cloudinaryResLink}Resume%20-%20Harshdeep%20Singh.pdf`;
        a.click();
        ReactGA.event("download_resume", {event_name: "download_resume"})
    };

    return <>
        <Container>
            <PageHeader>Download Resume</PageHeader>

            <DownloadButton onClick={onResumeDownload}>
                <FontAwesomeIcon icon={faDownload}/>
                Download Resume
            </DownloadButton>
        </Container>

    </>
};

ResumePage.propTypes = {
    props: PropTypes.object
};
ResumePage.defaultProps = {
    props: {}
};

export default ResumePage
