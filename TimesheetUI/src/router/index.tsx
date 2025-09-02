


import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import TimesheetPage from "../pages/Timesheet";
import TimesheetEdit from "../pages/TimesheetEdit";
import CheckInForm from "../components/Timesheet/CheckinForm";
import Layout from "../components/Layout"; 
import MyCheckins from "../components/Timesheet/checkinlist";
import CheckInPage from "../pages/CheckInPage";

const Router = () => (
  <BrowserRouter>
    <Routes>
      {/* Public pages without header/footer */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
       <Route path="/timesheet" element={<TimesheetPage />} />
         <Route path="/dashboard" element={<Dashboard />} />

      {/* All pages that need header/footer */}
      <Route element={<Layout />}>
        <Route path="/timesheets/:id/edit" element={<TimesheetEdit />} />
          <Route path="/checkin" element={<CheckInPage />} />
        {/* <Route path="/checkin" element={<CheckInForm />} /> */}
        <Route path="/my-checkin" element={<MyCheckins />} />
       
      </Route>
    </Routes>
  </BrowserRouter>
);

export default Router;
