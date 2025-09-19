import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";

const API_URL = "https://loja.autech.net.br/api-autech-tenant";

const buscarPaginaProduto = async (
    codBusca: number,
    textoBusca: string,
    pagina: number,
    qtdeItens: number
): Promise<any> => {
    const jwt = await AsyncStorage.getItem('jwt')

    try {
        const response = await axios.get(`${API_URL}/produto/pagination`, {
            params: {
                searchId: codBusca,
                searchTerm: textoBusca,
                page: pagina,
                size: qtdeItens,
            },
            headers: {
                "x-tenantid": "47831223000164",
                Authorization: `Bearer ${jwt}`,
            },
        });

        return response.data;
    } catch (error: any) {
        if (error.status >= 400 && error.status < 500 && error.response.data) {
            Alert.alert(error.response.data.message);
        }
        console.log("[Error] [Produto Service]", error?.response?.data || error);
    }
};

export default {
    buscarPaginaProduto,
};
