export interface TodoItem {
  id: string;
  todoText: string;
  isDone: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string
  name: string
  role: 'admin' | 'user'
  avatar: string
  email: string
}

export interface Event {
  id: number
  name: string
  description: string
  time: string
  currentAttendees: number
  maxAttendees: number
  imageUrl: string
  createdAt: string
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}
