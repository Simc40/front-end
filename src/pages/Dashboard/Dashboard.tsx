import React, { ChangeEvent, useContext, useEffect, useState } from "react"
import { Container } from "../../components/Container/Container";
import { Main } from "../../components/Container/Main";
import { SubPageButton } from "../../components/Subpage/SubPageButton";
import { SubPageContainer } from "../../components/Subpage/SubPageContainer";
import { SubPageSelect } from "../../components/Subpage/SubPageSelect";
import { BoardScore } from "./BoardScore";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import LoadingPage from "../LoadingPage/LoadingPage";
import { Board, Card, CardBody, CardHeader, Column, DivProgressbar, DivProgressbarText, DoubleColumn, Icon, Panel, TableLeft, TableMiddle, Title } from "./DashboardStyles";
import { piecesApi } from "../../apis/PiecesApi";
import { Construction } from "../../types/Construction";
import { Piece } from "../../types/Piece";
import { Element } from "../../types/Element";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ErrorsApiGetInterface } from "../../types/Erros";
import { errosApi } from "../../apis/ErrosApi";
import { ApiFirebaseBIM, RVT } from "../../types/Forge";
import { forgeApi } from "../../apis/ForgeApi";

type DashboardData = {
    "progresso": string,
    "previsto": number,
    "realizado": number,
    "realizar": number,
    "transportado": number,
    "montado": number,
    "aco_kg": number,
    "concreto_kg": number,
    "aco_perc": number,
    "concreto_perc": number,
}

ChartJS.register(ArcElement, Tooltip, Legend);

export const Dashboard = () => {

    const auth = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState<ErrorsApiGetInterface>({});
    const [mapPieces, setMapPieces] = useState<Map<string, Piece>>();
    const [mapElements, setMapElements] = useState<Map<string, Element>>();
    const [selectedConstruction, setSelectedConstruction] = useState<Construction | undefined>()
    const [mapConstructions, setMapConstructions] = useState<Map<string, Construction>>(new Map());
    const [listBIM, setListBIM] = useState<ApiFirebaseBIM>({});
    const [chartData, setChartData] = useState<{ labels: string[]; datasets: { label: string; data: number[]; backgroundColor: string[]; borderColor: string[]; borderWidth: number; }[];}>({
        labels: [],
        datasets: [
          {
            label: 'Dataset 1',
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
          },
        ],
      });

    const [dashboardData, setDashboardData] = useState<DashboardData>({
        "progresso": '0.00%',
        "previsto": 0,
        "realizado": 0,
        "realizar": 0,
        "transportado": 0,
        "montado": 0,
        "aco_kg": 0,
        "concreto_kg": 0,
        "aco_perc": 0,
        "concreto_perc": 0,
    });

    useEffect(() => {
        auth.setPath("Home → DashBoard")

        errosApi()
        .getErros()
        .then(setErrors)
        .then(piecesApi().getPiecesMap)
        .then((map) =>{
            setMapPieces(map.pieces);
            setMapElements(map.elements);
            setMapConstructions(map.constructions)
        })
        .then(forgeApi().getListBIM)
        .then(setListBIM)
        .then(() => {
            setIsLoading(false);
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const constructionSelection = (mapElements !== undefined) ? Array.from(new Set(Array.from(mapElements.values()).map((element:Element) => element.construction!))).map((construction:Construction) => {return [construction.uid, construction.nome_obra]}) : [];

    const onOptionSelected = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedConstruction(mapConstructions.get(event.target.value))
        const constructionUid = event.target.value;
        const data = {
            "progresso": '0.00%',
            "previsto": 0,
            "realizado": 0,
            "realizar": 0,
            "transportado": 0,
            "montado": 0,
            "aco_kg": 0,
            "concreto_kg": 0,
            "aco_perc": 0,
            "concreto_perc": 0,

        }
        const array_realizado = ["carga", "descarga", "montagem", "completo"]
        const array_transportado = ["montagem", "completo"]
        const array_finalizado_armacao = ["forma", "armacaoForma","concretagem","liberacao","carga","descarga","montagem", "completo"]
        const array_finalizado_concretagem = ["liberacao","carga","descarga","montagem", "completo"]

        Array.from(mapElements!.values()).filter((element:Element) => element.obra === constructionUid).forEach((element) => {
            data.previsto += parseInt(element.numMax)
        })

        Array.from(mapPieces!.values()).filter((piece: Piece) => piece.obra === constructionUid).forEach((piece: Piece) => {
            if(array_realizado.includes(piece.etapa_atual)) data.realizado++
            if(array_transportado.includes(piece.etapa_atual)) data.transportado++
            if(array_finalizado_armacao.includes(piece.etapa_atual)) data.aco_kg += parseInt(piece.element!.taxaaco)
            if(array_finalizado_concretagem.includes(piece.etapa_atual)) data.concreto_kg += parseInt(piece.element!.volume)
            if(piece.etapa_atual === "completo") data.montado++
        })
        data.realizar = data.previsto - data.realizado
        data.progresso = (data.montado*100/data.previsto).toFixed(2) + "%"
    
        let total_aco = 0
        let total_concreto = 0
    
        Array.from(mapElements!.values()).filter((element:Element) => element.obra === constructionUid).forEach((element) => {
            let pecas_previstas = parseInt(element.numMax)
            total_aco += pecas_previstas*parseInt(element.taxaaco)
            total_concreto += pecas_previstas*parseInt(element.volume)
        })

        data.aco_perc = parseFloat((data.aco_kg*100/total_aco).toFixed(2))
        data.concreto_perc = parseFloat((data.concreto_kg*100/total_concreto).toFixed(2))
        
        setDashboardData(data);
        modifyChart(constructionUid)
    }

    const modifyChart = (constructionUid: string) => {
        const label_etapas = [
            'Planejamento',
            'Cadastro',
            'Armação',
            'Forma',
            'Armação Forma',
            'Concretagem',
            'Liberação Final',
            'Carga',
            'Descarga',
            'Montagem'
        ]    
        
        const backgroundColor_etapas = [
            'rgba(107,35,142,0.8)', //Roxo
            'rgba(255,0,0,0.8)', //Red
            'rgba(255,165,0,0.8)', //Orange
            'rgba(128,128,128,0.8)', //Gray
            'rgba(255,255,0,0.8)', //Yellow
            'rgba(50,205,50,0.8)', //Green
            'rgba(0,0,255,0.8)', //Blue
            'rgba(255,0,255,0.8)', //Light Pink
            'rgba(255,20,147,0.8)', //Hard Pink
            'rgba(165,42,42,0.8)', //Brown
        ]

        const borderColor_etapas = [
            'rgba(107,35,142,1)', //Roxo
            'rgba(255,0,0,1)', //Red
            'rgba(255,165,0,1)', //Orange
            'rgba(128,128,128,1)', //Gray
            'rgba(255,255,0,1)', //Yellow
            'rgba(50,205,50,1)', //Green
            'rgba(0,0,255,1)', //Blue
            'rgba(255,0,255,1)', //Light Pink
            'rgba(255,20,147,1)', //Hard Pink
            'rgba(165,42,42,1)', //Brown
        ]
        const qnt_erros_por_etapa = [0,0,0,0,0,0,0,0,0,0]

        const label_empty = ['Sem Registro de Erro']
        const backgroundColor_empty = ['rgba(232, 228, 228, 0.8)']
        const borderColor_empty = ['rgba(232, 228, 228, 1)']
        const qnt_erros_por_etapa_empty = [1]

        const chartData = {
            labels: label_empty,
            datasets: [
            {
                label: 'Dataset 1',
                data: qnt_erros_por_etapa_empty,
                backgroundColor: backgroundColor_empty,
                borderColor: borderColor_empty,
                borderWidth: 1,
            },
            ],
        }

        if(errors === undefined) return setChartData(chartData);
        if(errors[constructionUid] === undefined) return setChartData(chartData);
        const errorsInConstruction:any = errors[constructionUid];
        const array_etapas = ["planejamento","cadastro","armacao", "forma", "armacaoForma","concretagem","liberacao","carga","descarga","montagem", "completo"]
        Array.from(Object.values(errorsInConstruction)).flatMap((tag:any) => Object.values(tag)).forEach((error: any) => {
            qnt_erros_por_etapa[array_etapas.indexOf(error.etapa_detectada)]++;
        })


        const chartDataFilled = {
            labels: label_etapas,
            datasets: [
            {
                label: 'Dataset 1',
                data: qnt_erros_por_etapa,
                backgroundColor: backgroundColor_etapas,
                borderColor: borderColor_etapas,
                borderWidth: 1,
            },
            ],
        }
        setChartData(chartDataFilled);
        // const backgroundColor = (list_erros === undefined) ? backgroundColor_empty : backgroundColor_etapas
        // const backgroundColor = (list_erros === undefined) ? backgroundColor_empty : backgroundColor_etapas
        // const data_num_erros = (list_erros === undefined) ? qnt_erros_por_etapa_empty : qnt_erros_por_etapa
        // const labels = (list_erros === undefined) ? label_empty : label_etapas

    }
    
    const pageContent = () => {
        return (
            <Container>
                <LoadingPage loading={isLoading}/>
                <Main>
                    <SubPageContainer>
                        <SubPageButton text="Acompanhamento Geral da Obra" selected={true} fontSize="adjust-font"/>
                        <SubPageSelect onOptionSelected={onOptionSelected} array={constructionSelection} label="Obra"/>
                    </SubPageContainer>
                </Main>

                <Board>
                    <BoardScore text={"PREVISTO"} number={dashboardData.previsto} icon={"assignment"}/>
                    <BoardScore text={"REALIZADO"} number={dashboardData.realizado} icon={"warehouse"}/>
                    <BoardScore text={"A REALIZAR"} number={dashboardData.realizar} icon={"construction"}/>
                    <BoardScore text={"TRANSPORTADO"} number={dashboardData.transportado} icon={"local_shipping"}/>
                    <BoardScore text={"MONTADO"} number={dashboardData.montado} icon={"business"}/>
                </Board>

                <div id="card-progress" style={{marginTop: '20px'}}>
                    <div className="card-header-progress" style={{fontWeight: 'bold', fontSize: '90%'}}>( % )  Progresso de montagem:</div>
                    <div className="card-body" style={{marginTop: '5px'}}>
                        <div className="progress align-items-center">
                            <DivProgressbarText>{dashboardData.progresso}</DivProgressbarText>
                            <DivProgressbar className="progress-bar" role="progressbar" aria-valuenow={0} aria-valuemin={0} aria-valuemax={100} style={{'width': dashboardData.progresso}}></DivProgressbar>
                        </div>
                    </div>
                </div>

                <Panel>
                    <DoubleColumn>
                        <Column className="left">
                            <Card className="top">
                                <CardHeader>
                                    <Icon className="material-icons">pie_chart</Icon>
                                    <Title>%Erro por Setor</Title>
                                </CardHeader>
                                <CardBody className="chartBody">
                                    <Doughnut
                                        data={chartData}
                                        updateMode={'active'}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: {
                                                    display: false,
                                                },
                                                title: {
                                                    display: false,
                                                },tooltip: {
                                                    callbacks: {
                                                      label: function(tooltipItem) {
                                                            return tooltipItem.label +": " + tooltipItem.formattedValue + "%"
                                                      }
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </CardBody>
                            </Card>
                            <Card className="bottom">
                                <CardHeader>
                                    <Icon className="material-icons">assignment</Icon>
                                    <Title>Consumo de aço e concreto</Title>
                                </CardHeader>
                                <CardBody>
                                    <div className="table-responsive">
                                        <TableLeft className="display table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th scope="col" colSpan={2}>Aço</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{dashboardData.aco_perc}%</td>
                                                    <td>{dashboardData.aco_kg}Kg</td>
                                                </tr>
                                            </tbody>
                                        </TableLeft>
                                        <TableLeft className="display table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th scope="col" colSpan={2}>Concreto</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{dashboardData.concreto_perc}%</td>
                                                    <td>{dashboardData.concreto_kg}m³</td>
                                                </tr>
                                            </tbody>
                                        </TableLeft>
                                    </div>
                                </CardBody>
                            </Card>
                        </Column>
                        <Column className="middle">
                            <Card>
                                <CardHeader>
                                    <Icon className="material-icons">error</Icon>
                                    <Title>Qt Erro por setor</Title>
                                </CardHeader>
                                <CardBody>
                                    <TableMiddle id="table-erros" className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th scope="col">Cor</th>
                                                <th scope="col">Setor</th>
                                                <th id="qnt" scope="col">Quantidade</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={{"background":"rgba(107,35,142,1)"}}></td>
                                                <td>Planejamento</td>
                                                <td id="planejamento">{(chartData.datasets[0].data.length <= 1) ? 0 : chartData.datasets[0].data[0]}</td>
                                            </tr>
                                            <tr>
                                                <td style={{"background":"rgba(255,0,0,1)"}}></td>
                                                <td>Cadastro</td>
                                                <td id="cadastro">{(chartData.datasets[0].data.length <= 1) ? 0 : chartData.datasets[0].data[1]}</td>
                                            </tr>
                                            <tr>
                                                <td style={{"background":"rgba(255,165,0,1)"}}></td>
                                                <td>Armação</td>
                                                <td id="armacao">{(chartData.datasets[0].data.length <= 1) ? 0 : chartData.datasets[0].data[2]}</td>
                                            </tr>
                                            <tr>
                                                <td style={{"background":"rgba(128,128,128,1)"}}></td>
                                                <td>Forma</td>
                                                <td id="forma">{(chartData.datasets[0].data.length <= 1) ? 0 : chartData.datasets[0].data[3]}</td>
                                            </tr>
                                            <tr>
                                                <td style={{"background":"rgba(255,255,0,1)"}}></td>
                                                <td>Armação com Forma</td>
                                                <td id="armacaoForma">{(chartData.datasets[0].data.length <= 1) ? 0 : chartData.datasets[0].data[4]}</td>
                                            </tr>
                                            <tr>
                                                <td style={{"background":"rgba(50,205,50,1)"}}></td>
                                                <td>Concretagem</td>
                                                <td id="concretagem">{(chartData.datasets[0].data.length <= 1) ? 0 : chartData.datasets[0].data[5]}</td>
                                            </tr>
                                            <tr>
                                                <td style={{"background":"rgba(0,0,255,1)"}}></td>
                                                <td>Liberação Final</td>
                                                <td id="liberacao">{(chartData.datasets[0].data.length <= 1) ? 0 : chartData.datasets[0].data[6]}</td>
                                            </tr>
                                            <tr>
                                                <td style={{"background":"rgba(255,0,255,1)"}}></td>
                                                <td>Carga</td>
                                                <td id="carga">{(chartData.datasets[0].data.length <= 1) ? 0 : chartData.datasets[0].data[7]}</td>
                                            </tr>
                                            <tr>
                                                <td style={{"background":"rgba(255,20,147,1)"}}></td>
                                                <td>Descarga</td>
                                                <td id="descarga">{(chartData.datasets[0].data.length <= 1) ? 0 : chartData.datasets[0].data[8]}</td>
                                            </tr>
                                            <tr id="last-of-table">
                                                <td style={{"background":"rgba(165,42,42,1)"}}></td>
                                                <td>Montagem</td>
                                                <td id="montagem">{(chartData.datasets[0].data.length <= 1) ? 0 : chartData.datasets[0].data[9]}</td>
                                            </tr>
                                        </tbody>
                                    </TableMiddle>
                                </CardBody>
                            </Card>
                        </Column>
                    </DoubleColumn>
                    <Column className="right">
                        <Card>
                            <CardHeader>
                                <Icon className="material-icons">view_in_ar</Icon>
                                <Title>Elemento 3D</Title>
                            </CardHeader>
                            <CardBody>
                                {/* {selectedConstruction === undefined || listBIM[selectedConstruction.uid] === undefined || Array.from(Object.values(listBIM[selectedConstruction.uid])).filter((value: RVT) => value.activity === )} */}
                            </CardBody>
                        </Card>
                    </Column>
                </Panel>

            </Container>
        )
    }

    return(
        pageContent()
    )
}