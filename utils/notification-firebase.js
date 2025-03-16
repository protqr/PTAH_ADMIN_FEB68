// import { google } from "googleapis";
// import axios from "axios";
// import serviceAccount from "../firebase-service-account.json" assert { type: "json" }; // Import JSON ไฟล์โดยตรง

// const PROJECT_ID = serviceAccount.project_id;
// const FCM_ENDPOINT = `https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`;
// const SCOPES = ["https://www.googleapis.com/auth/firebase.messaging"];

// // ฟังก์ชันสำหรับรับ Access Token จาก Google Service Account
// const getAccessToken = async () => {
//   try {
//     const jwtClient = new google.auth.JWT(
//       serviceAccount.client_email,
//       null,
//       serviceAccount.private_key,
//       SCOPES
//     );

//     const { token } = await jwtClient.getAccessToken();
//     return token;
  
//   } catch (error) {
//     console.error("Error getting Access Token:", error);
//     throw new Error("Failed to get Access Token");
//   }
// };

// // ฟังก์ชันสำหรับส่ง FCM Notification
// export const sendFcmMessage = async (messageData) => {
//   try {
//     // {
//     //   token: fcmToken,
//     //   notification: {
//     //     title: "ชำระเงินเสร็จ",
//     //     body: `คุณได้ทำการชำระเงินซื้อ แพ็คเกจ  สำเร็จ`,
//     //     image:
//     //       "https://upload.wikimedia.org/wikipedia/en/thumb/8/86/Avatar_Aang.png/220px-Avatar_Aang.png",
//     //   },
//     // },
//     const accessToken = await getAccessToken();
//     console.log("accessToken", accessToken);

//     const response = await axios.post(
//       FCM_ENDPOINT,
//       { message: messageData },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );

//     console.log("✅ Notification Sent:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error(
//       "❌ Error sending notification:",
//       error.response?.data || error.message
//     );
//     throw new Error("Failed to send FCM Notification");
//   }
// };
