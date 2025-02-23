import Wrapper from "../wrappers/PatientInfo";

const PostInfo = ({ icon, text }) => {
  return (
    <Wrapper>
      <span className="posture-icon">{icon}</span>
      <span className="posture-text">{text}</span>
    </Wrapper>
  );
};
export default PostInfo;
