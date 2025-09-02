
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTimesheetById, updateTimesheet } from "../api/timesheet";
import type { TimesheetModel } from "../types/timesheet";
import { getProjects, type Project } from "../api/project";
import { toast } from "react-toastify";
import "../styles/EditTimesheet.css";

const EditTimesheet: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [timesheet, setTimesheet] = useState<TimesheetModel | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [timesheetData, projectsData] = await Promise.all([
          getTimesheetById(Number(id)),
          getProjects()
        ]);
        setTimesheet(timesheetData);
        setProjects(projectsData);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!timesheet) return;
    setTimesheet({ ...timesheet, [e.target.name]: e.target.value });
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!timesheet) return;

    try {
      await updateTimesheet(timesheet.id!, timesheet);
      toast.success("Timesheet updated successfully!");{autoClose: 2000}
      navigate("/timesheet");
    } catch {
      toast.error("Update failed");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!timesheet) return <p>No timesheet found.</p>;

  return (
  
<div className="edit-container">
      <h2>Edit Timesheet</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-group">
          <label>Work Date</label>
          <input
            type="date"
            name="workDate"
            value={timesheet.workDate?.split("T")[0] ?? ""}  
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Particular</label>
          <input
            type="text"
            name="particular"
            value={timesheet.particular ?? ""}
            onChange={handleChange}
            placeholder="Enter task details"
          />
        </div>
        <div className="form-group">
          <label>Project:</label>
          <select
            name="projectId"
            value={timesheet.projectId ?? ""}
            onChange={handleChange}
          >
            <option value="">-- Select Project --</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Hours</label>
          <input
            type="number"
            name="hours"
            value={timesheet.hours}
            onChange={handleChange}
            min="0"
            max="24"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">Update</button>
          <button type="button" className="btn-secondary" onClick={() => navigate("/timesheet")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTimesheet;
