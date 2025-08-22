




import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import type { TimesheetModel } from '../../types/timesheet';
import { InsertTimesheet } from '../../api/timesheet';
import { getProjects, type Project } from '../../api/project';
import '../../styles/timesheet.css';

type Props = {
  userId: number;
  onInserted?: (newId?: number) => void;
};

const TimesheetForm: React.FC<Props> = ({ userId, onInserted }) => {
  const [workDate, setWorkDate] = useState<Date | null>(new Date());
  const [particular, setParticular] = useState<string>('');
  const [projectId, setProjectId] = useState<number | ''>('');
  const [hours, setHours] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Projects state
  const [projects, setProjects] = useState<Project[]>([]);
  const [projLoading, setProjLoading] = useState(false);
  const [projError, setProjError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setProjLoading(true);
      try {
        const list = await getProjects();
        if (mounted) setProjects(list);
      } catch (err: any) {
        if (mounted) setProjError(err?.response?.data?.message || err?.message || 'Failed to load projects');
      } finally {
        if (mounted) setProjLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!userId && userId !== 0) {
      setError('User is not available. Please login.');
      return;
    }

    if (hours < 0 || hours > 24) {
      setError('Hours must be between 0 and 24.');
      return;
    }

    const model: TimesheetModel = {
      userId,
      workDate: workDate ? workDate.toISOString().slice(0, 10) : '',
      particular: particular || null,
      projectId: projectId === '' ? null : Number(projectId),
      name: '',
      hours,
      status: 1,
      isActive: true,
    };

    try {
      setLoading(true);
      const newId = await InsertTimesheet(model);
      onInserted?.(newId);
      setParticular('');
      setProjectId('');
      setHours(0);
      setWorkDate(new Date());
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to insert timesheet.');
    } finally {
      setLoading(false);
    }
  };

  // custom style for weekends
 const highlightWeekends = (date: Date): string => {
  const day = date.getDay();
  return day === 0 || day === 6 ? "weekend" : "";
};
  return (
    <form className="timesheet-form" onSubmit={submit}>
      
      <div className="form-row">
        <label>Work Date</label>
        <DatePicker
          selected={workDate}
          onChange={(date) => setWorkDate(date)}
          dateFormat="yyyy-MM-dd"
          dayClassName={highlightWeekends}
          required
        />
      </div>

      <div className="form-row">
        <label>Particular</label>
        <input
          type="text"
          value={particular}
          onChange={e => setParticular(e.target.value)}
        />
      </div>

      <div className="form-row">
        <label>Project</label>
        {projLoading ? (
          <div>Loading projects...</div>
        ) : projError ? (
          <div className="error">{projError}</div>
        ) : (
          <select
            value={projectId === '' ? '' : String(projectId)}
            onChange={e => setProjectId(e.target.value === '' ? '' : Number(e.target.value))}
          >
            <option value="">-- Select Project --</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="form-row">
        <label>Hours</label>
        <input
          type="number"
          step="0.50"
          min="0"
          max="24"
          value={hours}
          onChange={e => setHours(Number(e.target.value))}
          required
        />
      </div>

      {error && <div className="error">{error}</div>}

      <div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Saving...' : 'Save Timesheet'}
        </button>
      </div>
    </form>
  );
};

export default TimesheetForm;
