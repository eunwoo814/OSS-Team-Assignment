import axios from "axios";

export type MealType = "아침" | "점심" | "저녁";

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
  mealType: MealType;
};

export type User = {
  id: number;
  username: string;
  name: string;
  phone: string;
};

export type ParticipantContact = {
  name: string;
  phone: string;
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

// Auth APIs
export async function signup(data: {
  username: string;
  password: string;
  name: string;
  phone: string;
}): Promise<User> {
  const res = await api.post<User>("/auth/signup", data);
  return res.data;
}

export async function login(data: {
  username: string;
  password: string;
}): Promise<User> {
  const res = await api.post<User>("/auth/login", data);
  return res.data;
}

// Attend APIs
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

export async function getParticipantContacts(
  id: string,
  host: string
): Promise<ParticipantContact[]> {
  const res = await api.get<ParticipantContact[]>(
    `/attend/${id}/participants`,
    {
      params: { host },
    }
  );
  return res.data;
}
