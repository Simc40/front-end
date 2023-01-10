import { Checklist, CheckListApiGetInterface } from '../types/Checklist';
import axios from 'axios';

type ChecklistApiInterface = () => { 
    getChecklist: () => Promise<CheckListApiGetInterface>; 
    updateChecklist: (params: {[etapa: string]: Checklist}) => Promise<any>;
}

const api = axios.create({
    baseURL: process.env.REACT_APP_BACK_END_ADDRESS,
    withCredentials: true,
})

export const checklistApi:ChecklistApiInterface = () => ({
    getChecklist: async() => {
        const response = await api.get('/checklist');
        const resposeData: CheckListApiGetInterface = response.data;
        return resposeData;
    },
    updateChecklist: async(params:{[etapa: string]: Checklist}) => {
        const response = await api.put('/checklist_post', {params});
        return response.data;
    }
});