import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function InternalLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer screenOptions={{
                headerTitle: "",
                headerShown: true
            }}>
                <Drawer.Screen
                    name="home"
                    options={{ drawerLabel: "Início", title: "Tela Inicial" }}
                />
            </Drawer>
        </ GestureHandlerRootView>
    );
}