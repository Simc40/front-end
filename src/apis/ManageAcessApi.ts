import axios from 'axios';
import { User } from '../types/User';

type apiManageAcessInterface = () => { 
    createUser: (params: User) => Promise<any>;
    manageUserAcess: (params: {[uid:string] : User}) => Promise<any>;
    editUser: (params: {[uid:string] : User}) => Promise<any>;
}

const api = axios.create({
    baseURL: process.env.REACT_APP_BACK_END_ADDRESS,
    withCredentials: true,
})

export const manageAcessApi:apiManageAcessInterface = () => ({
    createUser: async(params:User) => {
        const response = await api.post('/acessos_cadastrar', {params});
        return response.data;
    },
    manageUserAcess: async(params:{[uid:string] : User}) => {
        const response = await api.put('/acessos_gerenciar', {params});
        return response.data;
    },
    editUser: async(params:{[uid:string] : User}) => {
        const response = await api.put('/acessos_editar', {params});
        return response.data;
    }
});