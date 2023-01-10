import { Construction } from "./Construction";
import { Geometry } from "./Geometry";
import { Shape } from "./Shape";

export type Element = {
    uid: string,
    b: string,
    c: string,
    fckdesf: string,
    fckic: string,
    forma: string,
    shape?: Shape,
    h: string,
    nome_elemento: string,
    numMax: string,
    numPecas: string,
    numPlanejado: string,
    obra: string,
    construction?: Construction,
    peso: string,
    taxaaco: string,
    tipo: string,
    geometry?: Geometry,
    volume: string,
    status: string,
    secao?: string,
    date?: string,
    creation?: string,
    lastModifiedOn?: string,
}

export type getElementsInterface = {'elements': Element[], 'shapes': Shape[], 'geometries': Geometry[], 'constructions': Construction[]}

export type getElementsMapInterface = {'elements': Map<string, Element>, 'shapes': Map<string, Shape>, 'geometries': Map<string, Geometry>, 'constructions': Map<string, Construction>}