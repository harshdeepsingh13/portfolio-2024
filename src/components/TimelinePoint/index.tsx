import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TimelinePointWrapper } from "./styles";

const TimelinePoint = () => {
  return (
    <>
      <TimelinePointWrapper>
        <FontAwesomeIcon icon={faCircle} />
      </TimelinePointWrapper>
    </>
  );
};

export default TimelinePoint;
