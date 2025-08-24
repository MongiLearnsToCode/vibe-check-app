export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
}

export interface Relationship {
  id: number;
  code: string;
  users: User[];
}

export interface Vibe {
  id: number;
  mood: number;
  note: string | null;
  date: string;
  user_id: number;
  relationship_id: number;
}

export interface VibeCheckResponse {
  submitted: boolean;
}

export interface VibesResponse {
  date: string;
  [userId: number]: {
    mood: number;
    note: string | null;
  } | null;
}
