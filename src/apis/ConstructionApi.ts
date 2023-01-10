import { ConstructionForm } from '../types/Construction';
import { UpdateDataset } from '../types/updateDataset';
import axios from 'axios';
import { Construction } from '../types/Construction';

type apiConstructionInterface = () => { 
    getConstructions: () => Promise<Construction[]>; 
    createConstruction: (params: Construction) => Promise<any>;
    updateConstruction: (params: UpdateDataset) => Promise<any>;
    editConstruction: (params: {[uid:string] : ConstructionForm}) => Promise<any>;
}

const api = axios.create({
    baseURL: process.env.REACT_APP_BACK_END_ADDRESS,
    withCredentials: true,
})

export const constructionApi:apiConstructionInterface = () => ({
    getConstructions: async() => {
        const response = await api.get('/obras');
        return Array.from(Object.values(response.data));
    },
    createConstruction: async(params:Construction) => {
        const response = await api.post('/obras_cadastrar', {params});
        return response.data;
    },
    updateConstruction: async(params:UpdateDataset) => {
        const response = await api.put('/obras_gerenciar', {params});
        return response.data;
    },
    editConstruction: async(params:{[uid:string] : ConstructionForm}) => {
        const response = await api.put('/obras_gerenciar', {params});
        return response.data;
    }
});