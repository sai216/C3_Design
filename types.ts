
export enum AppStep {
  LOGIN = 'LOGIN',
  TERMS = 'TERMS',
  PROJECT_SETUP = 'PROJECT_SETUP',
  DASHBOARD = 'DASHBOARD'
}

export interface ProjectData {
  name: string;
  duration: number; // in days
  budget: number;
  startDate: string;
}

export interface Milestone {
  id: number;
  label: string;
  status: 'pending' | 'completed' | 'current';
  date: string;
  paymentAmount: number;
}
