import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faBuildingColumns, faMapPin } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { SecondaryInformation } from "../ExperienceComponent/styles";
import { CourseName, EducationItem } from "./styles";

const EducationCard = ({ education }: { education: any }) => {
  return (
    <EducationItem lg={6}>
      <CourseName>{education.course}</CourseName>
      <SecondaryInformation>
        <FontAwesomeIcon icon={faCalendar} />
        {moment(education.startDate).format("MMMM, yyyy")}
        &nbsp;-&nbsp;
        {education.isPresent ? "Present" : moment(education.endDate).format("MMMM, yyyy")}
      </SecondaryInformation>
      <SecondaryInformation>
        <FontAwesomeIcon icon={faBuildingColumns} />
        {education.instituteName}
        {education.university && ", "}
        {education.university}
      </SecondaryInformation>
      <SecondaryInformation>
        <FontAwesomeIcon icon={faMapPin} />
        {education.location}
      </SecondaryInformation>
    </EducationItem>
  );
};

export default EducationCard;
