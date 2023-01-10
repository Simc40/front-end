import axios from 'axios';
import { Client } from '../types/Client';

const api = axios.create({
    baseURL: process.env.REACT_APP_BACK_END_ADDRESS,
    withCredentials: true,
})

export const authApi = () => ({
    signIn: async (email: string, password: string) => {
        console.log(api.getUri())
        const response = await api.post('/login', {email, password})
        return response;
    },
    signout: async() => {
        const response = await api.delete('logout');
        return response.status;
    },
    getProfile: async() => {
        const response = await api.get('profile');
        return response.data;
    }
    ,
    getUser: async() => {
        const response = await api.get('/check-session');
        return response;
    },
    createClient: async(params:any) => {
        const response = await api.post('/clientes_cadastrar', {params});
        return response.data;
    },
    updateClients: async(params:any) => {
        const response = await api.put('/clientes_gerenciar', {params});
        return response.data;
    },
    editClient: async(params:any) => {
        const response = await api.put('/clientes_editar', {params});
        return response.data;
    },
    getClients: async() => {
        const response = await api.get('/clientes');
        return response.data;
    },
    setUserClient: async(client: Client) => {
        const response = await api.put('/set-cliente', {client});
        return response.status;
    },
    getUsers: async() => {
        const response = await api.get('/usuarios_de_cliente');
        console.log(response)
        return response.data;
    }
});