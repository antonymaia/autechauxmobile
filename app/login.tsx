import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { login } from "./services/authService";
import { getStorage } from "./services/storage";

export default function LoginScreen() {
    const storage = getStorage()
    const router = useRouter();
    const [cnpjCpf, setCnpjCpf] = useState('');
    const [username, setUsername] = useState('');
    const [senha, setSenha] = useState('');
    const [carregando, setCarregando] = useState(false)


    const handleLogin = async () => {
        setCarregando(true)

        if (!cnpjCpf || !username || !senha) {
            Alert.alert('Preencha todos os campos');
            return;
        }
        try {
            const response = await login(cnpjCpf, username, senha);

            if (response.jwt) {
                storage.set('jwt', response.jwt)

                router.push("/(internal)/home")
            }
        } catch (error: any) {
            Alert.alert(error.response.data)
        } finally {
            setCarregando(false)
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                placeholder="CNPJ/CPF"
                placeholderTextColor='#000'
                value={cnpjCpf}
                onChangeText={setCnpjCpf}
                style={styles.input}
            />
            <TextInput
                placeholder="Usename"
                placeholderTextColor='#000'
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />
            <TextInput
                placeholder="Senha"
                placeholderTextColor='#000'
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                style={styles.input}
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={{ fontSize: 18, color: '#ffffffff' }}>Entrar</Text>
            </TouchableOpacity>

            {carregando &&
                <View style={styles.wrapperSpinner}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    input: {
        borderWidth: 1,
        borderColor: '#9d9d9dff',
        padding: 10,
        marginBottom: 15,
        borderRadius: 6,

    },
    button: {
        padding: 10,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#2d5ea3ff"
    },
    wrapperSpinner: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#04040456',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
});
