import { Vehicle } from './Vehicle';
import { Driver } from './Driver';

export type Transportator = {
    uid: string,
    motoristas: {[uid: string]: Driver}
    mapDrivers?: Map<string, Driver>
    veiculos: {[uid: string]: Vehicle}
    mapVehicles?: Map<string, Vehicle>
    email : string,
    telefone: string,
    nome_empresa : string,
    bairro: string,
    uf: string,
    cnpj: string,
    cep: string,
    cidade : string,
    endereco : string,
    status?: string,
    date?: string
    creation?: string,
    lastModifiedOn?: string,
}

export type ApiTransportatorMapInterface = Map<string, Transportator>