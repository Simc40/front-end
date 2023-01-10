export type Client = {
    uid: string,
    database : string,
    nome: string,
    uf: string,
    cnpj: string,
    cep: string,
    cidade : string,
    storage : string,
    logoUrl : string,
    status : string,
}

export type ClientForm = {
    bairro: string,
    cep: string,
    cidade: string,
    cnpj: string,
    database: string,
    email: string,
    endereco: string,
    nome: string,
    storage: string,
    telefone: string,
    uf: string,
    status: string,
    image?: string,
    date?: string
}