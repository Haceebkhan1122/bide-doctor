import Dashboard from "../pages/dashboard/Dashboard";
import AppointmentFirstTime from "../pages/appointments/AppointmentFirstTime";
import DoctorSignIn from "../pages/login/DoctorSignIn";
import Cookies from "js-cookie";


const authToken = Cookies.get('token');

export const routes = [
  {
    path: "/",
    exact: true,
    component: authToken && (authToken === undefined || authToken === "undefined") ? DoctorSignIn : Dashboard,
  },
  {
    path: "/appointment/:id",
    exact: true,
    component: AppointmentFirstTime,
  },
];

