import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import {DetailsColumn, HomeWrapper, Name, ProfessionalSummary, SocialMediaContainer, SocialMediaItem} from "./styles";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFacebookF, faGithub, faInstagram, faLinkedinIn} from "@fortawesome/free-brands-svg-icons";
import {Col} from "react-bootstrap";
import SkillsCarousel from "../../components/SkillsCarousel";
import {useUserDetailsContext} from "../../context/UserDetailsContext";
import {faEnvelope} from "@fortawesome/free-regular-svg-icons";
import {Row} from "../../GlobalStyles";

const Home = props => {

	const {state, action, loaders} = useUserDetailsContext();

	const socialMediaAccounts = useMemo(() => {
		let accounts = [{icon: faEnvelope, link: "mailto:harshdeepsingh13@gmail.com"}];
		accounts.push({icon: faFacebookF, link: state?.basicInformation?.socialMediaLinks?.facebook});
		accounts.push({icon: faGithub, link: state?.basicInformation?.socialMediaLinks?.github});
		accounts.push({icon: faInstagram, link: state?.basicInformation?.socialMediaLinks?.instagram});
		accounts.push({icon: faLinkedinIn, link: state?.basicInformation?.socialMediaLinks?.linkedin});
		return accounts;
	}, [state?.basicInformation?.socialMediaLinks]);

	return <>
		<HomeWrapper>
			<Row>
				<DetailsColumn lg={8}>
					<Name>{state?.basicInformation?.name}</Name>
					<ProfessionalSummary>{state?.basicInformation?.objective}</ProfessionalSummary>
					<SocialMediaContainer>
						{
							socialMediaAccounts.map(({icon, link}) =>
								<SocialMediaItem
									href={link}
									target={"_blank"}
									rel={"noreferrer noopener"}
									key={link}
								>
									<FontAwesomeIcon icon={icon}/>
								</SocialMediaItem>)
						}
					</SocialMediaContainer>
				</DetailsColumn>
				<Col lg={4}>
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
