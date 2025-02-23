import AllHeader from "../assets/components/AllHeader.jsx";
import DeletedNotification from "../assets/components/DeletedNotification.jsx";

const SoftDeleteNotification = () => {
  return (
    <>
      <AllHeader>ข้อมูลที่ลบล่าสุด</AllHeader>
      <DeletedNotification />
    </>
  );
};

export default SoftDeleteNotification;