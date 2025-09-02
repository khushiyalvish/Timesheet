import axios from "axios";
import type { CheckInRequest, CheckInResponse } from "../types/checkin";


export const insertCheckIn = async (data: CheckInRequest): Promise<CheckInResponse> => {
  const response = await axios.post<CheckInResponse>('timesheet/checkin', data);
  return response.data;
};