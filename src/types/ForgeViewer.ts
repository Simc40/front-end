export type PropertyDatabase = {
    attributeHidden(...args : any[]): any,
    bruteForceFind(...args : any[]): any,
    bruteForceSearch(...args : any[]): any,
    buildDbIdToFragMapbuildDbIdToFragMap(...args : any[]): any,
    buildObjectTree(...args : any[]): any,
    buildObjectTreeRec(...args : any[]): any,
    dtor(): any,
    enumAttributes(...parrams : any[]): any,
    enumObjectPropertiesenumObjectPropertiesV1(...args : any[]): any,
    enumObjects(...args : any[]): any,
    externalIdsLoaded(): any,
    findDifferences(...args : any[]): any,
    findLayers(): any,
    findParent(...args : any[]): any,
    findRootNodes(): any,
    getAttrChild(): any,
    getAttrInstanceOf(): any,
    getAttrLayers(): any,
    getAttrName(): any,
    getAttrNodeFlags(): any,
    getAttrParent(): any,
    getAttrValue(...args : any[]): any,
    getAttrViewableIn(): any,
    getAttrXref(): any,
    getAttributeDef(...args : any[]): any,
    getExternalIdMapping(...args : any[]): any,
    getIdAt(...args : any[]): any,
    getIntValueAt(...args : any[]): any,
    getLayerToNodeIdMapping(): any,
    getNodeNameAndChildren(node : {dbId:any, name:string}, skipChildren: any): any,
    getObjectCount(): any,
    getObjectProperties(dbId: number, attributeName: string[] | string | null): {dbId: number, properties: Array<{displayName: string, displayValue: string, displayCategory: string, attributeName: string, type: number}>},
    getPropertiesSubsetWithInheritancegetPropertiesSubsetWithInheritanceV1(...args : any[]): any,
    getSearchTerms(...args : any[]): any,
    getValueAt(...args : any[]): any,
    idroots: Array<any>,
    nodeHasChild(...args : any[]): any,
    refCount: number,
    rootsDone: boolean,
    truesetIdsBlob(...args : any[]): any,
    _attributeIsBlacklisted(...args : any[]): any,
    _getAttributeAndValueIds(...args : any[]): any,
    _getObjectProperty(...args : any[]): any,
    _ignoreAttribute(...args : any[]): any,
}

export type ForgeViewerElementsDict = {
    [nome_elemento: string] : ForgeViewerElement
}

export type ForgeViewerElement = { 
    index: number, 
    forgePieces: ForgeViewerPiece[],
    nome_elemento: string, 
    pieces_in_forge: number,
    pieces_in_system?: number,
    error?: string,
}

export type ForgeViewerPiece = { 
    dbId: number, 
    nome_elemento: string, 
    nome_peca: string, 
}