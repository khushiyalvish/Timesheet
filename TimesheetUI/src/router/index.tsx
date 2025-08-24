import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from '../pages/Register';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import TimesheetPage from '../pages/Timesheet';
import TimesheetEdit from '../pages/TimesheetEdit';


const Router = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/timesheet" element={<TimesheetPage />} />
       <Route path="/timesheets/:id/edit" element={<TimesheetEdit />} />

    </Routes>
  </BrowserRouter>
);

export default Router;
