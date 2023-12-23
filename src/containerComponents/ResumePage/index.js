import React from 'react';
import PropTypes from 'prop-types';
import {Container, PageHeader} from "../../GlobalStyles";
import {faDownload} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {DownloadButton} from "./styles";
import {cloudinaryResLink} from "../../config/config";

const ResumePage = props => {
    const onResumeDownload = () => {
        let a = document.createElement('a');
        a.target = '_blank';
        a.href = `${cloudinaryResLink}Resume%20-%20Harshdeep%20Singh.pdf`;
        a.click();
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
