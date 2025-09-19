import axios from 'axios';


const API_URL = 'https://loja.autech.net.br/api-autech-tenant'; // substitua pela sua URL

const login = async (cnpjCpf: string, username: string, senha: string): Promise<any> => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            username: username,
            password: senha,
        },
            {
                headers: {
                    'x-tenantid': cnpjCpf
                }
            }
        );

        return response.data;
    } catch (error: any) {
        console.log('[Error] [Login]', error.response?.data || error.message);
        throw error;
    }
};

export default {
    login,
}


