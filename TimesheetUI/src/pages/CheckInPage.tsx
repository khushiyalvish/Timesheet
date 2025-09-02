import React from "react";
import CheckInForm from "../components/Timesheet/CheckinForm";
import MyCheckinsList from "../components/Timesheet/checkinlist";


const CheckInPage: React.FC = () => {
  return (
    <div className="checkin-page">
      {/* Check-In Form */}
      <CheckInForm />

      {/* Check-In History List */}
      <div className="checkin-history">
        <MyCheckinsList />
      </div>
    </div>
  );
};

export default CheckInPage;
