import axios from 'axios';
import { CargasInterface, RomaneioApiInterface, RomaneioCarga } from '../types/RomaneioCarga';
import { piecesApi } from './PiecesApi';
import { transportatorsApi } from './TransportatorsApi';

type RomaneiosApiInterface = () => { 
    getRomaneioCounter: () => Promise<any>; 
    getCargas: () => Promise<RomaneioApiInterface>; 
    registerCarga: (params: RomaneioCarga) => Promise<any>; 
}

const api = axios.create({
    baseURL: process.env.REACT_APP_BACK_END_ADDRESS,
    withCredentials: true,
})

export const romaneiosApi:RomaneiosApiInterface = () => ({
    getRomaneioCounter: async() => {
        const response = await api.get('/romaneio_num_carga');
        return Array.from(Object.values(response.data));
    },
    getCargas: async() => {
        const piecesApiData = await piecesApi().getPiecesMap();
        const transportatorsApiData = await transportatorsApi().getTransportatorsMap();
        const response = await api.get('/romaneio_cargas')
        const responseData: CargasInterface = response.data;
        const numCarga: any = responseData['00num_carga']
        delete responseData['00num_carga']
        Array.from(Object.values(responseData)).forEach((carga: RomaneioCarga) => {
            carga.construction = piecesApiData.constructions.get(carga.obra);
            carga.transportator = transportatorsApiData.get(carga.transportadora);
            carga.driver = carga.transportator?.mapDrivers?.get(carga.motorista);
            carga.vehicle = carga.transportator?.mapVehicles?.get(carga.veiculo);
            Object.entries(carga.pecas).forEach(([tag, _uidModelo]: [string, any]) => {
                carga.pecas[tag] = piecesApiData.pieces.get(tag)
            })
        })
        const result: RomaneioApiInterface = {'numCarga': parseInt(numCarga), 'cargas': Array.from(Object.values(responseData).map((carga: RomaneioCarga, i) => {return {'index': i, 'check': false, ...carga}}))}
        return result;
    },
    registerCarga: async(params:RomaneioCarga) => {
        const response = await api.post('/romaneio_post', {params});
        return response.data;
    },
});