import { useAuth } from "@/provider/AuthProvider";
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function InternalLayout() {
    const router = useRouter();
    const { signOut } = useAuth();
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                screenOptions={{
                    headerTintColor: "#ffffffff",
                    headerStyle: { height: 50, backgroundColor: "#132556ff" },
                    headerLeftContainerStyle: { bottom: 15 },
                    headerTitleContainerStyle: { bottom: 24, height: 35, left: 20 },
                    headerShown: true,
                    headerTitleStyle: {
                        color: "#ffffffff",
                        fontFamily: "SpaceMono",
                        fontSize: 16,
                        fontWeight: "light",
                        alignItems: "center",
                        justifyContent: "center",
                    },
                    drawerStyle: { backgroundColor: "#0e1d45ff" },
                    drawerLabelStyle: { color: "#ffffffff", fontFamily: "SpaceMono", fontSize: 18 },
                    drawerContentStyle: { backgroundColor: "#132556ff" },
                }}
                drawerContent={(props) => (
                    <DrawerContentScrollView {...props}>
                        <DrawerItemList {...props} />
                        <DrawerItem
                            label="Sair"
                            labelStyle={{ color: "#fff", fontFamily: "SpaceMono", fontSize: 18 }}
                            onPress={() => {
                                signOut();
                                router.replace("/login");
                            }}
                        />
                    </DrawerContentScrollView>
                )}
            >
                <Drawer.Screen name="home" options={{ drawerLabel: "Início", title: "Home" }} />
                <Drawer.Screen name="(produto)" options={{ drawerLabel: "Produtos", title: "Produtos" }} />
            </Drawer>
        </GestureHandlerRootView>
    );
}
