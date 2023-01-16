import React, { useEffect, useState } from "react";
import { ApiAuthToken, ApiModel } from "../../types/Forge";
import { forgeApi } from "../../apis/ForgeApi";
import {
    ForgeViewerElement,
    ForgeViewerElementsDict,
    ForgeViewerPiece,
    PropertyDatabase,
} from "../../types/ForgeViewer";
import { Element, getElementsInterface } from "../../types/Element";
import swal from "sweetalert";
import { useForm } from "react-hook-form";
import { ForgePiece } from "./Dashboard";

declare global {
    interface Window {
        onModelSelectedTimeout: any;
    }
}

export const DashboardBIM = ({
    urn,
    nomeObraModelo,
    constructionUid,
    mapElementsByName,
    setIsLoading,
    pieces,
}: {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    mapElementsByName: Map<string, Element>;
    constructionUid: string;
    urn?: string;
    nomeObraModelo?: string;
    pieces: Map<string, ForgePiece>;
}) => {
    //class Viewer extends React.Component<ViewerState, ViewerState> {
    const [viewer, setViewer] = useState<Autodesk.Viewing.GuiViewer3D>();
    const [rows, setRows] = useState<ForgeViewerElement[]>([]);
    const [success, setSuccess] = useState(false);
    const [onTemplateDownloaded, setOnTemplateDownloaded] = useState(false);
    const { handleSubmit } = useForm();

    useEffect(() => {
        if (window.Autodesk) {
            loadCss(
                "https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.css"
            );

            loadScript(
                "https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.js"
            ).onload = () => {
                onScriptLoaded();
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urn]);

    const getAccessToken = (
        callback: ((accessToken: string, expires: number) => void) | undefined
    ) => {
        try {
            forgeApi()
                .getToken()
                .then((response) => {
                    const responseBody: ApiAuthToken = response;
                    if (callback === undefined) throw Error();
                    callback(
                        responseBody.access_token,
                        responseBody.expires_in
                    );
                });
        } catch (err) {
            alert(
                "Could not obtain access token. See the console for more details."
            );
            console.error(err);
        }
    };

    const initViewer = (container: HTMLElement) => {
        return new Promise<Autodesk.Viewing.GuiViewer3D>(function (
            resolve,
            reject
        ) {
            Autodesk.Viewing.Initializer({ getAccessToken }, function () {
                const config = {
                    extensions: ["Autodesk.DocumentBrowser"],
                };
                const viewer = new Autodesk.Viewing.GuiViewer3D(
                    container,
                    config
                );
                viewer.start();
                viewer.setTheme("light-theme");
                resolve(viewer);
            });
        });
    };

    const loadModel = (viewer: Autodesk.Viewing.GuiViewer3D, urn: string) => {
        return new Promise(function (resolve, reject) {
            function onDocumentLoadSuccess(doc: Autodesk.Viewing.Document) {
                resolve(
                    viewer.loadDocumentNode(
                        doc,
                        doc.getRoot().getDefaultGeometry()
                    )
                );
            }
            function onDocumentLoadFailure(
                code: Autodesk.Viewing.ErrorCodes,
                message: string,
                errors: any[]
            ) {
                reject({ code, message, errors });
            }
            viewer.setLightPreset(0);
            Autodesk.Viewing.Document.load(
                "urn:" + urn,
                onDocumentLoadSuccess,
                onDocumentLoadFailure
            );
        });
    };

    const onModelSelected = async (
        viewer: Autodesk.Viewing.GuiViewer3D,
        urn: string
    ) => {
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
                        case "n/a":
                            showNotification(`Model has not been translated.`);
                            break;
                        case "inprogress":
                            showNotification(
                                `Model is being translated (${response.progress})...`
                            );
                            window.onModelSelectedTimeout = setTimeout(
                                onModelSelected,
                                5000,
                                viewer,
                                urn
                            );
                            break;
                        case "failed":
                            const messages = response.messages
                                .map((msg: any) => `<li>${msg}</li>`)
                                .join("");
                            showNotification(
                                `Translation failed. <ul>${messages}</ul>`
                            );
                            break;
                        default:
                            clearNotification();
                            loadModel(viewer, urn);
                            break;
                    }
                });
        } catch (err) {
            alert("Could not load model. See the console for more details.");
            console.error(err);
        }
    };

    const setupModelSelection = async (
        viewer: Autodesk.Viewing.GuiViewer3D,
        selectedUrn: string
    ) => {
        const dropdown = document.getElementById("models") as HTMLSelectElement;
        dropdown.innerHTML = "";
        try {
            forgeApi()
                .getModels()
                .then(async (models) => {
                    dropdown.innerHTML = models
                        .filter((model: ApiModel) => model.urn === urn)
                        .map(
                            (model: ApiModel) =>
                                `<option value=${model.urn} ${
                                    model.urn === selectedUrn ? "selected" : ""
                                }>${model.name}</option>`
                        )
                        .join("\n");
                    dropdown.onchange = async () => {
                        onModelSelected(viewer, dropdown.value);
                    };
                    if (dropdown.value) {
                        onModelSelected(viewer, dropdown.value);
                    }
                });
        } catch (err) {
            if (err instanceof Error) {
                console.log(err.stack);
            }
            alert("Could not list models. See the console for more details.");
            console.error(err);
        }
    };

    const showNotification = (message: string) => {
        const overlay = document.getElementById("overlay") as HTMLElement;
        overlay.innerHTML = `<div class="notification">${message}</div>`;
        overlay.style.display = "flex";
    };

    const clearNotification = () => {
        const overlay = document.getElementById("overlay") as HTMLElement;
        overlay.innerHTML = "";
        overlay.style.display = "none";
    };

    const loadCss = (src: string): HTMLLinkElement => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = src;
        link.type = "text/css";
        document.head.appendChild(link);
        return link;
    };

    const loadScript = (src: string): HTMLScriptElement => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = src;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
        return script;
    };

    function userFunction(pdb: PropertyDatabase) {
        const has_trace = (string: string) =>
            string.search(/-/) === -1 ? false : true;
        const split_by_trace = (string: string) =>
            string.substring(0, string.search(/-/));
        const view_elementos: ForgeViewerElementsDict = {};
        const all_elementos: Map<number, string> = new Map();

        const pushForgePiece = (peca: ForgeViewerPiece) => {
            if (view_elementos[peca.nome_elemento] === undefined) {
                const forgeViewerElement: ForgeViewerElement = {
                    index: Object.values(view_elementos).length,
                    forgePieces: [],
                    nome_elemento: peca.nome_elemento,
                    pieces_in_forge: 0,
                };
                view_elementos[peca.nome_elemento] = forgeViewerElement;
            }
            view_elementos[peca.nome_elemento].forgePieces.push(peca);
            view_elementos[peca.nome_elemento].pieces_in_forge =
                view_elementos[peca.nome_elemento].forgePieces.length;
        };

        pdb.enumObjects((dbId: any) => {
            const peca = pdb.getObjectProperties(dbId, "Elemento");
            if (
                peca != null &&
                peca !== undefined &&
                peca.properties[0].displayValue !== ""
            ) {
                all_elementos.set(dbId, peca.properties[0].displayValue);
            }
            if (
                peca != null &&
                peca !== undefined &&
                has_trace(peca.properties[0].displayValue)
            ) {
                const forgePiece: ForgeViewerPiece = {
                    dbId: dbId,
                    nome_elemento: split_by_trace(
                        peca.properties[0].displayValue
                    ),
                    nome_peca: peca.properties[0].displayValue,
                };
                pushForgePiece(forgePiece);
            }
        });

        // console.log(view_elementos);
        return { view_elementos: view_elementos, all_elementos: all_elementos };
    }

    const syncronizeModel = (viewer: Autodesk.Viewing.GuiViewer3D) => {
        if (viewer === undefined) return;
        console.log(userFunction);
        viewer.model
            .getPropertyDb()
            .executeUserFunction(userFunction)
            .then(
                (_retValue: {
                    view_elementos: ForgeViewerElementsDict;
                    all_elementos: Map<number, string>;
                }) => {
                    const view_elementos = _retValue.view_elementos;
                    const all_elementos = _retValue.all_elementos;
                    Array.from(all_elementos.entries()).map(
                        ([dbId, nome_peca]: [number, string]) => {
                            console.log(nome_peca);
                            if (pieces.get(nome_peca) !== undefined)
                                pieces.get(nome_peca)!.dbId = dbId;
                            else {
                                const color = new THREE.Color(0xffffff);

                                viewer?.model.setThemingColor(
                                    dbId,
                                    new THREE.Vector4(
                                        color.r,
                                        color.g,
                                        color.b,
                                        1.0
                                    )
                                );
                            }
                        }
                    );
                    pieces.forEach((piece) => {
                        if (piece.dbId === undefined) return;
                        if (piece.pieceInfo === undefined) {
                            const color = new THREE.Color(0xffffff);

                            viewer?.model.setThemingColor(
                                piece.dbId,
                                new THREE.Vector4(
                                    color.r,
                                    color.g,
                                    color.b,
                                    1.0
                                )
                            );
                            return;
                        }
                        const etapas: string[] = [
                            "armacao",
                            "forma",
                            "armacaoForma",
                            "concretagem",
                            "liberacao",
                            "carga",
                            "descarga",
                            "montagem",
                            "completo",
                        ];
                        const etapaIndex = etapas.indexOf(
                            piece.pieceInfo.etapa_atual
                        );
                        if (etapaIndex === -1) return;
                        let color: any;
                        if (etapaIndex <= 4) color = new THREE.Color(0x0ea8d4);
                        else if (etapaIndex === 5)
                            color = new THREE.Color(0x0e10ec);
                        else if (etapaIndex === 6)
                            color = new THREE.Color(0xfefe00);
                        else if (etapaIndex === 7)
                            color = new THREE.Color(0x00f700);
                        else if (etapaIndex === 8)
                            color = new THREE.Color(0x96a1a2);

                        // const color = new THREE.Color(etapaColor);
                        viewer?.model.setThemingColor(
                            piece.dbId,
                            new THREE.Vector4(color.r, color.g, color.b, 1.0)
                        );
                    });
                    viewer.refresh(true);
                }
            )
            // viewer.refresh(true)
            .catch(function (_err) {
                //alert("Selecione uma Obra com o modelo BIM traduzido para prosseguir.");
                console.log(_err);
            });
    };

    const onScriptLoaded = () => {
        const preview = document.getElementById("preview") as HTMLElement;
        initViewer(preview).then((viewer: Autodesk.Viewing.GuiViewer3D) => {
            const urn = window.location.hash?.substring(1);
            setupModelSelection(viewer, urn);
            // setupModelUpload(viewer);
            setViewer(viewer);
            viewer.addEventListener(
                Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
                () => {
                    syncronizeModel(viewer);
                }
            );
        });
    };

    const paintPiecesInBim = (forgePieces: ForgeViewerPiece[]) => {
        console.log("paintPieciesInBIM");
        rows.flatMap((piece) => piece.forgePieces).forEach((piece) => {
            viewer?.model.setThemingColor(
                piece.dbId,
                new THREE.Vector4(0, 0.5, 0, 0.5)
            );
        });
        forgePieces.forEach((piece: ForgeViewerPiece) => {
            const color = new THREE.Color(0xffff00);
            viewer?.model.setThemingColor(
                piece.dbId,
                new THREE.Vector4(color.r, color.g, color.b, 0.5)
            );
        });
        viewer?.refresh(true);
        viewer?.loadExtension("Autodesk.FullScreen").then((extension) => {
            extension.activate("FullScreen");
        });
        viewer?.unloadExtension("Autodesk.FullScreen");
    };

    return (
        <>
            <div style={{ height: "53vh", width: "43%" }}>
                <div id="header">
                    <img
                        className="logo"
                        src="https://cdn.autodesk.io/logo/black/stacked.png"
                        alt="Autodesk Platform Services"
                    />
                    <span className="title">{nomeObraModelo}</span>
                    <select
                        name="models"
                        id="models"
                        style={{ display: "none" }}
                    ></select>
                    <button
                        id="upload"
                        title="Upload New Model"
                        style={{ display: "none" }}
                    >
                        Upload
                    </button>
                    <input style={{ display: "none" }} type="file" id="input" />
                </div>
                <div id="preview"></div>
                <div id="overlay"></div>
            </div>
        </>
    );
};
