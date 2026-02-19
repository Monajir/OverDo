import api from "../api/axios";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest extends LoginRequest {
    username: string;
}

export const login = async (data: LoginRequest) => {
    const response = await api.post("/auth/login", data);
    return response.data; // expects { token: "JWT" }
};

export const signup = async (data: RegisterRequest) => {
    const response = await api.post("/auth/register", data);
    return response.data; // expects { token: "JWT" }
};

export const logout = () => {
    localStorage.removeItem("token");
};
