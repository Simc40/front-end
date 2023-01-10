export type Error = {
    checklist: string,
    comentarios: string,
    comentarios_solucao?: string,
    createdBy: string,
    creation: string,
    etapa_detectada: string,
    item: string,
    lastModifiedBy: string,
    lastModifiedOn: string,
    modelo: string,
    status: string,
    status_locked: string,
    uid: string,
}

export type ErrorsApiGetInterface = {
    [obra: string] : {
        [tag: string] : {
            [uid: string]: Error
        }
    }
}

