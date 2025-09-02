import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import type { TimesheetModel } from '../../types/timesheet';
import { getTimesheets } from '../../api/timesheet';
import '../../styles/timesheet.css';

const TimesheetList: React.FC<{ refreshKey?: number }> = ({ refreshKey }) => {
  const [items, setItems] = useState<TimesheetModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getTimesheets();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [refreshKey]);

  const columns = [
    {
      name: 'Date',
      selector: (row: TimesheetModel) => new Date(row.workDate).toLocaleDateString(),
      sortable: true,
      width: '110px',
    },
    {
      name: 'Day',
      selector: (row: TimesheetModel) =>
        new Date(row.workDate).toLocaleDateString(undefined, { weekday: 'short' }),
      width: '90px',
      center: true,
    },
    {
      name: 'Particular',
      selector: (row: TimesheetModel) => row.particular ?? '-',
      wrap: true,
      grow: 3,
      cell: (row: TimesheetModel) => (
        <div
          title={row.particular ?? '-'}
          style={{
            maxWidth: '350px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {row.particular ?? '-'}
        </div>
      ),
    },
    {
      name: 'Project',
      selector: (row: TimesheetModel) => row.name,
      width: '120px',
    },
    {
      name: 'Hours',
      selector: (row: TimesheetModel) => row.hours.toString(),
      sortable: true,
      width: '100px',
      center: true,
    },
    {
      name: 'Actions',
      width: '120px',
      cell: (row: TimesheetModel) =>
        row.id ? (
          <a href={`/timesheets/${row.id}/edit`} className="btn small">
            Edit
          </a>
        ) : (
          <button disabled className="btn small">
            Edit
          </button>
        ),
    },
  ];

  const filteredItems = items.filter(
    (i) =>
      i.particular?.toLowerCase().includes(filterText.toLowerCase()) ||
      i.name?.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="timesheet-container">
      <DataTable
        columns={columns}
        data={filteredItems}
        progressPending={loading}
        pagination
        paginationPerPage={rowsPerPage}
        paginationRowsPerPageOptions={[5, 10, 20, 50]}
        highlightOnHover
        dense
        fixedHeader
        subHeader
        subHeaderComponent={
          <div className="table-header">
            <h2 className="table-title">Timesheets List</h2>
            <input
              type="text"
              placeholder="Search..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="search-box"
            />
          </div>
        }
      />

    </div>
  );
};

export default TimesheetList;
