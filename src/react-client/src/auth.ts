interface AuthProvider {
    isAuthenticated: boolean;
    username: string | null;
    login: (loginForm: LoginForm) => Promise<void>;
    register: (registerForm: RegisterForm) => Promise<void>;
    logout: () => Promise<void>;
    getUser: () => Promise<string | undefined>;
    // isLoading: boolean;
    errorMessage: string | null;
}

export class LoginForm {
    constructor(public email: string, public password: string) {
    }
}

export class RegisterForm {
    constructor(public email: string, public password: string, public confirmPassword: string) {
    }
}

export const authProvider: AuthProvider = {
    isAuthenticated: false,
    username: null,
    errorMessage: null,
    async login(loginForm: LoginForm) {
        const response = await fetch("/api/login", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(loginForm)
        });
        if (response.ok) {
            this.isAuthenticated = true;
            return;
        }
        const errorDetail = await response.json();
        this.errorMessage = errorDetail.detail;
        this.isAuthenticated = false;
    },

    async register(registerForm: RegisterForm) {
        const response = await fetch("/api/register", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(registerForm)
        });
        if (response.ok) {
            await this.getUser();
        }
    },

    async logout() {
        const response = await fetch("/api/logout", {
            method: "DESTROY"
        });

        if (response.ok) {
            this.isAuthenticated = false;
        }
    },

    async getUser() {
        const response = await fetch("/api/user");
        if (response.ok) {
            const data = await response.json();
            if (Object.keys(data).length > 0) {
                this.isAuthenticated = true;
                return data["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] as string;
            }
        }
        this.isAuthenticated = false;
    }
}