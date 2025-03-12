import Wrapper from "../assets/wrappers/LogoutContainer";
import { useDashboardContext } from "../pages/DashboardLayout";

const LinkHomeward = () => {
  const { user } = useDashboardContext(); // ดึงข้อมูลผู้ใช้จาก Context
  const userId = user?.id || "guest"; // ใช้ user.id ถ้ามี ถ้าไม่มีให้เป็น "guest"

  return (
    <Wrapper>
      <a
        href={`https://homeward.vercel.app/?userId=${userId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn logout-btn"
      >
        เว็บ Homeward
      </a>
    </Wrapper>
  );
};

export default LinkHomeward;
