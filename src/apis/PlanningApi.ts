import axios from "axios";
import {
    GetPlanningInterface,
    PlanningForm,
    PossibleActivities,
} from "../types/Planning";

type apiPlanningInterface = () => {
    getPlanning: () => Promise<GetPlanningInterface>;
    uploadPlanning: (params: PlanningForm) => Promise<any>;
};

const api = axios.create({
    baseURL: process.env.REACT_APP_BACK_END_ADDRESS,
    withCredentials: true,
});

export const planningApi: apiPlanningInterface = () => ({
    getPlanning: async () => {
        const response = await api.get("/planejamento");
        return response.data;
    },
    uploadPlanning: async (params: PlanningForm) => {
        const response = await api.post("/planejamento", { params });
        return response.data;
    },
});
