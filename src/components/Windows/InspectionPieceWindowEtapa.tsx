import { GridColDef } from '@mui/x-data-grid';
import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/Auth/AuthContext';
import { ChecklistHistoryType } from '../../types/Checklist';
import { Error, ErrorsApiGetInterface } from '../../types/Erros';
import { Etapa, Piece } from '../../types/Piece';
import { EtapasTable } from '../Tables/EtapasTable';


export const InspectionPieceWindowEtapa = ({etapa, etapa_atual, piece, checklistHistory, errors}:{etapa: Etapa | undefined, etapa_atual: string, piece: Piece | undefined, checklistHistory: ChecklistHistoryType | undefined, errors?: ErrorsApiGetInterface}) => {

    const auth = useContext(AuthContext);
    const mapOfUsers = new Map<string, string>(auth.usersNameMap.map((user: any) => {
        return [user[0], user[1]]
    }));

    const prettyEtapas: Map<string, string> = new Map([
        ["planejamento", "Planejamento"],
        ["cadastro", "Produção/Cadastro"],
        ["armacao", "Produção/Armação"],
        ["forma", "Produção/Forma"],
        ["armacaoForma", "Produção/Armação com Forma"],
        ["concretagem", "Produção/Concretagem"],
        ["liberacao", "Produção/Liberação Final"],
        ["carga", "Transporte/Carga"],
        ["descarga", "Transporte/Descarga"],
        ["montagem", "Montagem"],
    ])

    const columns: GridColDef[] = [
        { field: 'item', headerName: 'Item', flex:3},
        { field: 'status', headerName: 'Status', 'align': 'center', 'headerAlign': 'center', flex:1 , minWidth: 200},
        { field: 'descricao', headerName: 'Descrição', 'align': 'center', 'headerAlign': 'center', flex:2 , minWidth: 150},
        { field: 'solucao', headerName: 'Solução', 'align': 'center', 'headerAlign': 'center', flex:2 , minWidth: 200},
    ];

    const foundErrors: Error[] = (errors === undefined || piece === undefined || errors[piece.obra] === undefined || errors[piece.obra][piece.tag] === undefined) ? [] : Array.from(Object.values(errors[piece.obra][piece.tag])).filter((error: Error) => error.etapa_detectada === etapa_atual)

    const rows = () => {
        if(checklistHistory !== undefined && piece !== undefined){
            const items = checklistHistory[etapa_atual][piece.etapas[etapa_atual].checklist]
            if(items === undefined) return [];
            delete items.createdBy;
            delete items.creation;
            return Array.from(Object.values(items)).map((item: string, i: number) => {
                if(foundErrors.length === 0){
                    return {
                        'index': i,
                        'item': item,
                        'status': "conforme",
                        'descricao': "-",
                        'solucao': "-",
                    }
                }else{
                    const error: Error = foundErrors[0];
                    return {
                        'index': i,
                        'item': item,
                        'status': (error.status === "aberto") ? "Aberto" : "Solucionado",
                        'descricao': error.comentarios,
                        'solucao': (error.comentarios_solucao !== undefined) ? error.comentarios_solucao : "-",
                    }
                }
            })
        }else{
            return [];
        }
    }


    return(
        <div style={{'marginBottom': '3vh'}}>
            <h5>{prettyEtapas.get(etapa_atual)}</h5>
            <div className="row">       
                <p className="col-6">Inspetor: {(etapa === undefined || etapa.creation === undefined || mapOfUsers.get(etapa.creation) === undefined) ? " - " : mapOfUsers.get(etapa.creation)}</p>       
                <p className="col-6">Data: {etapa?.creation}</p>    
            </div>
            <EtapasTable columnRows={columns} tableRows={rows()}/>
        </div>
        
    )
}