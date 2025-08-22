// src/api/project.ts
import axios from './axios';

export interface Project {
  id: number;
  name: string;
}

export const getProjects = async (): Promise<Project[]> => {
  const resp = await axios.get('/timesheet/projects'); 
  return resp.data;
};






