import { Construction } from './Construction';
import { Element } from './Element';
import { Geometry } from './Geometry';
import { Shape } from './Shape';

export type Etapa = {
    checklist: string,
    createdBy: string,
    creation: string,
}

export type Piece = {
    elemento: string,
    element?: Element,
    etapa_atual: string,
    pretty_etapa_atual?: string,
    lastModifiedBy: string,
    lastModifiedOn: string,
    nome_peca: string,
    num: string,
    obra: string,
    construction?: Construction,
    romaneio: string,
    tag: string,
    check?: boolean,
    etapas: {
        [etapa: string] : Etapa
    }
}

export type PiecesApiGetInterface = {
    [obra: string] : {
        [elemento: string]: {
            [tag: string] : Piece
        }
    }
}

export type PiecesApiGetMapInterface = {
    'elements': Map<string, Element>, 
    'shapes': Map<string, Shape>, 
    'geometries': Map<string, Geometry>, 
    'constructions': Map<string, Construction>
    'pieces': Map<string, Piece>
}

