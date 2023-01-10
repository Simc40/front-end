import React, { ChangeEvent, useEffect, useState } from 'react';
import { ApiAuthToken, ApiModel } from '../../types/Forge';
import './main.scss';
import { forgeApi } from '../../apis/ForgeApi';
import { ForgeViewerElement, ForgeViewerElementsDict, ForgeViewerPiece, PropertyDatabase } from '../../types/ForgeViewer';
import { Section } from '../../components/forms/Section';
import { GridColDef } from '@mui/x-data-grid';
import { ForgeSyncronizeTable } from '../../components/Tables/ForgeSyncronizeTable';
import { Element, getElementsInterface } from "../../types/Element";
import { OnClickLink } from '../../components/Links/OnClickLink';
import swal from 'sweetalert';
import { SubmitButton } from '../../components/Button/SubmitButton';
import * as Excel from "exceljs";
import fs from 'file-saver';
import { Geometry } from '../../types/Geometry';
import { Shape } from '../../types/Shape';
import { InputSection } from '../../components/forms/InputSection';
import { useForm } from 'react-hook-form';
import { getFormatDate } from '../../hooks/getDate';
import { elementsApi } from '../../apis/ElementsApi';

declare global {
    interface Window {
        onModelSelectedTimeout:any;
    }
}

const ViewerDashboard = ({urn, nomeObraModelo, constructionUid, elements, mapElementsByName, setIsLoading} : {setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, mapElementsByName: Map<string, Element>, constructionUid: string, urn?: string, nomeObraModelo?:string, elements: getElementsInterface}) => {//class Viewer extends React.Component<ViewerState, ViewerState> {
    const [viewer, setViewer] = useState<Autodesk.Viewing.GuiViewer3D>();
    const [rows, setRows] = useState<ForgeViewerElement[]>([]);
    const [success, setSuccess] = useState(false);
    const [onTemplateDownloaded, setOnTemplateDownloaded] = useState(false);
    const { handleSubmit } = useForm();

    useEffect(() => {
        if(window.Autodesk) { 
            loadCss('https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.css');         

            loadScript('https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.js') 
            .onload = () => {
                onScriptLoaded();
            }; 
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urn]);

    const getAccessToken = (callback: ((accessToken: string, expires: number) => void) | undefined) => {
        try {
            forgeApi().getToken()
            .then((response) => {
                const responseBody: ApiAuthToken = response;
                if(callback === undefined) throw Error();
                callback(responseBody.access_token, responseBody.expires_in);
            })
        } catch (err) {
            alert('Could not obtain access token. See the console for more details.');
            console.error(err);
        }
    }

    const initViewer = (container: HTMLElement) => {
        return new Promise<Autodesk.Viewing.GuiViewer3D>(function (resolve, reject) {
            Autodesk.Viewing.Initializer( {getAccessToken} , function () {
                const config = {
                    extensions: ['Autodesk.DocumentBrowser']
                };
                const viewer = new Autodesk.Viewing.GuiViewer3D(container, config);
                viewer.start();
                viewer.setTheme('light-theme');
                resolve(viewer);
            });
        });
    }
    
    const loadModel = (viewer: Autodesk.Viewing.GuiViewer3D, urn: string) => {
        return new Promise(function (resolve, reject) {
            function onDocumentLoadSuccess(doc: Autodesk.Viewing.Document) {
                resolve(viewer.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry()));
            }
            function onDocumentLoadFailure(code: Autodesk.Viewing.ErrorCodes, message: string, errors: any[]) {
                reject({ code, message, errors });
            }
            viewer.setLightPreset(0);
            Autodesk.Viewing.Document.load('urn:' + urn, onDocumentLoadSuccess, onDocumentLoadFailure);
        });
    }

    const onModelSelected = async (viewer: Autodesk.Viewing.GuiViewer3D, urn: string) => {
        if (window.onModelSelectedTimeout) {
            clearTimeout(window.onModelSelectedTimeout);
            delete window.onModelSelectedTimeout;
        }
        window.location.hash = urn;
        try {
            forgeApi()
            .getModelStatus(urn)
            .then((response) => {
                switch (response.status) {
                    case 'n/a':
                        showNotification(`Model has not been translated.`);
                        break;
                    case 'inprogress':
                        showNotification(`Model is being translated (${response.progress})...`);
                        window.onModelSelectedTimeout = setTimeout(onModelSelected, 5000, viewer, urn);
                        break;
                    case 'failed':
                        const messages = response.messages.map((msg:any) => `<li>${msg}</li>`).join('');
                        showNotification(`Translation failed. <ul>${messages}</ul>`);
                        break;
                    default:
                        clearNotification();
                        loadModel(viewer, urn);
                        break; 
                }
            })
        } catch (err) {
            alert('Could not load model. See the console for more details.');
            console.error(err);
        }
    }
    
    const setupModelSelection = async (viewer: Autodesk.Viewing.GuiViewer3D, selectedUrn: string) => {
        const dropdown = document.getElementById('models') as HTMLSelectElement;
        dropdown.innerHTML = '';
        try {
            forgeApi().getModels()
            .then(async (models) => {
                dropdown.innerHTML = models.filter((model: ApiModel) => model.urn === urn).map((model: ApiModel) => `<option value=${model.urn} ${model.urn === selectedUrn ? 'selected' : ''}>${model.name}</option>`).join('\n');
                dropdown.onchange = async () => { onModelSelected(viewer, dropdown.value)};
                if (dropdown.value) {
                    onModelSelected(viewer, dropdown.value);
                }
            })
        } catch (err) {
            if(err instanceof Error){
                console.log(err.stack)
            }
            alert('Could not list models. See the console for more details.');
            console.error(err);
        }
    }
    
    const showNotification = (message:string) => {
        const overlay = document.getElementById('overlay') as HTMLElement;
        overlay.innerHTML = `<div class="notification">${message}</div>`;
        overlay.style.display = 'flex';
    }
    
    const clearNotification = () => {
        const overlay = document.getElementById('overlay') as HTMLElement;
        overlay.innerHTML = '';
        overlay.style.display = 'none';
    }

    const loadCss = (src: string): HTMLLinkElement => {
        const link = document.createElement('link'); 
        link.rel="stylesheet";
        link.href=src;
        link.type="text/css";
        document.head.appendChild(link);         
        return link; 
    }

    const loadScript = (src: string): HTMLScriptElement => { 
        const script = document.createElement('script'); 
        script.type = 'text/javascript'; 
        script.src = src; 
        script.async = true; 
        script.defer = true; 
        document.body.appendChild(script);         
        return script; 
    }

    function userFunction(pdb: PropertyDatabase) {
        const has_trace = (string: string) => (string.search(/-/) === -1) ? false : true;
        const split_by_trace = (string: string) => string.substring(0, string.search(/-/))
        const view_elementos: ForgeViewerElementsDict = {};
        const all_elementos: Map<number, string> = new Map();

        const pushForgePiece = (peca: ForgeViewerPiece) => {
            if(view_elementos[peca.nome_elemento] === undefined) {
                const forgeViewerElement: ForgeViewerElement = {
                    index: Object.values(view_elementos).length,
                    forgePieces: [],
                    nome_elemento: peca.nome_elemento,
                    pieces_in_forge: 0,
                }
                view_elementos[peca.nome_elemento] = forgeViewerElement
            }
            view_elementos[peca.nome_elemento].forgePieces.push(peca)
            view_elementos[peca.nome_elemento].pieces_in_forge = view_elementos[peca.nome_elemento].forgePieces.length;
        }

        pdb.enumObjects((dbId:any) => {
            const peca = pdb.getObjectProperties(dbId, 'Elemento')
            if(peca != null && peca !== undefined && peca.properties[0].displayValue !== ''){
                all_elementos.set(dbId, peca.properties[0].displayValue);
            }
            if(peca != null && peca !== undefined && has_trace(peca.properties[0].displayValue)){
                const forgePiece: ForgeViewerPiece = {'dbId': dbId, 'nome_elemento': split_by_trace(peca.properties[0].displayValue), 'nome_peca': peca.properties[0].displayValue}
                pushForgePiece(forgePiece)
            }
        });

        console.log(view_elementos);
        return {'view_elementos': view_elementos, 'all_elementos': all_elementos}

    }

    const syncronizeModel = (viewer: Autodesk.Viewing.GuiViewer3D) => {
        if(viewer === undefined) return;
        console.log(userFunction)
        viewer.model.getPropertyDb().executeUserFunction( userFunction )
        .then((_retValue: {'view_elementos': ForgeViewerElementsDict, 'all_elementos': Map<number, string>}) => {
            const view_elementos = _retValue.view_elementos;
            const all_elementos = _retValue.all_elementos;
            Object.values(view_elementos).forEach((forgeViewerElement: ForgeViewerElement) => {
                forgeViewerElement.pieces_in_system = (mapElementsByName.get(forgeViewerElement.nome_elemento)?.numMax === undefined) ? 0 : parseInt(mapElementsByName.get(forgeViewerElement.nome_elemento)!.numMax)

                if(forgeViewerElement.pieces_in_system === 0){
                    forgeViewerElement.error = `Elemento ${forgeViewerElement.nome_elemento} não está cadastrado no Sistema`;
                }
                else if(forgeViewerElement.pieces_in_forge !== forgeViewerElement.pieces_in_system) forgeViewerElement.error = `Nº de peças planejadas: ${forgeViewerElement.pieces_in_system}, encontradas no BIM: ${forgeViewerElement.pieces_in_forge}`
                forgeViewerElement.forgePieces.forEach((peca: ForgeViewerPiece) => {
                    if (all_elementos.get(peca.dbId) !== undefined) all_elementos.delete(peca.dbId);
                    viewer.model.setThemingColor(peca.dbId, new THREE.Vector4(0, 0.5, 0, 0.5));
                })
            })
            Array.from(all_elementos.keys()).forEach((dbId: number) => {
                const color = new THREE.Color( 0xff0000 );
                viewer?.model.setThemingColor(dbId, new THREE.Vector4(color.r, color.g, color.b, 0.5));
            })
            const forgeViewerElementsArray = Object.keys(view_elementos);
            Array.from(mapElementsByName.values())
            .filter((element: Element) => !forgeViewerElementsArray.includes(element.nome_elemento))
            .forEach((element: Element) => {
                const forgeViewerElement: ForgeViewerElement = {
                    index: Object.values(view_elementos).length,
                    forgePieces: [],
                    nome_elemento: element.nome_elemento,
                    pieces_in_forge: 0,
                    pieces_in_system: parseInt(element.numMax),
                    error: `Elemento: ${element.nome_elemento} não possui peças no modelo BIM`
                };
                view_elementos[element.nome_elemento] = forgeViewerElement;
            })
            setRows(Object.values(view_elementos));
            viewer.refresh(true);
            if(all_elementos.size > 0 ){
                setSuccess(false);
                swal("Oops!", `Foram identificadas ${all_elementos.size} peças no modelo que não podemos identificar corretamente pela propriedade 'Elemento':\n${Array.from(all_elementos.values()).join(', ')}.\n As peças foram destacadas em vemelho no modelo BIM.`, "error");
            }else{
                setSuccess(true);
            }
        })
        // viewer.refresh(true)
        .catch(function(_err){
            //alert("Selecione uma Obra com o modelo BIM traduzido para prosseguir.");
            console.log(_err)
        });
    }

    const onScriptLoaded = () => {
        const preview = document.getElementById('preview') as HTMLElement;
        initViewer(preview)
        .then((viewer: Autodesk.Viewing.GuiViewer3D) => {
            const urn = window.location.hash?.substring(1);
            setupModelSelection(viewer, urn);
            // setupModelUpload(viewer);
            setViewer(viewer);
            viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, () => 
            { 
                syncronizeModel(viewer)
            })
        })            
    }

    const paintPiecesInBim = (forgePieces: ForgeViewerPiece[]) => {
        console.log("paintPieciesInBIM")
        rows.flatMap((piece) => piece.forgePieces).forEach((piece) => {
            viewer?.model.setThemingColor(piece.dbId, new THREE.Vector4(0, 0.5, 0, 0.5));
        })
        forgePieces.forEach((piece: ForgeViewerPiece) => {
            const color = new THREE.Color( 0xffff00 );
            viewer?.model.setThemingColor(piece.dbId, new THREE.Vector4(color.r, color.g, color.b, 0.5));
        })
        viewer?.refresh(true);
        viewer?.loadExtension('Autodesk.FullScreen').then((extension) => {
            extension.activate('FullScreen')
        })
        viewer?.unloadExtension('Autodesk.FullScreen')
    }

    const columns: GridColDef[] = [
        { field: 'nome_elemento', headerName: 'elemento', flex:1 , 'align': 'center', 'headerAlign': 'center', minWidth: 100},
        { field: 'pieces_in_forge', headerName: 'Nº Peças BIM', flex:1 , 'align': 'center', 'headerAlign': 'center', minWidth: 100},
        { field: 'pieces_in_system', headerName: 'Nº Peças Sistema', flex:1 , 'align': 'center', 'headerAlign': 'center', minWidth: 100},
        { field: 'link', headerName: 'Link', flex:1 , minWidth: 100, 'align': 'center', 'headerAlign': 'center', renderCell: (params) => (
            params.row.forgePieces.length > 0 ? <OnClickLink text={"Destacar Peças em BIM"} onClick={paintPiecesInBim} onClickParams={params.row.forgePieces}/> : <></>
        )},
        { field: 'status_bim', headerName: 'BIM', flex:1 , minWidth: 50, 'align': 'center', 'headerAlign': 'center', renderCell: (params) => (
            params.row.pieces_in_forge > 0 ? <span className='material-icons' style={{'color': 'green'}}>check_circle</span> : <span className='material-icons' style={{'color': 'red'}}>cancel</span>
        )},
        { field: 'status_sistema', headerName: 'Sistema', flex:1 , minWidth: 50, 'align': 'center', 'headerAlign': 'center', renderCell: (params) => (
            params.row.pieces_in_system > 0 ? <span className='material-icons' style={{'color': 'green'}}>check_circle</span> : <span className='material-icons' style={{'color': 'red'}}>cancel</span>
        )},
        { field: 'error', headerName: 'Erro', flex:1 , minWidth: 250, 'align': 'center', 'headerAlign': 'center'}
    ];

    const generateTemplate = () => {
        const geometriesDropDownList: string[] = elements.geometries.map((geometry: Geometry) => geometry.nome_tipo_peca);
        const shapesDropDrownList: string[] = elements.shapes.map((shape:Shape) => shape.nome_forma_secao!)
        const header: string[] = ['Nome do elemento', 'Forma', 'Tipo de Peça', 'b (cm)', 'h (cm)', 'c (m)', 'Nº de Peças Planejadas', 'Fck Desforma (Mpa)', 'Fck Içamento (Mpa)', 'Volume (m³)', 'Peso (Kg)', 'Peso do Aço (Kg)']
        let workbook = new Excel.Workbook();
        let worksheet = workbook.addWorksheet('sheet1');
        // Set font, size and style in title row.
        let headerRow = worksheet.addRow(header);
    
        // Cell Style : Fill and Border
        headerRow.eachCell((cell, i) => {
            cell.font = { size: 13, bold: true };
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
            cell.dataValidation = {
                type: 'list',
                allowBlank: false,
                operator: 'equal',
                formulae: ["\""+header[i-1]+"\""],
                showErrorMessage: true,
                errorStyle: 'error',
                errorTitle: 'Mudança de Título',
                error: 'As células do título não podem ser Alteradas!',
            }
        
        });
        // Add Data and Conditional Formatting
        const geometriesJoinedDropdownList = "\""+geometriesDropDownList.join(',')+"\"";
        const shapesJoinedDropdownList = "\""+shapesDropDrownList.join(',')+"\"";

        for(let i=2; i < rows.length + 2; i++){
            const cellNomeElemento = worksheet.getCell('A'+i)
            cellNomeElemento.value = rows[i - 2].nome_elemento;
            cellNomeElemento.dataValidation = {
                type: 'list',
                allowBlank: false,
                operator: 'equal',
                formulae: ["\""+rows[i - 2].nome_elemento+"\""],
                showErrorMessage: true,
                errorStyle: 'error',
                errorTitle: 'Valor Inválido',
                error: 'O nome do Elemento não pode ser Alterado!',
            }

            const cellNumPecas = worksheet.getCell('G'+i)
            cellNumPecas.value = rows[i - 2].pieces_in_forge;
            cellNumPecas.dataValidation = {
                type: 'list',
                allowBlank: false,
                operator: 'equal',
                formulae: ["\""+rows[i - 2].pieces_in_forge+"\""],
                showErrorMessage: true,
                errorStyle: 'error',
                errorTitle: 'Valor Inválido',
                error: 'O número de Peças Planejadas não pode ser Alterado!',
            }

            const cellShape = worksheet.getCell('B'+i)
            cellShape.dataValidation = {
                type: 'list',
                allowBlank: false,
                operator: 'equal',
                formulae: [shapesJoinedDropdownList],
                showErrorMessage: true,
                errorStyle: 'error',
                errorTitle: 'Valor Inválido',
                error: `Os valores devem ser: ${shapesJoinedDropdownList}`,
            };

            const cellGeometry = worksheet.getCell('C'+i)
            cellGeometry.dataValidation = {
                type: 'list',
                allowBlank: false,
                operator: 'equal',
                formulae: [geometriesJoinedDropdownList],
                showErrorMessage: true,
                errorStyle: 'error',
                errorTitle: 'Valor Inválido',
                error: `Os valores devem ser: ${geometriesJoinedDropdownList}`,
            };

            const validateNumberColumns = ['D', 'E', 'F', 'H', 'I', 'J', 'K', 'L']
            for (let index in validateNumberColumns){
                worksheet.getCell(validateNumberColumns[index]+i).dataValidation = {
                    type: 'decimal',
                    allowBlank: false,
                    operator: 'greaterThan',
                    formulae: [0],
                    showErrorMessage: true,
                    errorStyle: 'error',
                    errorTitle: 'Valor Inválido',
                    error: `O valor devem ser maior do que 0`,
                };
            }

            const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']
            for (let index in columns){
                const cell = worksheet.getCell(columns[index]+i)
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                cell.protection = {'locked': false};
            }
        }
        const columnWidths = [20, 30, 30, 8, 8, 8, 24, 22, 22, 18, 18, 20];
        worksheet.columns.forEach(function (column, i) {
            column.width = columnWidths[i];
        });
        worksheet.protect("123456", {'selectUnlockedCells': true});
        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, `Template Cadastro Elementos - ${nomeObraModelo}.xlsx`, {autoBom: false});
            setOnTemplateDownloaded(true)
        });
    }

    const formElemento = (values: any, mapShapes: Map<string, string>, mapGeometries: Map<string, string>) => {
        const date = getFormatDate();
        const element: Element = {
            uid: crypto.randomUUID(),
            nome_elemento: values[1].toString(),
            forma: values[2] === undefined || mapShapes.get(values[2].toString()) === undefined ? '' : mapShapes.get(values[2].toString())!,
            tipo: values[3] === undefined || mapGeometries.get(values[3].toString()) === undefined ? '' : mapGeometries.get(values[3].toString())!,
            b: (values[4] === undefined ? '' : values[4]).toString(),
            h: (values[5] === undefined ? '' : values[5]).toString(),
            c: (values[6] === undefined ? '' : values[6]).toString(),
            numMax: (values[7] === undefined ? '' : values[7]).toString(),
            fckdesf: (values[8] === undefined ? '' : values[8]).toString(),
            fckic: (values[9] === undefined ? '' : values[9]).toString(),
            volume: (values[10] === undefined ? '' : values[10]).toString(),
            peso: (values[11] === undefined ? '' : values[11]).toString(),
            taxaaco: (values[12] === undefined ? '' : values[12]).toString(),
            status: 'ativo',
            date: date,
            numPecas: '0',
            numPlanejado: '0',
            obra: constructionUid,
        }
        if(Object.values(element).includes('')) throw Error(`Valor inválido no elemento ${values[1].toString()} em ${Object.keys(element)[Array.from(Object.values(element)).indexOf('')]}`)
        return element;
    }

    const onExcelUploaded = (event:ChangeEvent<HTMLInputElement>) => {
        const file: File | undefined = event?.target.files![0];
        if(file === undefined) return;
        const wb = new Excel.Workbook();
        const reader = new FileReader()
        const mapShapes: Map<string, string> = new Map<string, string>(elements.shapes.map((shape: Shape) => {return [shape.nome_forma_secao!, shape.uid]}))
        const mapGeometries: Map<string, string> = new Map<string, string>(elements.geometries.map((geometry: Geometry) => {return [geometry.nome_tipo_peca, geometry.uid]}))
        const elementsArray:Element[] = []

        reader.readAsArrayBuffer(file)
        reader.onload = () => {
            const buffer = reader.result;
            wb.xlsx.load(buffer as ArrayBuffer)
            .then(workbook => {
                console.log(workbook, 'workbook instance')
                setIsLoading(true)
                workbook.eachSheet((sheet, id) => { if(sheet.name === 'sheet1') sheet.eachRow((row, rowIndex) => {
                    if(rowIndex > 1){
                        elementsArray.push(formElemento(row.values, mapShapes, mapGeometries));
                    }
                })})

                return elementsArray;
            })
            .then(elementsApi().createMultipleElements)
            .then(() => {
                setIsLoading(false)
                swal({
                    icon: 'success',
                    title: 'Sincronização Realizada com Sucesso!',
                })
                .then(() => {
                    window.location.reload();
                })

            })
            .catch(err => {
                if(err instanceof Error){
                    event.target.value = '';
                    setIsLoading(false);
                    swal("Oops!", err.message, "error");
                }
            })
        }
    }

    return (
        <>
            <div style={{height: 'calc(60vh + 3em)'}}>
                <div id="header">
                    <img className="logo" src="https://cdn.autodesk.io/logo/black/stacked.png" alt="Autodesk Platform Services"/>
                    <span className="title">{nomeObraModelo}</span>
                    <select name="models" id="models" style={{"display": "none"}}></select>
                    <button id="upload" title="Upload New Model" style={{"display": "none"}}>Upload</button>
                    <input style={{"display": "none"}} type="file" id="input"/>
                </div>
                <div id="preview"></div>
                <div id="overlay"></div>
            </div>
            <Section text={"Sincronização " + nomeObraModelo}>
                <ForgeSyncronizeTable columnRows={columns} tableRows={rows}/>
            </Section>

            {success ? 
                <form onSubmit={handleSubmit(generateTemplate)}>
                    <SubmitButton text="Baixar Template"/>
                    {onTemplateDownloaded ? 
                        <Section text='Adicionar Modelo BIM'>
                            <InputSection style={{'marginTop': '20px', 'marginBottom': '50px'}}>
                                <input type="file" accept=".xlsx" onChange={onExcelUploaded}/>
                            </InputSection>
                        </Section>
                        : <></>
                    }
                </form> 
                : <></>
            }
        </>
    );


}

export default ViewerDashboard;