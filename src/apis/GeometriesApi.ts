import { UpdateDataset } from '../types/updateDataset';
import axios from 'axios';
import { Geometry } from '../types/Geometry';

type apiGeometriesInterface = () => { 
    getGeometries: () => Promise<Geometry[]>; 
    createGeometry: (params: Geometry) => Promise<any>;
    updateGeometry: (params: UpdateDataset) => Promise<any>;
    editGeometry: (params: {[uid:string] : Geometry}) => Promise<any>;
}

const api = axios.create({
    baseURL: process.env.REACT_APP_BACK_END_ADDRESS,
    withCredentials: true,
})

export const geometriesApi:apiGeometriesInterface = () => ({
    getGeometries: async() => {
        const response = await api.get('/tipos_de_peca');
        return Array.from(Object.values(response.data));
    },
    createGeometry: async(params:Geometry) => {
        const response = await api.post('/tipos_de_peca_cadastrar', {params});
        return response.data;
    },
    updateGeometry: async(params:UpdateDataset) => {
        const response = await api.put('/tipos_de_peca_gerenciar', {params});
        return response.data;
    },
    editGeometry: async(params:{[uid:string] : Geometry}) => {
        const response = await api.put('/tipos_de_peca_editar', {params});
        return response.data;
    }
});