import Wrapper from "../wrappers/PatientsContainer";
import { useAllNotificationContext } from "../../pages/AllNotification";
import Notification from "./Notification";

const NotificationsContainer = () => {
  const contextData = useAllNotificationContext();

  if (!contextData) {
    return (
      <Wrapper>
        <h2>Loading...</h2>
      </Wrapper>
    );
  }

  const data = contextData.data.data;

  if (!data || data.length === 0) {
    return (
      <Wrapper>
        <br /><br /><br /><h2>ไม่พบข้อมูลแจ้งเตือน</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <table>
        <thead>
          <tr>
            <th className="nopat">วัน | เวลา</th>
            <th>หัวข้อแจ้งเตือน</th>
            <th>สถานะ</th>
            <th className="mang">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {data.map((n) => {
            return <Notification key={n._id} {...n} />;
          })}
        </tbody>
      </table>
    </Wrapper>
  );
};

export default NotificationsContainer;
