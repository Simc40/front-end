import axios from 'axios';
import { ErrorsApiGetInterface } from '../types/Erros';
import { Piece, PiecesApiGetInterface, PiecesApiGetMapInterface } from '../types/Piece';
import { elementsApi } from './ElementsApi';

type PiecesApiInterface = () => { 
    getErros: () => Promise<ErrorsApiGetInterface>; 
    getPiecesMap: () => Promise<PiecesApiGetMapInterface>; 
}

const api = axios.create({
    baseURL: process.env.REACT_APP_BACK_END_ADDRESS,
    withCredentials: true,
})

const prettyChecklist = new Map<string, string>([
    ["planejamento", "Planejamento"],
    ["cadastro", "Produção/Cadastro"],
    ["armacao", "Produção/Armação"],
    ["forma", "Produção/Forma"],
    ["armacaoForma", "Produção/Armação com Forma"],
    ["concretagem", "Produção/Concretagem"],
    ["liberacao", "Produção/Liberação Final"],
    ["carga", "Transporte/Carga"],
    ["descarga", "Transporte/Descarga"],
    ["montagem", "Montagem"],
    ["completo", "Completo"],
])


export const errosApi:PiecesApiInterface = () => ({
    getErros: async() => {
        // const elementsApiData = await elementsApi().getElementsMap();
        const response = await api.get('/erros')
        // const responseData: PiecesApiGetInterface = response.data;
        // Array.from(Object.values(responseData).flatMap((element:any) => Object.values(element)).flatMap((rfid:any) => Object.values(rfid))).forEach((rfid:any) => {
        //     rfid.element = elementsApiData.elements.get(rfid.elemento)
        //     rfid.construction = elementsApiData.constructions.get(rfid.obra)
        //     rfid.pretty_etapa_atual = prettyChecklist.get(rfid.etapa_atual)
        // })
        return response.data;
    },
    getPiecesMap: async() => {
        const elementsApiData = await elementsApi().getElementsMap();
        const response = await api.get('/pecas')
        const piecesMap = new Map<string, Piece>();
        const responseData: PiecesApiGetInterface = response.data;
        Array.from(Object.values(responseData).flatMap((element:any) => Object.values(element)).flatMap((rfid:any) => Object.values(rfid))).forEach((rfid:any) => {
            rfid.element = elementsApiData.elements.get(rfid.elemento)
            rfid.construction = elementsApiData.constructions.get(rfid.obra)
            rfid.pretty_etapa_atual = prettyChecklist.get(rfid.etapa_atual)
            piecesMap.set(rfid.tag, rfid)
        })
        const responseMap = {...elementsApiData, 'pieces': piecesMap}
        return responseMap;
    }
});