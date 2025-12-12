import axios from "axios";

export type Attend = {
  id: string;
  title: string;
  date: string;
  time: string;
  place: string;
  maxPeople: number;
  host: string;
  memo: string;
  attendCount: number;
  participants?: string[];
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function fetchAttendList(): Promise<Attend[]> {
  const res = await api.get<Attend[]>("/attend");
  return res.data;
}

export async function createAttend(
  data: Omit<Attend, "id">
): Promise<Attend> {
  const res = await api.post<Attend>("/attend", {
    ...data,
    participants: [],
  });
  return res.data;
}

export async function updateAttend(
  id: string,
  data: Attend
): Promise<Attend> {
  const res = await api.put<Attend>(`/attend/${id}`, data);
  return res.data;
}
