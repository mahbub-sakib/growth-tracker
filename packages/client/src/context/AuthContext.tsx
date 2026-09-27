import { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import api from "../lib/Api";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { setUser, clearUser } from "@/store/userSlice";

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    setIsAuthenticated: (value: boolean) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    // const navigate = useNavigate();

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem("accessToken");

            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }

            try {
                // await api.get("/auth/me", {
                //     headers: { Authorization: `Bearer ${token}` },
                // });
                const response = await api.get("/auth/me");

                dispatch(setUser(response.data.user));
                setIsAuthenticated(true);
            } catch {
                // Token is invalid or expired
                localStorage.removeItem("accessToken");
                dispatch(clearUser());
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
                // console.log("verifyToken finished");
            }
        };

        verifyToken();
    }, []);

    const logout = async () => {
        try {
            await api.post("/auth/logout"); // invalidates the refresh token cookie on the server
        } catch {
            // proceed with local logout even if server call fails
        } finally {
            localStorage.removeItem("accessToken");
            dispatch(clearUser());
            setIsAuthenticated(false);
            window.location.href = "/login";
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, setIsAuthenticated, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used inside AuthProvider");
    return context;
};