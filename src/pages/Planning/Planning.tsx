import React, { useContext, useEffect, useState } from "react";
import { Container } from "../../components/Container/Container";
import { SubPageButton } from "../../components/Subpage/SubPageButton";
import { SubPageContainer } from "../../components/Subpage/SubPageContainer";
import { Main } from "../../components/Container/Main";
import { Construction } from "../../types/Construction";
import LoadingPage from "../LoadingPage/LoadingPage";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { Element, getElementsInterface } from "../../types/Element";
import { elementsApi } from "../../apis/ElementsApi";
import { InputSection } from "../../components/forms/InputSection";
import { InputSelectFieldEditSelector } from "../../components/forms/InputSelectFieldEditSelector";
import { Section } from "../../components/forms/Section";
import { ColumnSection, DoubleColumnSection } from "./styles";
import { PlanningTable } from "../../components/Tables/PlanningTable";
import {
    GridCellEditCommitParams,
    GridCellEditStopReasons,
    GridColDef,
    MuiEvent,
} from "@mui/x-data-grid";
import { forgeApi } from "../../apis/ForgeApi";
import { ApiFirebaseBIM, RVT } from "../../types/Forge";
import { PlanningBIM } from "./PlannigBIM";
import { InputDateFieldState } from "../../components/forms/InputDateFieldState";
import {
    GetPlanningInterface,
    PlanningActivity,
    PossibleActivities,
} from "../../types/Planning";
import { planningApi } from "../../apis/PlanningApi";

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

export const Planning = () => {
    const auth = useContext(AuthContext);
    const [urn, setUrn] = useState("");
    const [activity, setActivity] = useState<PossibleActivities>("producao");
    const [planning, setPlanning] = useState<GetPlanningInterface>({});
    const [nomeObraModelo, setNomeObraModelo] = useState("");
    const [rows, setRows] = useState<Row[]>([]);
    const [referenceDate, setReferenceDate] = useState(new Date());

    const [listBIM, setListBIM] = useState<ApiFirebaseBIM>({});
    const [construction, setConstruction] = useState<Construction>();
    const [objects, setObjects] = useState<getElementsInterface>({
        elements: [],
        shapes: [],
        geometries: [],
        constructions: [],
    });
    const [isLoading, setIsLoading] = useState(true);

    const columnsProducao: GridColDef[] = [
        {
            field: "nome_peca",
            headerName: "Nome da Peça",
            flex: 1,
            minWidth: 100,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "startProducao",
            headerName: "Início Prod.",
            flex: 1,
            minWidth: 100,
            align: "center",
            headerAlign: "center",
            editable: true,
            type: "date",
        },
        {
            field: "endProducao",
            headerName: "Término Prod.",
            flex: 1,
            minWidth: 100,
            align: "center",
            headerAlign: "center",
            editable: true,
            type: "date",
        },
    ];

    const columnsTransporte: GridColDef[] = [
        {
            field: "nome_peca",
            headerName: "Nome da Peça",
            flex: 1,
            minWidth: 100,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "startTransporte",
            headerName: "Início Transp.",
            flex: 1,
            minWidth: 100,
            align: "center",
            headerAlign: "center",
            editable: true,
            type: "date",
        },
        {
            field: "endTransporte",
            headerName: "Término Transp.",
            flex: 1,
            minWidth: 100,
            align: "center",
            headerAlign: "center",
            editable: true,
            type: "date",
        },
    ];

    const columnsMontagem: GridColDef[] = [
        {
            field: "nome_peca",
            headerName: "Nome da Peça",
            flex: 1,
            minWidth: 100,
            align: "center",
            headerAlign: "center",
        },
        {
            field: "startProducao",
            headerName: "Início Mont.",
            flex: 1,
            minWidth: 100,
            align: "center",
            headerAlign: "center",
            editable: true,
            type: "date",
        },
        {
            field: "endProducao",
            headerName: "Término Mont.",
            flex: 1,
            minWidth: 100,
            align: "center",
            headerAlign: "center",
            editable: true,
            type: "date",
        },
    ];
    const [columns, setColumns] = useState<GridColDef[]>(columnsProducao);

    useEffect(() => {
        auth.setPath("Home → Programaçåo → Planejamento");
        elementsApi()
            .getElements()
            .then(setObjects)
            .then(forgeApi().getListBIM)
            .then(setListBIM)
            .then(planningApi().getPlanning)
            .then(setPlanning)
            .then(() => {
                setIsLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urn]);

    const onActivitySelected = (event: React.MouseEvent<HTMLElement>) => {
        const target = event.target as HTMLElement;
        const id = target.id as PossibleActivities;
        setActivity(id);
        if (id === "producao") setColumns(columnsProducao);
        else if (id === "transporte") setColumns(columnsTransporte);
        else if (id === "montagem") setColumns(columnsMontagem);
    };

    const onOptionSelected = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const getConstruction = (uid: string) => {
            return Array.from(
                Object.values(objects.constructions!).filter(
                    (construction: Construction) => construction.uid === uid
                )
            )[0];
        };
        const construction: Construction = getConstruction(event.target.value);
        setConstruction(construction);
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

    const constructionSelection =
        objects.elements === undefined
            ? []
            : Array.from(
                  new Set(
                      Object.values(objects.elements).map(
                          (element: Element) => element.construction
                      )
                  )
              ).map((construction: Construction | undefined) => {
                  return [construction!.uid, construction!.nome_obra];
              });

    const handleRowEditCommit = React.useCallback(
        (params: any) => {
            if (params.value === undefined) return;
            setReferenceDate(params.value);
            params.row[params.field] = params.value;
            setIsLoading(true);
            planningApi()
                .uploadPlanning({
                    activity: activity,
                    obra: params.row.obra,
                    nome_peca: params.row.nome_peca,
                    startOrEnd: params.field.startsWith("start")
                        ? "start"
                        : "end",
                    date: params.value,
                })
                .then(() => {
                    setIsLoading(false);
                })
                .catch(() => {
                    setIsLoading(false);
                });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const pageContent = () => {
        return (
            <Container>
                <LoadingPage loading={isLoading} />
                <Main>
                    <SubPageContainer>
                        <SubPageButton
                            text="Produção"
                            path="/programacao/planejamento"
                            selected={activity === "producao"}
                            onClick={onActivitySelected}
                            id="producao"
                        />
                        <SubPageButton
                            text="Transporte"
                            path="/programacao/planejamento"
                            selected={activity === "transporte"}
                            onClick={onActivitySelected}
                            id="transporte"
                        />
                        <SubPageButton
                            text="Montagem"
                            path="/programacao/planejamento"
                            selected={activity === "montagem"}
                            onClick={onActivitySelected}
                            id="montagem"
                        />
                    </SubPageContainer>
                    <DoubleColumnSection>
                        <ColumnSection className="left">
                            <InputSelectFieldEditSelector
                                array={constructionSelection}
                                label="Obra"
                                onOptionSelected={onOptionSelected}
                                style={{ maxWidth: "100%" }}
                            />
                            <PlanningTable
                                columnRows={columns}
                                tableRows={rows}
                                callback={handleRowEditCommit}
                            />
                        </ColumnSection>
                        <ColumnSection className="right">
                            <InputDateFieldState
                                label="Data de Referência"
                                name="reference_date"
                                value={referenceDate}
                                setValue={setReferenceDate}
                                style={{ maxWidth: "100%" }}
                            />
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
                        </ColumnSection>
                    </DoubleColumnSection>
                </Main>
            </Container>
        );
    };

    return pageContent();
};
