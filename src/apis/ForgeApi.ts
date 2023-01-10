import { ApiFirebaseBIM } from '../types/Forge';
import axios from 'axios';
import { ApiAuthToken, ApiModel, ApiModelStatus } from '../types/Forge';

const api = axios.create({
    baseURL: process.env.REACT_APP_BACK_END_ADDRESS,
    withCredentials: true,
})

type forgeApiInterface = () => { 
    getToken: () => Promise<ApiAuthToken>;
    getModels: () => Promise<ApiModel[]>;
    getModelStatus: (urn:string) => Promise<ApiModelStatus>;
    postModel: (params: FormData) => Promise<any>;
    deleteModel: (objectName: string) => Promise<any>;
    getListBIM: () => Promise<ApiFirebaseBIM>
}

export const forgeApi: forgeApiInterface = () => ({
    getToken: async() => {
        const response = await api.get('/api/auth/token');
        return response.data;
    },
    getModels: async() => {
        const response = await api.get('/api/models');
        return response.data;
    },
    getModelStatus: async(urn: string) => {
        const response = await api.get(`/api/models/${urn}/status`);
        return response.data;
    },
    postModel: async (params: FormData) => {
        const response = await api.post('/api/models', params)
        return response;
    },
    deleteModel: async (objectName:string) => {
        const response = await api.delete(`/api/models/delete/${objectName}`)
        return response;
    },
    getListBIM: async() => {
        const response = await api.get('/BIM');
        return response.data;
    },
});