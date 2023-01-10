import { User } from './User';

export type Construction = {
    uid: string,
    nome_obra : string,
    bairro: string,
    uf: string,
    cnpj: string,
    cep: string,
    cidade : string,
    endereco : string,
    quantidade_pecas : string,
    previsao_entrega : string,
    previsao_inicio : string,
    status?: string,
    responsavel_obra: User,
    tipo_construcao: string,
    date?: string
    creation?: string,
    lastModifiedOn?: string,
}

export type ConstructionForm = {
    uid?: string,
    nome_obra? : string,
    bairro?: string,
    uf?: string,
    cnpj?: string,
    cep?: string,
    cidade? : string,
    endereco? : string,
    quantidade_pecas? : string,
    previsao_entrega? : string,
    previsao_inicio? : string,
    status?: string,
    responsavel_obra?: User,
    tipo_construcao?: string,
    date?: string
    creation?: string,
    lastModifiedOn?: string,
}