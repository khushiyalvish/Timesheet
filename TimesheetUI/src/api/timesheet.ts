import axios from './axios'; // your existing axios instance
import type{ TimesheetModel } from '../types/timesheet';



export const getTimesheets = async (): Promise<TimesheetModel[]> => {
  const resp = await axios.get('/timesheet/my-timesheet'); 
  return resp.data;
};


export const getAllTimesheets = async (): Promise<TimesheetModel[]> => {
  const resp = await axios.get('/timesheet/timesheet'); 
  return resp.data;
};

export const InsertTimesheet = async (model: TimesheetModel): Promise<number> => {
  const resp = await axios.post('/Timesheet/insert', model);
  if (resp.data?.newId) return resp.data.newId;
  if (resp.data?.message) return 1;
  return 1;
};




export const getTimesheetById = async (id: number): Promise<TimesheetModel> => {
  const resp = await axios.get(`/Timesheet/timesheet/detail/${id}`);
  return resp.data;
};

// Update timesheet
export const updateTimesheet = async (id: number, model: TimesheetModel): Promise<TimesheetModel> => {
  const resp = await axios.put(`/timesheet/update/${id}`, model);
  return resp.data;
};
