import {createContext, useContext, useEffect, useState} from "react";

interface AuthContextType {
    isAuthenticated: boolean;
    login: (loginForm: LoginForm) => Promise<void>;
    register: (registerForm: RegisterForm) => Promise<void>;
    logout: () => Promise<void>;
    getUser: () => Promise<void>;
    isLoading: boolean;
}

export class LoginForm {
    constructor(public email: string, public password: string) {
    }
}

export class RegisterForm {
    constructor(public email: string, public password: string, public confirmPassword: string) {
    }
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthContextProvider({children}: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function verifyUser() {
            setIsLoading(true);
            try {
                await getUser();
            } catch (error: any) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        verifyUser();
    }, []);

    async function login(loginForm: LoginForm) {
        const response = await fetch("/api/login", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(loginForm)
        });
        if (response.ok) {
            setIsAuthenticated(true);
            return;
        }
        setIsAuthenticated(false);
    }

    async function register(registerForm: RegisterForm) {
        const response = await fetch("/api/register", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(registerForm)
        });
        if (response.ok) {
            await getUser();
        }
    }

    async function logout() {
        const response = await fetch("/api/logout", {
            method: "DESTROY"
        });

        if (response.ok) {
            setIsAuthenticated(false);
        }
    }

    async function getUser() {
        const response = await fetch("/api/user");
        if (response.ok) {
            const data = await response.json();
            if (Object.keys(data).length > 0) {
                setIsAuthenticated(true);
                return;
            }
        }
        setIsAuthenticated(false);
    }

    return <AuthContext.Provider
        value={{isAuthenticated, isLoading, login, logout, register, getUser}}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context == null) {
        throw new Error("useAuth must be used within a AuthContextProvider");
    }
    return context;
}