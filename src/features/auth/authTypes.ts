export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  status: 'signed_out' | 'signed_in';
  hydrated: boolean;
}
