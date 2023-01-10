import axios from 'axios';
import { PDFConstructionApiGetInterface, PDFElementsApiGetInterface } from '../types/Pdf';

type ChecklistApiInterface = () => { 
    getPdfConstruction: () => Promise<PDFConstructionApiGetInterface>; 
    updatePdfConstruction: (params: FormData) => Promise<any>;
    getPdfElements: () => Promise<PDFElementsApiGetInterface>; 
    updatePdfElements: (params: FormData) => Promise<any>;
}

const api = axios.create({
    baseURL: process.env.REACT_APP_BACK_END_ADDRESS,
    withCredentials: true,
})

export const pdfApi:ChecklistApiInterface = () => ({
    getPdfConstruction: async() => {
        const response = await api.get('/PDF');
        const resposeData: PDFConstructionApiGetInterface = response.data;
        return resposeData;
    },
    updatePdfConstruction: async(params: FormData) => {
        const response = await api.post('/PDF_obras', params);
        return response.data;
    },
    getPdfElements: async() => {
        const response = await api.get('/PDF_elementos');
        const resposeData: PDFElementsApiGetInterface = response.data;
        return resposeData;
    },
    updatePdfElements: async(params: FormData) => {
        const response = await api.post('/PDF_elementos', params);
        return response.data;
    }
});