import { Shed } from '../types/Shed';
import { UpdateDataset } from '../types/updateDataset';
import axios from 'axios';

type apiShedsInterface = () => { 
    getSheds: () => Promise<Shed[]>; 
    createShed: (params: Shed) => Promise<any>;
    updateShed: (params: UpdateDataset) => Promise<any>;
    editShed: (params: {[uid:string] : Shed}) => Promise<any>;
}

const api = axios.create({
    baseURL: process.env.REACT_APP_BACK_END_ADDRESS,
    withCredentials: true,
})

export const shedsApi:apiShedsInterface = () => ({
    getSheds: async() => {
        const response = await api.get('/galpoes');
        return Array.from(Object.values(response.data));
    },
    createShed: async(params:Shed) => {
        const response = await api.post('/galpoes_cadastrar', {params});
        return response.data;
    },
    updateShed: async(params:UpdateDataset) => {
        const response = await api.put('/galpoes_gerenciar', {params});
        return response.data;
    },
    editShed: async(params:{[uid:string] : Shed}) => {
        const response = await api.put('/galpoes_gerenciar', {params});
        return response.data;
    }
});