import Wrapper from "../wrappers/PatientInfo";

const PatientInfo = ({ icon, text }) => {
  return (
    <Wrapper>
      <span className="patient-icon">{icon}</span>
      <span className="patient-text">{text}</span>
    </Wrapper>
  );
};
export default PatientInfo;
