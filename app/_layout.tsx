import { AuthProvider, useAuth } from "@/provider/AuthProvider";
import { Stack } from "expo-router";
import { ActivityIndicator } from "react-native";
import "react-native-reanimated";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const InitialLayout = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        // Aqui você pode colocar um SplashScreen ou um spinner
        return (
            <ActivityIndicator
                size="large"
                style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(16, 30, 80, 1)" }}
            />
        );
    }

    return (
        <Stack>
            <Stack.Protected guard={isAuthenticated}>
                <Stack.Screen name="(internal)" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack>
    );
};

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <AuthProvider>
                    <InitialLayout />
                </AuthProvider>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
