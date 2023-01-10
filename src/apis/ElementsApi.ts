import { getElementsMapInterface } from '../types/Element';
import { geometriesApi } from './GeometriesApi';
import { shapesApi } from './ShapesApi';
import { Shape } from '../types/Shape';
import { UpdateDataset } from '../types/updateDataset';
import axios from 'axios';
import { Element, getElementsInterface } from '../types/Element';
import { Geometry } from '../types/Geometry';
import { Construction } from '../types/Construction';
import { constructionApi } from './ConstructionApi';

type apiElementsInterface = () => { 
    getElements: () => Promise<getElementsInterface>; 
    getElementsMap: () => Promise<getElementsMapInterface>
    createElement: (params: Element) => Promise<any>;
    createMultipleElements: (params: Element[]) => Promise<any>;
    updateElement: (params: UpdateDataset) => Promise<any>;
    editElement: (params: {[uid:string] : Element}) => Promise<any>;
}


const api = axios.create({
    baseURL: process.env.REACT_APP_BACK_END_ADDRESS,
    withCredentials: true,
})

export const elementsApi:apiElementsInterface = () => ({
    getElements: async() => {
        const response:getElementsInterface = {'elements': [], 'shapes': [], 'geometries': [], 'constructions': []};
        await constructionApi().getConstructions()
        .then((constructions: Construction[]) => {response.constructions = constructions;})
        .then(geometriesApi().getGeometries)
        .then((geometries:Geometry[]) => {response.geometries = geometries;})
        .then(shapesApi().getShapes)
        .then((shapes:Shape[]) => {response.shapes = shapes;})
        .then(getRawElements)
        .then((elements) => {
            const elementsArray:Element[] = Array.from(Object.values(elements).flatMap((elementDict) => Object.values(elementDict)))
            elementsArray.forEach((element) => {
                element.construction = response.constructions.filter((construction) => construction.uid === element.obra)[0]
                element.shape = response.shapes.filter((shape) => shape.uid === element.forma)[0]
                element.geometry = response.geometries.filter((geometry) => geometry.uid === element.tipo)[0]
            })
            response.elements = elementsArray;
        })
        return response;
    },
    getElementsMap:async () => {
        const response:getElementsMapInterface = {'elements': new Map<string, Element>(), 'shapes': new Map<string, Shape>(), 'geometries': new Map<string, Geometry>(), 'constructions': new Map<string, Construction>()};
        await constructionApi().getConstructions()
        .then((constructions: Construction[]) => {constructions.forEach((construction) => {response.constructions.set(construction.uid, construction)})})
        .then(geometriesApi().getGeometries)
        .then((geometries:Geometry[]) => {geometries.forEach((geometry) => {response.geometries.set(geometry.uid, geometry)})})
        .then(shapesApi().getShapes)
        .then((shapes:Shape[]) => {shapes.forEach((shape) => {response.shapes.set(shape.uid, shape)})})
        .then(getRawElements)
        .then((elements) => {
            const elementsArray:Element[] = Array.from(Object.values(elements).flatMap((elementDict) => Object.values(elementDict)))
            elementsArray.forEach((element) => {
                element.construction = response.constructions.get(element.obra);
                element.shape = response.shapes.get(element.forma);
                element.geometry = response.geometries.get(element.tipo);
                response.elements.set(element.uid, element)
            })
            console.log(response.elements)
        })
        return response;
    },
    createElement: async(params:Element) => {
        const response = await api.post('/elementos_cadastrar', {params});
        return response.data;
    },
    createMultipleElements: async(params:Element[]) => {
        const response = await api.post('/elementos_cadastrar_all', {params});
        return response.data;
    },
    updateElement: async(params:UpdateDataset) => {
        const response = await api.put('/elementos_gerenciar', {params});
        return response.data;
    },
    editElement: async(params:{[uid:string] : Element}) => {
        const response = await api.put('/elementos_gerenciar', {params});
        return response.data;
    }
});

const getRawElements = () => {
    return new Promise<{[uid_obra:string]: {[uid_elemento: string] : Element}}>(function(resolve, reject){
        api.get('/elementos')
        .then((response) => resolve(response.data))
        .catch((error) => reject(error))
    });
}