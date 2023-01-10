import { Vehicle } from '../types/Vehicle';
import { ApiTransportatorMapInterface, Transportator } from '../types/Transportator';
import { UpdateDataset } from '../types/updateDataset';
import axios from 'axios';
import { Driver } from '../types/Driver';

type apiTransportatorsInterface = () => { 
    getTransportators: () => Promise<Transportator[]>; 
    getTransportatorsMap: () => Promise<ApiTransportatorMapInterface>; 
    createTransportator: (params: Transportator) => Promise<any>;
    updateTransportator: (params: UpdateDataset) => Promise<any>;
    editTransportator: (params: {[uid:string] : Transportator}) => Promise<any>;
    createVehicle: (params: Vehicle) => Promise<any>;
    updateVehicle: (params: UpdateDataset) => Promise<any>;
    editVehicle: (params: {[uid:string] : Vehicle}) => Promise<any>;
    createDriver: (params: Driver) => Promise<any>;
    updateDriver: (params: UpdateDataset) => Promise<any>;
    editDriver: (params: {[uid:string] : Driver}) => Promise<any>;
}

const api = axios.create({
    baseURL: process.env.REACT_APP_BACK_END_ADDRESS,
    withCredentials: true,
})

export const transportatorsApi:apiTransportatorsInterface = () => ({
    getTransportators: async() => {
        const response = await api.get('/transportadoras');
        return Array.from(Object.values(response.data));
    },
    getTransportatorsMap: async() => {
        const response = await api.get('/transportadoras');
        const transportators: Transportator[] = Array.from(Object.values(response.data));
        transportators.forEach((transportator: Transportator) => {
            transportator.mapVehicles = new Map<string, Vehicle>(
                transportator.veiculos !== undefined ?
                Array.from(Object.values(transportator.veiculos))
                .map((vehicle:Vehicle) => {return [vehicle.uid, vehicle]})
                :
                []
            );
            transportator.mapDrivers = new Map<string, Driver>(
                transportator.motoristas !== undefined ?
                Array.from(Object.values(transportator.motoristas))
                .map((driver:Driver) => {return [driver.uid, driver]})
                : 
                []
            );
        });
        return new Map<string, Transportator>(transportators.map((transportator:Transportator) => {return [transportator.uid, transportator]}));
    },
    createTransportator: async(params:Transportator) => {
        const response = await api.post('/transportadoras_cadastrar', {params});
        return response.data;
    },
    updateTransportator: async(params:UpdateDataset) => {
        const response = await api.put('/transportadoras_gerenciar', {params});
        return response.data;
    },
    editTransportator: async(params:{[uid:string] : Transportator}) => {
        const response = await api.put('/transportadoras_gerenciar', {params});
        return response.data;
    },
    createVehicle: async(params:Vehicle) => {
        const response = await api.post('/transportadoras_veiculos_cadastrar', {params});
        return response.data;
    },
    updateVehicle: async(params:UpdateDataset) => {
        const response = await api.put('/transportadoras_veiculos_gerenciar', {params});
        return response.data;
    },
    editVehicle: async(params:{[uid:string] : Vehicle}) => {
        const response = await api.put('/transportadoras_veiculos_gerenciar', {params});
        return response.data;
    },
    createDriver: async(params:Driver) => {
        const response = await api.post('/transportadoras_motoristas_cadastrar', {params});
        return response.data;
    },
    updateDriver: async(params:UpdateDataset) => {
        const response = await api.put('/transportadoras_motoristas_gerenciar', {params});
        return response.data;
    },
    editDriver: async(params:{[uid:string] : Driver}) => {
        const response = await api.put('/transportadoras_motoristas_editar', {params});
        return response.data;
    }
});