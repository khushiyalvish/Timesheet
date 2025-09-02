// Timesheet.tsx
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TimesheetForm from '../components/Timesheet/TimesheetForm';
import TimesheetList from '../components/Timesheet/TimesheetList';
import { useAuth } from '../hooks/useAuth';
import '../styles/timesheet.css';

const TimesheetPage: React.FC = () => {
  const { userId } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleInserted = () => {
    // bump refresh key to cause list reload
    setRefreshKey(k => k + 1);
  };

  if (!userId) {
    return (
      <>
        <Header />
        <main className="container">
          <h2>Please login to manage timesheets</h2>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container">
        <h1></h1>
        <TimesheetForm userId={Number(userId)} onInserted={handleInserted} />
       {/* <hr/> */}
        <TimesheetList refreshKey={refreshKey} />
      </main>
      <Footer />
    </>
  );
};

export default TimesheetPage;
