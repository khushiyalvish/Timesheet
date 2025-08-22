// src/types/timesheet.ts
export interface TimesheetModel {
  id?: number;                  // returned from server
  userId: number;               // authenticated user's id (required)
  workDate: string;             // "YYYY-MM-DD" (string is simpler for inputs)
  particular?: string | null;
  projectId? : number | null;
  name: string;
  hours: number;                // decimal (use number in TS)
  status?: number | null;
  isActive?: boolean;
  createdDate?: string;
}
