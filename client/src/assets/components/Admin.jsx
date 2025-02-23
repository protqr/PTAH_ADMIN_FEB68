import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link, Form } from "react-router-dom";
import Wrapper from "../wrappers/Posture";
import AdminInfo from "./AdminInfo";
import day from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
day.extend(advancedFormat);

const Admin = ({ _id, name, createdAt }) => {
  const date = day(createdAt).format("MMM Do, YYYY");

  // ฟังก์ชันสำหรับการตรวจสอบรหัสการเข้ารหัส (302010)
  const confirmCode = () => {
    const code = prompt("กรุณาใส่รหัสเพื่อยืนยันการลบ:");
    if (code === "302010") {
      return true;
    } else {
      alert("รหัสของท่านไม่ถูกต้อง");
      return false;
    }
  };

  // แก้ไขฟังก์ชันที่ใช้ในการลบ
  const someHandler = (e) => {
    if (confirmCode()) {
      // หากรหัสการเข้ารหัสถูกต้อง ฟอร์มจะถูกส่ง
      e.target.form.submit();
    } else {
      // ยกเลิกการส่งฟอร์มหากรหัสไม่ถูกต้อง
      e.preventDefault();
    }
  };

  return (
    <tr>
      <td>{name}</td>
      <td>
        <Form method="post" action={`../delete-admin/${_id}`}>
          <button
            onClick={(e) =>
              window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบแอดมิน?")
                ? someHandler(e)
                : e.preventDefault()
            }
            type="submit"
            className="btn delete-btn"
          >
            <MdDelete />
          </button>
        </Form>
      </td>
    </tr>
  );
};

export default Admin;
