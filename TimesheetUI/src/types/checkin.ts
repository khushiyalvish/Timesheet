export interface CheckInRequest {
  userId: number;
  deviceId?: string;
  location: string;
  latitude: number;
  longitude: number;
  createdBy: number;
}

export interface CheckInResponse {
  newCheckInId: number;
  message: string;
}