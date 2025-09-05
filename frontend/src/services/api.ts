import { User, Student, StudentLog } from "../types/auth";

const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-api-domain.com"
    : "http://localhost:3000/api";
// const API_BASE_URL = "/api";

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Authentication
  async authenticateTeacher(
    userName: string,
    password: string
  ): Promise<{ isAuthenticated: boolean }> {
    return this.request("/authenticate_teacher", {
      method: "POST",
      body: JSON.stringify({ userName, password }),
    });
  }

  async getTeacher(identifier: {
    id?: string;
    userName?: string;
  }): Promise<User> {
    const params = new URLSearchParams();
    if (identifier.id) params.append("id", identifier.id);
    if (identifier.userName) params.append("userName", identifier.userName);

    return this.request(`/get_teacher?${params.toString()}`);
  }

  async createTeacher(data: {
    userName: string;
    password: string;
    type: string;
  }): Promise<{ teacherId: string }> {
    return this.request("/create_teacher", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Students
  async getStudentsList(): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/std_list`);
    return response.text();
  }

  async getStudent(id: string): Promise<Student> {
    return this.request(`/get_student?id=${id}`);
  }

  async createStudent(data: {
    name_eng: string;
    name_arb: string;
    bDate: string;
    logs: Record<string, StudentLog>;
    school: string;
    overAllMem: string;
    newMem: string;
  }): Promise<{ studentId: string }> {
    return this.request("/create_student", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Get Attendance for the date
  async getAttendance(date: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/get_attendance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date }),
    });
    return response.text();
  }

  async takeAttendance(std_names_list: string[]): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/take_attendance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ std_names_list }),
    });
    return response.text();
  }

  async addLogToStudent(studentId: string, log: StudentLog): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/add_log_to_student`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentId, log }),
    });
    return response.text();
  }

  async getLogs(
    studentId: string,
    date?: string
  ): Promise<Record<string, StudentLog>> {
    const params = new URLSearchParams({ studentId });
    if (date) params.append("date", date);

    return this.request(`/get_logs?${params.toString()}`);
  }

  async deleteLog(studentId: string, logId: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/delete_log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ studentId, logId }),
    });
    console.log("Response:", response);
    console.log("Response json:", response.json());

    if (!response.ok) {
      console.log("Error response:", response);
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }
    console.log("line 151");
    return true;
  }
}

export const apiService = new ApiService();
