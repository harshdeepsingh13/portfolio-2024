import React from 'react';
import PropTypes from 'prop-types';
import {DetailsColumn, HomeWrapper, Name, ProfessionalSummary, SocialMediaContainer, SocialMediaItem} from "./styles";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLinkedin} from "@fortawesome/free-brands-svg-icons";
import {Button, Col, Row} from "react-bootstrap";
import SkillsCarousel from "../../components/SkillsCarousel";

const Home = props => {
	return <>
		<HomeWrapper>
			<Row>
				<DetailsColumn sm={8}>
					<Name>Harshdeep Singh</Name>
					<ProfessionalSummary>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus aliquam
						animi
						at
						deserunt eaque est iste non officia placeat repellat repellendus, sit ullam ut vitae,
						voluptatibus.
						Dolorem nihil quidem ullam.
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. A amet enim eum eveniet excepturi
						facere
						fugiat, iusto magni modi neque nostrum numquam, obcaecati quibusdam, quo recusandae repellat
						saepe
						sint
						ullam.</ProfessionalSummary>

					<SocialMediaContainer>
						<SocialMediaItem href="/" target={"_blank"} rel={"noreferrer noopener"}>
							<FontAwesomeIcon icon={faLinkedin}/>
						</SocialMediaItem>
						<SocialMediaItem href="/" target={"_blank"} rel={"noreferrer noopener"}>
							<FontAwesomeIcon icon={faLinkedin}/>
						</SocialMediaItem>
						<SocialMediaItem href="/" target={"_blank"} rel={"noreferrer noopener"}>
							<FontAwesomeIcon icon={faLinkedin}/>
						</SocialMediaItem>
						<SocialMediaItem href="/" target={"_blank"} rel={"noreferrer noopener"}>
							<FontAwesomeIcon icon={faLinkedin}/>
						</SocialMediaItem>
						<SocialMediaItem href="/" target={"_blank"} rel={"noreferrer noopener"}>
							<FontAwesomeIcon icon={faLinkedin}/>
						</SocialMediaItem>
						<SocialMediaItem href="/" target={"_blank"} rel={"noreferrer noopener"}>
							<FontAwesomeIcon icon={faLinkedin}/>
						</SocialMediaItem>
					</SocialMediaContainer>
				</DetailsColumn>
				<Col sm={4}>
           <SkillsCarousel/>
        </Col>
			</Row>
		</HomeWrapper>
	</>
};

Home.propTypes = {
	props: PropTypes.object
};
Home.defaultProps = {
	props: {}
};

export default Home
