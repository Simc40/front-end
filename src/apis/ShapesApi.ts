import { Shape } from '../types/Shape';
import { UpdateDataset } from '../types/updateDataset';
import axios from 'axios';

type apiShapeInterface = () => { 
    getShapes: () => Promise<Shape[]>; 
    createShape: (params: Shape) => Promise<any>;
    updateShape: (params: UpdateDataset) => Promise<any>;
    editShape: (params: {[uid:string] : Shape}) => Promise<any>;
}

const api = axios.create({
    baseURL: process.env.REACT_APP_BACK_END_ADDRESS,
    withCredentials: true,
})

export const shapesApi:apiShapeInterface = () => ({
    getShapes: async() => {
        const response = await api.get('/formas');
        let shapesArray:Shape[] = Array.from(Object.values(response.data));
        shapesArray.forEach((shape:Shape) => {
            shape.nome_forma_secao = shape.nome_forma + ' - ' + shape.b + "cm x " + shape.h + "cm";
        })
        return shapesArray;
    },
    createShape: async(params:Shape) => {
        const response = await api.post('/formas_cadastrar', {params});
        return response.data;
    },
    updateShape: async(params:UpdateDataset) => {
        const response = await api.put('/formas_gerenciar', {params});
        return response.data;
    },
    editShape: async(params:{[uid:string] : Shape}) => {
        const response = await api.put('/formas_gerenciar', {params});
        return response.data;
    }
});