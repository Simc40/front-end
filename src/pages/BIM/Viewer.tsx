import React, { useEffect, useState } from 'react';
import { ApiAuthToken, ApiModel } from '../../types/Forge';
import './main.scss';
import { forgeApi } from '../../apis/ForgeApi';


declare global {
    interface Window {
        onModelSelectedTimeout:any;
    }
}

const Viewer = ({urn, nomeObraModelo} : {urn?: string, nomeObraModelo?:string}) => {//class Viewer extends React.Component<ViewerState, ViewerState> {
    const [viewer, setViewer] = useState<Autodesk.Viewing.GuiViewer3D>();

    useEffect(() => {
        if(window.Autodesk) { 
            loadCss('https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.css');         

            loadScript('https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.js') 
            .onload = () => {
                // console.log("componentDidMount onload")
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
                // console.log(callback)
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
                // console.log("getModelStatus")
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

    const onScriptLoaded = () => {
        const preview = document.getElementById('preview') as HTMLElement;
        initViewer(preview)
        .then((viewer: Autodesk.Viewing.GuiViewer3D) => {
            // console.log("then initViewer")
            const urn = window.location.hash?.substring(1);
            setupModelSelection(viewer, urn);
            // setupModelUpload(viewer);
            return viewer;
        })
        .then(setViewer)
    }

    return (
        <>
            <div id="header">
                <img className="logo" src="https://cdn.autodesk.io/logo/black/stacked.png" alt="Autodesk Platform Services"/>
                <span className="title">{nomeObraModelo}</span>
                <select name="models" id="models" style={{"display": "none"}}></select>
                <button id="upload" title="Upload New Model" style={{"display": "none"}}>Upload</button>
                <input style={{"display": "none"}} type="file" id="input"/>
            </div>
            <div id="preview"></div>
            <div id="overlay"></div>
        </>
    );


}

export default Viewer;