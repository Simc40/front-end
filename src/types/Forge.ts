export type ApiAuthToken = {
    "access_token" : string,
    "token_type" : string,
    "expires_in": number,
    "expires_at": number
}

export type ApiModel = {
    "name" : string,
    "urn" : string
}

type message = {
    "type": string,
    "code": string,
    "message": string[]
}

export type ApiModelStatus = {
    "status" : string,
    "progress": string,
    "messages": message[]
}

export type RVT = {
    "uid"?: string, 
    "urn"?: string,
    "index"?: number, 
    "nome_forge"? :string,
    "nome_rvt": string, 
    "obra": string, 
    "status": string, 
    "activity"?: string, 
    "file"?: File,
    "createdBy"?: string,
    "creation"?:string,
    "lastModifiedBy"?:string,
    "lastModifiedOn"?: string
}

export type ApiFirebaseBIM = {
    [uidObra: string] : {
        [uid : string] : RVT
    }
}