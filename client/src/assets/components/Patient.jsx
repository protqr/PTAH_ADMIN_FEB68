import {
  FaLocationArrow,
  FaBriefcase,
  FaCalendarAlt,
  FaRegEdit,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link, Form } from "react-router-dom";
import Wrapper from "../wrappers/Patient";
import PatientInfo from "./PatientInfo";
import day from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
day.extend(advancedFormat);

const Patient = ({
  _id,
  username,
  name,
  surname,
  userType,
  userStatus,
  createdAt,
}) => {
  // แสดงเฉพาะ 8 ตัวแรกของ username และเปลี่ยนตัวอักษรที่เหลือเป็น "x"
  const formattedUserName = username
    ? username.slice(0, 8) + "x".repeat(Math.max(0, username.length - 8))
    : "Unknown"; // กรณี username เป็น undefined

  const date = day(createdAt).format("MMM Do, YYYY");

  return (
    <tr>
      <td>{formattedUserName}</td>
      <td>
        {name} {surname}
      </td>
      <td className={`status status-${userStatus.replace(/\s/g, "-")}`}>
        {userStatus}
      </td>
      <td className="actions">
        <Link to={`../edit-patient/${_id}`} className="btn edit-btn">
          <FaRegEdit />
        </Link>
        <Form method="post" action={`../delete-patient/${_id}`}>
          <button
            onClick={(e) =>
              window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบผู้ป่วยนี้?")
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

export default Patient;
