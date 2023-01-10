export type PDF = {
    uid: string,
    index?: number,
    nome_pdf:string,
    obra:string,
    pdfUrl:string,
    size:string,
    size_text:string,
    elemento?: string,
    status?:string,
    date?:string,
    creation?:string,
    createdBy?:string,
    lastModifiedBy?:string,
    lastModifiedOn?:string,
    newPdf?: boolean,
    activity? : string,
    file? : File,
}

export type PDFConstructionApiGetInterface = {
    [obra: string] : {
        [tag: string] : PDF
    }
}

export type PDFElementsApiGetInterface = {
    [obra: string] : {
        [elemento: string] : {
            [tag: string] : PDF
        }
    }
}

