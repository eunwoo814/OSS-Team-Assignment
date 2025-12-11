// lib/api.ts
// lib/api.ts
export type Attend = {
    id: string; // 
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
  
  
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;
  
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }
  
  export async function fetchAttendList(): Promise<Attend[]> {
    const res = await fetch(`${BASE_URL}/attend`);
    if (!res.ok) throw new Error("Failed to fetch attend list");
    return res.json();
  }
  
  export async function createAttend(
    data: Omit<Attend, "id">
  ): Promise<Attend> {
    const res = await fetch(`${BASE_URL}/attend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, participants: [] }),
    });
    if (!res.ok) throw new Error("Failed to create attend");
    return res.json();
  }
  
  export async function updateAttend(id: string, data: Attend): Promise<Attend> {
    const res = await fetch(`${BASE_URL}/attend/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update attend");
    return res.json();
  }
  