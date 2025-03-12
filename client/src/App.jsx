import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  HomeLayout,
  Register,
  Login,
  DashboardLayout,
  Landing,
  Error,
  AddPosture,
  Stats,
  AllPosture,
  Profile,
  Admin,
  BlogManage,
  AddUser,
  AllPatient,
  EditPatient,
  DeletePatient,
  EditPosture,
  DeletePosture,
  AddDoctor,
  AllDoctor,
  DeleteDoctor,
  EditDoctor,
  AllAdmin,
  DeleteAdmin,
  SoftDeletePosture,
  SoftDeletePatient,
  SoftDeleteDoctor,
  SoftDeleteAdmin,
  DeletePost,
  AddNotification,
  AllNotification,
  SoftDeleteNotification,
  LinkHomeward
} from "./pages";

import { action as registerAction } from "./pages/Register";
import { action as loginAction } from "./pages/Login";
import { loader as dashboardLoader } from "./pages/DashboardLayout";
import { action as addUserAction } from "./pages/AddUser";
import { loader as allpatientLoader } from "./pages/AllPatient";
import { loader as editPatientLoader } from "./pages/EditPatient";
import { action as editPatientAction } from "./pages/EditPatient";
import { action as deletePatientAction } from "./pages/DeletePatient";
import { loader as statsLoader } from "./pages/Stats";
import { loader as adminLoader } from "./pages/Admin";
import { action as addPostureAction } from "./pages/AddPosture";
import { loader as allpostureLoader } from "./pages/AllPosture";
import { action as deletePostureAction } from "./pages/DeletePosture";
import { loader as editPostureLoader } from "./pages/EditPosture";
import { action as editPostureAction } from "./pages/EditPosture";
import { action as addDoctorAction } from "./pages/AddDoctor";
import { loader as alldoctorLoader } from "./pages/AllDoctor";
import { action as deleteDoctorAction } from "./pages/DeleteDoctor";
import { loader as editDoctorLoader } from "./pages/EditDoctor";
import { action as editDoctorAction } from "./pages/EditDoctor";
import { loader as alladminLoader } from "./pages/AllAdmin";
import { action as deleteAdminAction } from "./pages/DeleteAdmin";
import { loader as allNotificationLoader } from "./pages/AllNotification";
import { loader as editNotificationLoader, action as editNotificationAction } from "./pages/AddNotification";

export const checkDefaultTheme = () => {
  const isDarkTheme = localStorage.getItem("darkTheme") === "true";
  document.body.classList.toggle("dark-theme", isDarkTheme);
  return isDarkTheme;
};

checkDefaultTheme();

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "/register",
        element: <Register />,
        action: registerAction,
      },
      {
        path: "/login",
        element: <Login />,
        action: loginAction,
      },
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        loader: dashboardLoader,
        children: [
          {
            path: "add-posture",
            element: <AddPosture />,
            action: addPostureAction,
          },
          {
            index: true,
            path: "/dashboard",
            element: <Stats />,
            loader: statsLoader,
          },
          {
            path: "all-posture",
            element: <AllPosture />,
            loader: allpostureLoader,
          },
          {
            path: "edit-posture/:_id",
            element: <EditPosture />,
            loader: editPostureLoader,
            action: editPostureAction,
          },
          {
            path: "delete-posture/:_id",
            element: <DeletePosture />,
            action: deletePostureAction,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "admin",
            element: <Admin />,
            loader: adminLoader,
          },
          {
            path: "blogmanage",
            element: <BlogManage />,
          },
          {
            path: "add-user",
            element: <AddUser />,
            action: addUserAction,
          },
          {
            path: "all-patient",
            element: <AllPatient />,
            loader: allpatientLoader,
          },
          {
            path: "edit-patient/:_id",
            element: <EditPatient />,
            loader: editPatientLoader,
            action: editPatientAction,
          },
          {
            path: "delete-patient/:_id",
            element: <DeletePatient />,
            action: deletePatientAction,
          },
          {
            path: "add-admin",
            element: <Register />,
            action: registerAction,
          },
          {
            path: "all-admin",
            element: <AllAdmin />,
            loader: alladminLoader,
          },
          {
            path: "all-notification",
            element: <AllNotification />,
            loader: allNotificationLoader,
          },
          {
            path: "add-notification",
            element: <AddNotification />,
            action: editNotificationAction
          },
          {
            path: "edit-notification/:_id",
            element: <AddNotification />,
            loader: editNotificationLoader,
            action: editNotificationAction
          },
          {
            path: "delete-admin/:_id",
            element: <DeleteAdmin />,
            action: deleteAdminAction,
          },
          {
            path: "add-doctor",
            element: <AddDoctor />,
            action: addDoctorAction,
          },
          {
            path: "all-doctor",
            element: <AllDoctor />,
            loader: alldoctorLoader,
          },
          {
            path: "edit-doctor/:_id",
            element: <EditDoctor />,
            loader: editDoctorLoader,
            action: editDoctorAction,
          },
          {
            path: "delete-doctor/:_id",
            element: <DeleteDoctor />,
            action: deleteDoctorAction,
          },
          {
            path: "history-deleted-posture",
            element: <SoftDeletePosture />,
          },
          {
            path: "history-deleted-patient",
            element: <SoftDeletePatient />,
          },
          {
            path: "history-deleted-doctor",
            element: <SoftDeleteDoctor />,
          },
          {
            path: "history-deleted-admin",
            element: <SoftDeleteAdmin />,
          },
          {
            path: "history-deleted-notification",
            element: <SoftDeleteNotification />,
          },
          {
            path: "link-homeward",
            element: <LinkHomeward />,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
