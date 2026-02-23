import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    loginUser: (token: string) => void;
    logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const verifyToken = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
        }

        try {
            await api.get("/user/me");
            setIsAuthenticated(true);
        } catch (error) {
            localStorage.removeItem("token");
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        verifyToken();
    }, []);

    const loginUser = (token: string) => {
        localStorage.setItem("token", token);
        setIsAuthenticated(true);
    };

    const logoutUser = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};
