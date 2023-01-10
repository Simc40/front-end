import React, { Dispatch, SetStateAction } from 'react';
import styled from "styled-components";
import { ChecklistHistoryType } from '../../types/Checklist';
import { ErrorsApiGetInterface } from '../../types/Erros';
import { Piece } from '../../types/Piece';
import { InspectionPieceWindowEtapa } from './InspectionPieceWindowEtapa';

const CardBackground = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 20;
    height: 100vh;
    width: 100%;
    backdrop-filter: blur(5px);
`;

const Card = styled.div`
    margin-top: 60px;
    position: fixed;
    margin-left: 20%;
    width: 60%;
    z-index: 5;
    min-height: 50vh;
    max-height: 90vh;
`;

const CardHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 20px;
`;

const CardTitle = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const CardIcon = styled.span`
    margin-right: 10px;
`;


const CardBody = styled.div`
    overflow-y: scroll;
`;


export const InspectionPieceWindow = ({piece, setPiece, checklistHistory, errors}:{errors: ErrorsApiGetInterface, piece: Piece | undefined, setPiece: Dispatch<SetStateAction<Piece | undefined>>, checklistHistory: ChecklistHistoryType | undefined}) => {

    const etapas = ["cadastro","armacao", "forma", "armacaoForma", "concretagem", "liberacao", "carga", "descarga", "montagem", "completo"]
    const pieceEtapas = (piece === undefined) ? [] : etapas.filter((_etapa: string, index: number) => index < etapas.indexOf(piece.etapa_atual))

    return(
        <CardBackground style={{display: (piece === undefined) ? 'none' : 'block'}}>
            <Card className='card'>
                <CardHeader className='card-header'>
                    <CardTitle>
                        <CardIcon className="material-icons">extension</CardIcon>
                        <strong id="window-nome-peca">novo_elemento-1</strong>
                    </CardTitle>
                    <button type="button" className="btn btn-danger" onClick={() => setPiece(undefined)}>Fechar</button>
                </CardHeader>

                <CardBody className='card-body'>
                    {pieceEtapas.map((etapa: string, index: number) => {
                        return <InspectionPieceWindowEtapa key={index} etapa={piece?.etapas[etapa]} etapa_atual={etapa} piece={piece} checklistHistory={checklistHistory} errors={errors}/>
                    })}
                </CardBody>

            </Card>
        </CardBackground>
        
    )
}