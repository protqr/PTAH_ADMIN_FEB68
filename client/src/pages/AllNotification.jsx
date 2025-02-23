import { useContext, createContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import customFetch from '../utils/customFetch.js';
import NotificationsContainer from '../assets/components/NotificationsContainer.jsx';
import AddButton from '../assets/components/AddButton.jsx';
import AllHeader from '../assets/components/AllHeader.jsx';
import { useLoaderData, useNavigate } from 'react-router-dom'; 
import SoftDelete from "../assets/components/SoftDelete.jsx";
import { MdOutlineAutoDelete } from "react-icons/md";
import SearchNotification from '../assets/components/SearchNotification.jsx';

export const loader = async ({ request }) => {
  console.log(request.url);
  const params = Object.fromEntries([
    ...new URL(request.url).searchParams.entries(),
  ]);

  try {
    const { data } = await customFetch.get('/notifications', {
      params,
    });
    return {
      data,
      searchValues: { ...params },
    };
  } catch (error) {
    toast.error(error?.response?.data?.msg);
    return error;
  }
};


const AllNotificationContext = createContext();

const AllNotification = () => {
  const { data, searchValues } = useLoaderData();
  console.log("🚀  data:", data)
  const navigate = useNavigate();

  useEffect(() => {
    if (data && data.data) {
      console.log(data.data);
    } else {
      console.log('ไม่พบข้อมูลแจ้งเตือน');
    }
  }, [data]);

  return (
    <AllNotificationContext.Provider value={{ data, searchValues }}>
      <SearchNotification />
      <AddButton onClick={() => navigate("/dashboard/add-notification")}>
        <b>+</b> เพิ่มแจ้งเตือน
      </AddButton>
      <SoftDelete onClick={() => navigate("/dashboard/history-deleted-notification")}>
        <MdOutlineAutoDelete />
      </SoftDelete>
      <AllHeader>แจ้งเตือนทั้งหมด</AllHeader>
      <NotificationsContainer />
    </AllNotificationContext.Provider>
  );
};


export const useAllNotificationContext = () => useContext(AllNotificationContext);

export default AllNotification;
