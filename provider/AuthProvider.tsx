import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AuthContextType {
    loading: boolean;
    isAuthenticated: boolean;
    signIn: (jwt: string) => Promise<void>;
    signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    loading: true,
    signIn: async () => {},
    signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAuthState = async () => {
            try {
                const token = await AsyncStorage.getItem("jwt");
                setIsAuthenticated(!!token);
            } catch (error) {
                console.log('[ERROR] [AutehProvider] ', error);
            } finally {
                setLoading(false);
            }
        };
        loadAuthState();
    }, []);

    const signIn = async (jwt: string) => {
        await AsyncStorage.setItem("jwt", jwt);
        setIsAuthenticated(true);
    };

    const signOut = async () => {
        await AsyncStorage.removeItem("jwt");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    return useContext(AuthContext);
}
