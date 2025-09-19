import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "https://loja.autech.net.br/api-autech-tenant";

const buscarDadosHome = async (): Promise<any> => {
    const jwt = await AsyncStorage.getItem('jwt')

    try {
        const response = await axios.get(`${API_URL}/page_data/home?caixa=0`, {
            headers: {
                "x-tenantid": "47831223000164",
                Authorization: `Bearer ${jwt}`,
            },
        });

        return response.data;
    } catch (error: any) {
        console.error("[Page Data - Home]", error.response?.data || error.message);
        throw error;
    }
};

export default {
    buscarDadosHome,
};
