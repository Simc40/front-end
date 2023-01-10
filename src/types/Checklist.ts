export type Checklist = {
    [order: string]: string
}

export type CheckListApiGetInterface = {
    
    armacao: string,
    armacaoForma: string,
    cadastro: string,
    carga: string,
    concretagem: string,
    descarga: string,
    forma: string,
    liberacao: string,
    montagem: string,
    planejamento: string,
    history: {
        armacao: {[uid:string]: Checklist},
        armacaoForma: {[uid:string]: Checklist},
        cadastro: {[uid:string]: Checklist},
        carga: {[uid:string]: Checklist},
        concretagem: {[uid:string]: Checklist},
        descarga: {[uid:string]: Checklist},
        forma: {[uid:string]: Checklist},
        liberacao: {[uid:string]: Checklist},
        montagem: {[uid:string]: Checklist},
        planejamento: {[uid:string]: Checklist},
    }
}

export type ChecklistOnUse = {
    armacao: Checklist,
    armacaoForma: Checklist,
    cadastro: Checklist,
    carga: Checklist,
    concretagem: Checklist,
    descarga: Checklist,
    forma: Checklist,
    liberacao: Checklist,
    montagem: Checklist,
    planejamento: Checklist,
    [process:string]: Checklist,
}

export type ChecklistHistoryType = {
    armacao: {[uid:string]: Checklist},
        armacaoForma: {[uid:string]: Checklist},
        cadastro: {[uid:string]: Checklist},
        carga: {[uid:string]: Checklist},
        concretagem: {[uid:string]: Checklist},
        descarga: {[uid:string]: Checklist},
        forma: {[uid:string]: Checklist},
        liberacao: {[uid:string]: Checklist},
        montagem: {[uid:string]: Checklist},
        planejamento: {[uid:string]: Checklist},
        [process:string]: {[uid:string]: Checklist},
}