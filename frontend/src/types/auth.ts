export interface User {
  id: string;
  userName: string;
  type: "admin" | "Mem" | "Rev";
}

export interface Student {
  id: string;
  name_eng: string;
  name_arb: string;
  bDate: string;
  logs: Record<string, StudentLog>;
  school: string;
  overAllMem: number;
  newMem: number;
}

export interface StudentLog {
  teacherId: string;
  memDone: string;
  memGrade: string;
  revDone: string;
  revGrade: string;
  time: string;
  notes: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
