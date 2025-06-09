import { faBuilding, faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faMapPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { ExperienceItem, Position, Responsibilities, SecondaryInformation } from "./styles";

const ExperienceCard = ({ experience }: { experience: any }) => {
  return (
    <ExperienceItem lg={6}>
      <Position>{experience.position}</Position>
      <SecondaryInformation>
        <FontAwesomeIcon icon={faCalendar} />
        {moment(experience.startDate).format("MMMM, yyyy")}
        &nbsp;-&nbsp;
        {experience.isPresent ? "Present" : moment(experience.endDate).format("MMMM, yyyy")}
      </SecondaryInformation>
      <SecondaryInformation>
        <FontAwesomeIcon icon={faBuilding} />
        {experience.company}
      </SecondaryInformation>
      <SecondaryInformation>
        <FontAwesomeIcon icon={faMapPin} />
        {experience.location}
      </SecondaryInformation>
      <Responsibilities dangerouslySetInnerHTML={{ __html: experience.responsibilities }} />
    </ExperienceItem>
  );
};

export default ExperienceCard;
