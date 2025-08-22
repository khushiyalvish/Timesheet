
import React from 'react';
import type { TimesheetModel } from '../../types/timesheet';



const TimesheetRow: React.FC<{ t: TimesheetModel }> = ({ t }) => {

  const date = new Date(t.workDate);
  const formattedDate = date.toLocaleDateString(); // formats according to locale (19/08/2025)
  const day = date.toLocaleDateString(undefined, { weekday: 'short' });
  // const day = new Date(t.workDate).toLocaleDateString(undefined, { weekday: 'short' });
  return (
    <tr>
      <td>{formattedDate}</td>
      <td>{day}</td>
      <td>{t.particular ?? '-'}</td>
      {/* <td>{t.projectId ?? '-'}</td> */}
      <td>{t.name}</td>
      <td>{t.hours}</td>
      <td>
        <button disabled> Edit </button>
      </td>
    </tr>
  );
};

export default TimesheetRow;
