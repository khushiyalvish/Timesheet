
import React, { useEffect, useState } from 'react';
import type{ TimesheetModel } from '../../types/timesheet';
import { getTimesheets } from '../../api/timesheet';
import TimesheetRow from './TimesheetRow';
import '../../styles/timesheet.css';

const TimesheetList: React.FC<{ refreshKey?: number, onLoaded?: (count: number) => void }> = ({ refreshKey, onLoaded }) => {
  const [items, setItems] = useState<TimesheetModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTimesheets();
      setItems(data);
      if (onLoaded) onLoaded(data.length);
    } catch (err: any) {
      setError(err?.message || 'Failed to load timesheets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [refreshKey]);

  if (loading) return <div>Loading timesheets...</div>;
   if (error) return <div className="error">{error}</div>;

  return (
    <div className="timesheet-list">
      <table>
        <thead>
          <tr>
            <th>Date</th><th>Day</th><th>Particular</th><th>ProjectName</th><th>Hours</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr><td colSpan={6}>No timesheets found</td></tr>
          ) : items.map(t => <TimesheetRow key={t.id} t={t} />)}
        </tbody>
      </table>
    </div>
  );
};

export default TimesheetList;


