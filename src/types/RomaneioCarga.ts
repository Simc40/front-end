import { Transportator } from './Transportator';
import { Construction } from './Construction';
import { Element } from './Element';
import { Geometry } from './Geometry';
import { Shape } from './Shape';
import { Driver } from './Driver';
import { Vehicle } from './Vehicle';
import { Piece } from './Piece';

export type RomaneioCarga = {
    uid: string,
    obra: string,
    construction?: Construction,
    transportadora: string,
    transportator?: Transportator
    motorista: string,
    driver?: Driver
    veiculo: string,
    vehicle?: Vehicle
    pecas: {[tag : string] : string | Piece | undefined}
    peso_carregamento: string,
    volume_carregamento: string,
    romaneio_carga: string,
    data_prev: string,
    data_carga?: string,
    data_transporte?: string,
    data_descarga?: string,
    lastModifiedBy?: string,
    lastModifiedOn?: string,
    date?: string,
    creation?: string,
    createdBy?: string,
    check?: boolean,
}

export type CargasInterface = {
    [tag: string] : RomaneioCarga;
}

export type RomaneioApiInterface = {
    'numCarga': number,
    'cargas': RomaneioCarga[]
}

export type PiecesApiGetMapInterface = {
    'elements': Map<string, Element>, 
    'shapes': Map<string, Shape>, 
    'geometries': Map<string, Geometry>, 
    'constructions': Map<string, Construction>
    'pieces': Map<string, Piece>
}