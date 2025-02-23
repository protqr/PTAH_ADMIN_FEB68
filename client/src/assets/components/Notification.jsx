import {
  FaRegEdit,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link, Form } from "react-router-dom";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customFetch from "../../utils/customFetch";

dayjs.extend(advancedFormat);

const Notification = ({
  _id,
  title,
  description,
  notifyDate,
  targetGroup,
  file,
  notifyType,
  status,
  createdAt,
  updatedAt
}) => {
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.preventDefault()


    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบแจ้งเตือนนี้?")) {
      await customFetch.delete(`/notifications/${_id}`);
      toast.success("ลบข้อมูลแจ้งเตือนเรียบร้อยแล้ว");
      return navigate("/dashboard/all-notification");
    }
  }

  return (
    <tr>
      <td>{dayjs(notifyDate).format("DD/MM/YYYY | HH:mm")}</td>
      <td>
        {title}
      </td>
      <td>
        {status}
      </td>
      <td className="actions">
        <Link to={`../edit-notification/${_id}`} className="btn edit-btn">
          <FaRegEdit />
        </Link>
        <Form method="post" action={`../delete-notification/${_id}`}>
          <button
            onClick={handleDelete}
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

export default Notification;
