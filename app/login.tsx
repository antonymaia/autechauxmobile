import { useAuth } from "@/provider/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Checkbox } from "expo-checkbox";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import authService from "./services/authService";

export default function LoginScreen() {
    const { signIn } = useAuth();
    const router = useRouter();
    const [cnpjCpf, setCnpjCpf] = useState("");
    const [username, setUsername] = useState("");
    const [senha, setSenha] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [isChecked, setChecked] = useState(false);

    useEffect(() => {
        const carregarDados = async () => {
            const armazenadoIsChecked = await AsyncStorage.getItem("isChecked");
            if (armazenadoIsChecked === "true") {
                const armazenadoCnpjCpf = await AsyncStorage.getItem("cnpjCpf");
                const armazenadoUsername = await AsyncStorage.getItem("username");
                const armazenadoSenha = await AsyncStorage.getItem("senha");
                if (armazenadoCnpjCpf) setCnpjCpf(armazenadoCnpjCpf);
                if (armazenadoUsername) setUsername(armazenadoUsername);
                if (armazenadoSenha) setSenha(armazenadoSenha);
                setChecked(true);
            }
        };
        carregarDados();
    }, []);

    const handleLogin = async () => {
        setCarregando(true);

        if (!cnpjCpf || !username || !senha) {
            Alert.alert("Preencha todos os campos");
            return;
        }
        try {
            const response = await authService.login(cnpjCpf, username, senha);

            if (response.jwt) {
                signIn(response.jwt);
                if (isChecked) {
                    await AsyncStorage.setItem("senha", senha);
                    await AsyncStorage.setItem("username", username);
                    await AsyncStorage.setItem("cnpjCpf", cnpjCpf);
                    await AsyncStorage.setItem("isChecked", isChecked.toString());
                    console.log("[Login] Salvando dados para lembrar usuário.");
                }
                router.replace("/(internal)/home");
            }
        } catch (error: any) {
            console.log("[Login] Erro ao autenticar", error);
            Alert.alert(error.response.data);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                placeholder="CNPJ/CPF"
                placeholderTextColor="#000"
                value={cnpjCpf}
                onChangeText={setCnpjCpf}
                style={styles.input}
            />
            <TextInput
                placeholder="Username"
                placeholderTextColor="#000"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />
            <TextInput
                placeholder="Senha"
                placeholderTextColor="#000"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                style={styles.input}
            />

            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 30 }}>
                <Text style={{ marginRight: 15 }}>Salvar dados </Text>
                <Checkbox value={isChecked} onValueChange={setChecked} />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={{ fontSize: 18, color: "#ffffffff" }}>Entrar</Text>
            </TouchableOpacity>

            {carregando && (
                <View style={styles.wrapperSpinner}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", padding: 20 },
    title: { fontSize: 24, marginBottom: 20, textAlign: "center" },
    input: {
        borderWidth: 1,
        borderColor: "#9d9d9dff",
        padding: 10,
        marginBottom: 15,
        borderRadius: 6,
        color: "#000",
    },
    button: {
        padding: 10,
        borderRadius: 6,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2d5ea3ff",
    },
    wrapperSpinner: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#04040456",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
});
