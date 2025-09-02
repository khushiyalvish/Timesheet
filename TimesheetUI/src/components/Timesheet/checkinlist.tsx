
import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { toast } from "react-toastify";
import "../../styles/checkinlist.css";
import { useAuth } from "../../hooks/useAuth";

type Checkin = {
  checkInCheckOutId: number;
  userId: number;
  name: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: string;
  createdDate: string;
};

const MyCheckins: React.FC = () => {
  const [data, setData] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { userId } = useAuth();

  // load checkins
  const loadCheckins = async () => {
    try {
      setLoading(true);
      const res = await API.get<Checkin[]>("/Timesheet/my-checkin");
      setData(res.data || []);
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
        e?.message ||
        "Failed to load check-ins."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCheckins();
  }, []);

  // checkout handler
  const handleCheckout = async (checkInCheckOutId: number) => {
    try {
      const res = await API.post("/Timesheet/checkout", {
        checkInCheckOutId,
        userId,
        modifiedBy: userId,
      });

      toast.success(res.data.message || "Checked out successfully");
      loadCheckins(); // refresh list
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message ||
        e?.message ||
        "Failed to check out."
      );
    }
  };

  return (
    <div className="mc-wrap">
      <h2 className="mc-title">My Check-In History</h2>

      {loading && <div className="mc-note">Loading check-ins…</div>}
      {error && <div className="mc-error">{error}</div>}

      {!loading && !error && (
        <div className="mc-table-wrap">
          <table className="mc-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="mc-empty">No check-ins found.</td>
                </tr>
              ) : (
                data.map((c) => (
                  <tr key={c.checkInCheckOutId}>
                    <td>{c.createdDate}</td>
                    <td>{c.name}</td>
                    <td>{c.checkInTime ?? "-"}</td>
                    <td>{c.checkOutTime ?? "-"}</td>
                    <td className={c.status === "IN" ? "mc-in" : "mc-out"}>
                      {c.status}
                    </td>
                    {Number(c.userId) === Number(userId) && !c.checkOutTime ? (
                      <button
                        className="btn btn-checkout"
                        onClick={() => handleCheckout(c.checkInCheckOutId)}
                      >
                        🚪 Check Out
                      </button>
                    ) : (
                      "-"
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyCheckins;
