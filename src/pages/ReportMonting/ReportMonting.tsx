import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { Container } from "../../components/Container/Container";
import { Main } from "../../components/Container/Main";
import { SubPageButton } from "../../components/Subpage/SubPageButton";
import { SubPageContainer } from "../../components/Subpage/SubPageContainer";
import { SubPageSelect } from "../../components/Subpage/SubPageSelect";
import { BoardScore } from "./BoardScore";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import LoadingPage from "../LoadingPage/LoadingPage";
import {
    Board,
    Card,
    CardBody,
    CardHeader,
    Column,
    DivProgressbar,
    DivProgressbarText,
    DoubleColumn,
    Icon,
    Panel,
    TableLeft,
    TableMiddle,
    Title,
} from "./MontingStyles";
import { piecesApi } from "../../apis/PiecesApi";
import { Construction } from "../../types/Construction";
import { Piece } from "../../types/Piece";
import { Element, getElementsInterface } from "../../types/Element";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { ErrorsApiGetInterface } from "../../types/Erros";
import { errosApi } from "../../apis/ErrosApi";
import { ApiFirebaseBIM, RVT } from "../../types/Forge";
import { forgeApi } from "../../apis/ForgeApi";
import { ReportMontingBIM } from "./ReportMontingBIM";
import { GetPlanningInterface } from "../../types/Planning";
import { planningApi } from "../../apis/PlanningApi";
import { InputDateFieldState } from "../../components/forms/InputDateFieldState";
import { PlanningBIM } from "./PlannigBIM";
import { elementsApi } from "../../apis/ElementsApi";

type DashboardData = {
    progresso: string;
    previsto: number;
    realizado: number;
    realizar: number;
    transportado: number;
    montado: number;
    aco_kg: number;
    concreto_kg: number;
    aco_perc: number;
    concreto_perc: number;
};

export interface ForgePiece {
    id: string;
    nome_peca: string;
    dbId: number | undefined;
    pieceInfo?: Piece;
}

export interface Row {
    id: string;
    nome_peca: string;
    obra: string;
    startProducao: Date | undefined;
    endProducao: Date | undefined;
    startTransporte: Date | undefined;
    endTransporte: Date | undefined;
    startMontagem: Date | undefined;
    endMontagem: Date | undefined;
    dbId: number | undefined;
}

ChartJS.register(ArcElement, Tooltip, Legend);

export const ReportMonting = () => {
    const auth = useContext(AuthContext);
    const [urn, setUrn] = useState("");
    const [nomeObraModelo, setNomeObraModelo] = useState("");
    const [construction, setConstruction] = useState<Construction>();
    const [planning, setPlanning] = useState<GetPlanningInterface>({});
    const [rows, setRows] = useState<Row[]>([]);
    const [progressBarLeft, setProgressBarLeft] = useState("0.00%");
    const [progressBarRight, setProgressBarRight] = useState("0.00%");

    const [referenceDate, setReferenceDate] = useState(new Date());
    const [objects, setObjects] = useState<getElementsInterface>({
        elements: [],
        shapes: [],
        geometries: [],
        constructions: [],
    });

    const [pieces, setPieces] = useState<Map<string, ForgePiece>>(new Map());
    const [isLoading, setIsLoading] = useState(true);
    const [mapPieces, setMapPieces] = useState<Map<string, Piece>>();
    const [mapElements, setMapElements] = useState<Map<string, Element>>();
    const [selectedConstruction, setSelectedConstruction] = useState<
        Construction | undefined
    >();
    const [mapConstructions, setMapConstructions] = useState<
        Map<string, Construction>
    >(new Map());
    const [listBIM, setListBIM] = useState<ApiFirebaseBIM>({});

    const [dashboardData, setDashboardData] = useState<DashboardData>({
        progresso: "0.00%",
        previsto: 0,
        realizado: 0,
        realizar: 0,
        transportado: 0,
        montado: 0,
        aco_kg: 0,
        concreto_kg: 0,
        aco_perc: 0,
        concreto_perc: 0,
    });

    useEffect(() => {
        auth.setPath("Home → DashBoard");

        piecesApi()
            .getPiecesMapByName()
            .then((map) => {
                setMapPieces(map.pieces);
                setMapElements(map.elements);
                setMapConstructions(map.constructions);
            })
            .then(elementsApi().getElements)
            .then(setObjects)
            .then(forgeApi().getListBIM)
            .then(setListBIM)
            .then(planningApi().getPlanning)
            .then(setPlanning)
            .then(() => {
                setIsLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const constructionSelection =
        mapElements !== undefined
            ? Array.from(
                  new Set(
                      Array.from(mapElements.values()).map(
                          (element: Element) => element.construction!
                      )
                  )
              ).map((construction: Construction) => {
                  return [construction.uid, construction.nome_obra];
              })
            : [];

    const onOptionSelected = (event: ChangeEvent<HTMLSelectElement>) => {
        const construction: Construction = mapConstructions.get(
            event.target.value
        )!;
        setSelectedConstruction(construction);
        const constructionUid = event.target.value;
        const data = {
            progresso: "0.00%",
            previsto: 0,
            realizado: 0,
            realizar: 0,
            transportado: 0,
            montado: 0,
            aco_kg: 0,
            concreto_kg: 0,
            aco_perc: 0,
            concreto_perc: 0,
        };
        const array_realizado = ["carga", "descarga", "montagem", "completo"];
        const array_transportado = ["montagem", "completo"];
        const array_finalizado_armacao = [
            "forma",
            "armacaoForma",
            "concretagem",
            "liberacao",
            "carga",
            "descarga",
            "montagem",
            "completo",
        ];
        const array_finalizado_concretagem = [
            "liberacao",
            "carga",
            "descarga",
            "montagem",
            "completo",
        ];

        Array.from(mapElements!.values())
            .filter((element: Element) => element.obra === constructionUid)
            .forEach((element) => {
                data.previsto += parseInt(element.numMax);
            });

        Array.from(mapPieces!.values())
            .filter((piece: Piece) => piece.obra === constructionUid)
            .forEach((piece: Piece) => {
                if (array_realizado.includes(piece.etapa_atual))
                    data.realizado++;
                if (array_transportado.includes(piece.etapa_atual))
                    data.transportado++;
                if (array_finalizado_armacao.includes(piece.etapa_atual))
                    data.aco_kg += parseInt(piece.element!.taxaaco);
                if (array_finalizado_concretagem.includes(piece.etapa_atual))
                    data.concreto_kg += parseInt(piece.element!.volume);
                if (piece.etapa_atual === "completo") data.montado++;
            });
        data.realizar = data.previsto - data.realizado;
        data.progresso =
            ((data.montado * 100) / data.previsto).toFixed(2) + "%";
        let total_aco = 0;
        let total_concreto = 0;

        Array.from(mapElements!.values())
            .filter((element: Element) => element.obra === constructionUid)
            .forEach((element) => {
                let pecas_previstas = parseInt(element.numMax);
                total_aco += pecas_previstas * parseInt(element.taxaaco);
                total_concreto += pecas_previstas * parseInt(element.volume);
            });

        data.aco_perc = parseFloat(
            ((data.aco_kg * 100) / total_aco).toFixed(2)
        );
        data.concreto_perc = parseFloat(
            ((data.concreto_kg * 100) / total_concreto).toFixed(2)
        );

        setDashboardData(data);
        const plannedPiecesMap: Map<string, ForgePiece> = new Map();
        Array.from(mapElements!.values())
            .filter((element: Element) => element.obra === construction.uid)
            .forEach((element: Element) => {
                for (let i = 1; i <= parseInt(element.numMax); i++) {
                    const nome_peca = element.nome_elemento + "-" + i;
                    plannedPiecesMap.set(nome_peca, {
                        id: element.nome_elemento + "-" + i,
                        nome_peca: nome_peca,
                        dbId: undefined,
                        pieceInfo: mapPieces?.get(nome_peca),
                    });
                }
            });
        setPieces(plannedPiecesMap);
        const newRows: Row[] = [];
        objects.elements
            .filter((element: Element) => element.obra === construction.uid)
            .forEach((element: Element) => {
                for (let i = 1; i <= parseInt(element.numMax); i++)
                    newRows.push({
                        id: element.nome_elemento + "-" + i,
                        obra: construction!.uid,
                        nome_peca: element.nome_elemento + "-" + i,
                        startProducao:
                            planning?.[construction.uid]?.["producao"]?.[
                                element.nome_elemento + "-" + i
                            ]?.["start"] === undefined
                                ? undefined
                                : new Date(
                                      planning[construction.uid]["producao"][
                                          element.nome_elemento + "-" + i
                                      ]["start"]
                                  ),
                        endProducao:
                            planning?.[construction.uid]?.["producao"]?.[
                                element.nome_elemento + "-" + i
                            ]?.["end"] === undefined
                                ? undefined
                                : new Date(
                                      planning[construction.uid]["producao"][
                                          element.nome_elemento + "-" + i
                                      ]["end"]
                                  ),
                        startTransporte:
                            planning?.[construction.uid]?.["transporte"]?.[
                                element.nome_elemento + "-" + i
                            ]?.["start"] === undefined
                                ? undefined
                                : new Date(
                                      planning[construction.uid]["transporte"][
                                          element.nome_elemento + "-" + i
                                      ]["start"]
                                  ),
                        endTransporte:
                            planning?.[construction.uid]?.["transporte"]?.[
                                element.nome_elemento + "-" + i
                            ]?.["end"] === undefined
                                ? undefined
                                : new Date(
                                      planning[construction.uid]["transporte"][
                                          element.nome_elemento + "-" + i
                                      ]["end"]
                                  ),
                        startMontagem:
                            planning?.[construction.uid]?.["montagem"]?.[
                                element.nome_elemento + "-" + i
                            ]?.["start"] === undefined
                                ? undefined
                                : new Date(
                                      planning[construction.uid]["montagem"][
                                          element.nome_elemento + "-" + i
                                      ]["start"]
                                  ),
                        endMontagem:
                            planning?.[construction.uid]?.["montagem"]?.[
                                element.nome_elemento + "-" + i
                            ]?.["end"] === undefined
                                ? undefined
                                : new Date(
                                      planning[construction.uid]["montagem"][
                                          element.nome_elemento + "-" + i
                                      ]["end"]
                                  ),
                        dbId: undefined,
                    });
            });
        setRows(newRows);
        if (listBIM[event.target.value] === undefined) {
            setUrn("");
            return;
        }
        Object.values(listBIM[event.target.value]).forEach((rvt: RVT) => {
            if (rvt.status === "ativo") {
                setNomeObraModelo(
                    `Modelo BIM - ${
                        event.target.options[event.target.selectedIndex].text
                    } - ${rvt.nome_rvt}`
                );
                setUrn(rvt.urn!);
            }
        });
    };

    const pageContent = () => {
        return (
            <Container>
                <LoadingPage loading={isLoading} />
                <Main>
                    <SubPageContainer>
                        <SubPageButton
                            text="Acompanhamento Geral da Obra"
                            selected={true}
                            fontSize="adjust-font"
                        />
                        <SubPageSelect
                            onOptionSelected={onOptionSelected}
                            array={constructionSelection}
                            label="Obra"
                        />
                    </SubPageContainer>
                </Main>

                <Board>
                    <BoardScore
                        text={"PREVISTO"}
                        number={dashboardData.previsto}
                        icon={"assignment"}
                    />
                    <BoardScore
                        text={"REALIZADO"}
                        number={dashboardData.realizado}
                        icon={"warehouse"}
                    />
                    <BoardScore
                        text={"A REALIZAR"}
                        number={dashboardData.realizar}
                        icon={"construction"}
                    />
                    <BoardScore
                        text={"TRANSPORTADO"}
                        number={dashboardData.transportado}
                        icon={"local_shipping"}
                    />
                    <BoardScore
                        text={"MONTADO"}
                        number={dashboardData.montado}
                        icon={"business"}
                    />
                </Board>
                <InputDateFieldState
                    label="Data de Referência"
                    name="reference_date"
                    value={referenceDate}
                    setValue={setReferenceDate}
                    style={{ maxWidth: "100%" }}
                />

                {/* <div id="card-progress" style={{ marginTop: "20px" }}>
                    <div
                        className="card-header-progress"
                        style={{ fontWeight: "bold", fontSize: "90%" }}
                    >
                        ( % ) Progresso de montagem:
                    </div>
                    <div className="card-body" style={{ marginTop: "5px" }}>
                        <div className="progress align-items-center">
                            <DivProgressbarText>
                                {dashboardData.progresso}
                            </DivProgressbarText>
                            <DivProgressbar
                                className="progress-bar"
                                role="progressbar"
                                aria-valuenow={0}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                style={{ width: dashboardData.progresso }}
                            ></DivProgressbar>
                        </div>
                    </div>
                </div> */}

                <Panel>
                    <Column className="left">
                        <Card>
                            <CardHeader>
                                <Icon className="material-icons">
                                    view_in_ar
                                </Icon>
                                <Title>Modelo 3D - Planejado</Title>
                            </CardHeader>
                            <CardBody className="mounting left">
                                {urn === "" ? (
                                    <></>
                                ) : (
                                    <PlanningBIM
                                        setIsLoading={setIsLoading}
                                        urn={urn}
                                        nomeObraModelo={nomeObraModelo}
                                        elements={objects}
                                        constructionUid={
                                            construction === undefined
                                                ? ""
                                                : construction.uid
                                        }
                                        tableRows={rows}
                                        referenceDate={referenceDate}
                                        progressBar={progressBarLeft}
                                        mapElementsByName={
                                            new Map<string, Element>(
                                                objects.elements
                                                    .filter(
                                                        (element: Element) =>
                                                            construction !==
                                                                undefined &&
                                                            element.obra ===
                                                                construction.uid
                                                    )
                                                    .map((element: Element) => {
                                                        return [
                                                            element.nome_elemento,
                                                            element,
                                                        ];
                                                    })
                                            )
                                        }
                                    />
                                )}
                                <div
                                    id="card-progress"
                                    style={{
                                        marginTop: "50px",
                                    }}
                                >
                                    <div
                                        className="card-header-progress"
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "90%",
                                            marginLeft: "10px",
                                        }}
                                    >
                                        ( % ) Progresso de Produção:
                                    </div>
                                    <div
                                        className="card-body"
                                        style={{ marginTop: "5px" }}
                                    >
                                        <div className="progress align-items-center">
                                            <DivProgressbarText>
                                                {progressBarLeft}
                                            </DivProgressbarText>
                                            <DivProgressbar
                                                className="progress-bar"
                                                role="progressbar"
                                                aria-valuenow={0}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                                style={{
                                                    width: progressBarLeft,
                                                }}
                                            ></DivProgressbar>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    id="card-progress"
                                    style={{
                                        marginTop: "20px",
                                    }}
                                >
                                    <div
                                        className="card-header-progress"
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "90%",
                                            marginLeft: "10px",
                                        }}
                                    >
                                        ( % ) Progresso de Transporte:
                                    </div>
                                    <div
                                        className="card-body"
                                        style={{ marginTop: "5px" }}
                                    >
                                        <div className="progress align-items-center">
                                            <DivProgressbarText>
                                                {progressBarLeft}
                                            </DivProgressbarText>
                                            <DivProgressbar
                                                className="progress-bar"
                                                role="progressbar"
                                                aria-valuenow={0}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                                style={{
                                                    width: progressBarLeft,
                                                }}
                                            ></DivProgressbar>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    id="card-progress"
                                    style={{
                                        marginTop: "20px",
                                    }}
                                >
                                    <div
                                        className="card-header-progress"
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "90%",
                                            marginLeft: "10px",
                                        }}
                                    >
                                        ( % ) Progresso de montagem:
                                    </div>
                                    <div
                                        className="card-body"
                                        style={{ marginTop: "5px" }}
                                    >
                                        <div className="progress align-items-center">
                                            <DivProgressbarText>
                                                {progressBarLeft}
                                            </DivProgressbarText>
                                            <DivProgressbar
                                                className="progress-bar"
                                                role="progressbar"
                                                aria-valuenow={0}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                                style={{
                                                    width: progressBarLeft,
                                                }}
                                            ></DivProgressbar>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Column>
                    <Column className="right">
                        <Card>
                            <CardHeader>
                                <Icon className="material-icons">
                                    view_in_ar
                                </Icon>
                                <Title>Modelo 3D - Executado</Title>
                            </CardHeader>
                            <CardBody className="mounting right">
                                {urn === "" || urn === undefined ? (
                                    <></>
                                ) : (
                                    <ReportMontingBIM
                                        setIsLoading={setIsLoading}
                                        tableRows={rows}
                                        referenceDate={referenceDate}
                                        urn={urn}
                                        nomeObraModelo={nomeObraModelo}
                                        constructionUid={
                                            construction === undefined
                                                ? ""
                                                : construction.uid
                                        }
                                        pieces={pieces}
                                        mapElementsByName={
                                            new Map<string, Element>(
                                                Array.from(
                                                    mapElements!.values()
                                                )
                                                    .filter(
                                                        (element: Element) =>
                                                            construction !==
                                                                undefined &&
                                                            element.obra ===
                                                                construction.uid
                                                    )
                                                    .map((element: Element) => {
                                                        return [
                                                            element.nome_elemento,
                                                            element,
                                                        ];
                                                    })
                                            )
                                        }
                                    />
                                )}
                                <div
                                    id="card-progress"
                                    style={{
                                        marginTop: "50px",
                                    }}
                                >
                                    <div
                                        className="card-header-progress"
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "90%",
                                            marginLeft: "10px",
                                        }}
                                    >
                                        ( % ) Progresso de Produção - Executado:
                                    </div>
                                    <div
                                        className="card-body"
                                        style={{ marginTop: "5px" }}
                                    >
                                        <div className="progress align-items-center">
                                            <DivProgressbarText>
                                                {progressBarLeft}
                                            </DivProgressbarText>
                                            <DivProgressbar
                                                className="progress-bar"
                                                role="progressbar"
                                                aria-valuenow={0}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                                style={{
                                                    width: progressBarLeft,
                                                }}
                                            ></DivProgressbar>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    id="card-progress"
                                    style={{
                                        marginTop: "20px",
                                    }}
                                >
                                    <div
                                        className="card-header-progress"
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "90%",
                                            marginLeft: "10px",
                                        }}
                                    >
                                        ( % ) Progresso de Transporte -
                                        Executado:
                                    </div>
                                    <div
                                        className="card-body"
                                        style={{ marginTop: "5px" }}
                                    >
                                        <div className="progress align-items-center">
                                            <DivProgressbarText>
                                                {progressBarLeft}
                                            </DivProgressbarText>
                                            <DivProgressbar
                                                className="progress-bar"
                                                role="progressbar"
                                                aria-valuenow={0}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                                style={{
                                                    width: progressBarLeft,
                                                }}
                                            ></DivProgressbar>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    id="card-progress"
                                    style={{
                                        marginTop: "20px",
                                    }}
                                >
                                    <div
                                        className="card-header-progress"
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "90%",
                                            marginLeft: "10px",
                                        }}
                                    >
                                        ( % ) Progresso de montagem - Executado:
                                    </div>
                                    <div
                                        className="card-body"
                                        style={{ marginTop: "5px" }}
                                    >
                                        <div className="progress align-items-center">
                                            <DivProgressbarText>
                                                {progressBarLeft}
                                            </DivProgressbarText>
                                            <DivProgressbar
                                                className="progress-bar"
                                                role="progressbar"
                                                aria-valuenow={0}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                                style={{
                                                    width: progressBarLeft,
                                                }}
                                            ></DivProgressbar>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Column>
                </Panel>
            </Container>
        );
    };

    return pageContent();
};
