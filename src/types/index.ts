export interface Role {
    id: number;
    name: string;
    description: string;
    type: string;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    provider: string;
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    role: Role;
}

export interface AuthState {
    user: User | null;
    jwtToken: string | null;
    login: (identifier: string, password: string) => Promise<void>;
    getUser: () => Promise<void>;
    logout: () => void;
    setUser: (user: User) => void;
    setToken: (token: string) => void;
};