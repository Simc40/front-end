export type PossibleActivities = "producao" | "transporte" | "montagem";
type PossibleStartOrEnd = "start" | "end";

export type PlanningActivity = {
    [nome_peca: string]: {
        [startOrEnd in PossibleStartOrEnd]: string;
    };
};

export type GetPlanningInterface = {
    [obra: string]: {
        [activity in PossibleActivities]: {
            [nome_peca: string]: {
                [startOrEnd in PossibleStartOrEnd]: string;
            };
        };
    };
};

export type PlanningForm = {
    activity: PossibleActivities;
    obra: string;
    nome_peca: string;
    startOrEnd: PossibleStartOrEnd;
    date: Date;
};
