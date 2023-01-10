import React, { ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useState } from "react"
import { Section } from "../../components/forms/Section";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import swal from 'sweetalert';
import { GridColDef, GridColumnHeaderParams, GridValidRowModel } from "@mui/x-data-grid";
import { CheckboxInput } from "../../components/Button/CheckboxInput";
import { ReportTable } from "../../components/Tables/ReportTable";
import { Piece, PiecesApiGetInterface } from "../../types/Piece";
import { InputSection } from "../../components/forms/InputSection";
import { InputSelectFieldEditSelector } from "../../components/forms/InputSelectFieldEditSelector";
import { Construction } from "../../types/Construction";
import { ErrorsApiGetInterface } from "../../types/Erros";
import { ReportLink } from "../../components/Links/ReportLink";
import * as XLSX from 'xlsx'
import { reportInspectionPDF } from "./ReportInspectionPDF";
import { ChecklistHistoryType } from "../../types/Checklist";


export const ReportInspectionPage = ({pieces, errors, setPiece, checklistHistory} : {checklistHistory: ChecklistHistoryType | undefined, pieces:PiecesApiGetInterface | undefined, errors: ErrorsApiGetInterface | undefined, setPiece: Dispatch<SetStateAction<Piece | undefined>>}) => {

    const auth = useContext(AuthContext);
    const [rows, setRows] = useState<Piece[]>();
    const [constructionName, setConstructionName] = useState('');

    useEffect(() => {
        auth.setPath("Home → Relatórios → Relatório de Inspeção")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns: GridColDef[] = [
        { field: 'nome_peca', headerName: 'Nome Peça', 'align': 'center', 'headerAlign': 'center', flex:1 , minWidth: 150, renderCell: (params) => (
            <ReportLink
                piece={params.row}
                setPiece={setPiece}
            />
        )},
        { field: 'tag', headerName: 'RFID', 'align': 'center', 'headerAlign': 'center', flex:1 , minWidth: 300},
        { field: 'pretty_etapa_atual', headerName: 'Etapa', 'align': 'center', 'headerAlign': 'center', flex:2 , minWidth: 200},
        { field: 'tipo', headerName: 'Tipo', 'align': 'center', 'headerAlign': 'center', flex:1 , minWidth: 100, valueGetter: (params) => {return (params.row.element !== undefined) ? params.row.element.geometry.nome_tipo_peca : ''}}, 
        { field: 'concretagem', headerName: 'Data Concretagem', 'align': 'center', 'headerAlign': 'center', flex:2 , minWidth: 180 , valueGetter: (params) => {return (params.row.etapas.concretagem !== undefined) ? params.row.etapas.concretagem.creation : '-'}},
        { field: 'erros', headerName: 'Nº Erros', 'align': 'center', 'headerAlign': 'center', flex:1 , minWidth: 120 , valueGetter: (params) => {return (errors !== undefined && errors[params.row.obra] !== undefined && errors[params.row.obra][params.row.tag] !== undefined) ? Array.from(Object.values(errors[params.row.obra][params.row.tag])).length : "0"}, 'cellClassName': (params) => {return (params.value !== "0") ? "text-red" : ""}},
        { field: 'secao', headerName: 'Seção', 'align': 'center', 'headerAlign': 'center', flex:1 , minWidth: 150, valueGetter: (params) => {return (params.row.element !== undefined) ? params.row.element.b + "cm x " + params.row.element.h + "cm" : ''}},
        { field: 'c', headerName: 'Comprimento', 'align': 'center', 'headerAlign': 'center', flex:2 , minWidth: 150, valueGetter: (params) => {return (params.row.element !== undefined) ? params.row.element.c + "m" : ''}},
        { field: 'check', 'disableColumnMenu': true, headerName: 'Marcar Todos', flex:1, 'align': 'center', 'headerAlign': 'center', minWidth: 120, renderCell: (params) => (
            <CheckboxInput
              checked={params.row.check}
              onChange={() => handleConfirmChange(params.row)}
            />
        )},
    ];

    function handleConfirmChange(params:any) {
        params.check = !params.check;
        return params;
    }

    const OnCheckClick = (event: GridColumnHeaderParams<any, GridValidRowModel, any>) => {
        console.log(event)
        if(event.field !== 'check') return;
        rows?.forEach((row: Piece) => {
            row.check = !row.check;
        })
        return event
    }

    const onOptionSelected = (event: ChangeEvent<HTMLSelectElement>) => {
        const piecesOnEvent:any = pieces![event.target.value];
        setConstructionName(event.target.selectedOptions[0].outerText)
        setRows(Object.values(piecesOnEvent).map((pieces:any) => {return Object.values(pieces)}).flatMap((piece:any) => piece).map((row:any, i:number) => {return {'index': i, 'check': false, ...row}}))

    }

    const generateExcel = () => {
        if(rows === undefined) return swal("Oops!", "Selecione uma Obra", "error");
        const checkedPieces = rows!.filter((piece: Piece) => piece.check);
        if(checkedPieces.length === 0 ) return swal("Oops!", "Nenhuma Peça foi Selecionada", "error");
        const xlsRows: any = rows.filter((piece:Piece) => piece.check).map((piece:Piece) => {
            return{
                'Nome da Peça': piece.nome_peca,
                'RFID': piece.tag,
                'Etapa Atual': piece.pretty_etapa_atual,
                'Tipo': (piece.element !== undefined && piece.element.geometry !== undefined) ? piece.element.geometry.nome_tipo_peca : '',
                'Data Concretagem': (piece.etapas.concretagem !== undefined) ? piece.etapas.concretagem.creation : '-',
                'Nº Erros': (errors !== undefined && errors[piece.obra] !== undefined && errors[piece.obra][piece.tag] !== undefined) ? Array.from(Object.values(errors[piece.obra][piece.tag])).length : "0",
                'Seção': (piece.element !== undefined) ? piece.element.b + "cm x " + piece.element.h + "cm" : '',
                'Comprimento': (piece.element !== undefined) ? piece.element.c + "m" : '',
            }
        })
        let wb = XLSX.utils.book_new(), ws = XLSX.utils.json_to_sheet(xlsRows);
        XLSX.utils.book_append_sheet(wb, ws, "Relatório Inspeção");
        XLSX.writeFile(wb, "Relatório de Inspeção - " + constructionName+".xlsx")

    }

    const generatePDF = () => {
        if(rows === undefined) return swal("Oops!", "Selecione uma Obra", "error");
        const checkedPieces = rows!.filter((piece: Piece) => piece.check);
        if(checkedPieces.length === 0 ) return swal("Oops!", "Nenhuma Peça foi Selecionada", "error");
        reportInspectionPDF(checkedPieces, auth, errors, constructionName, checklistHistory);
    }

    const constructionSelection = (pieces !== undefined) ? Array.from(new Set(Object.values(pieces).flatMap((element:any) => Object.values(element)).flatMap((rfid:any) => Object.values(rfid)).map((rfid:any) => rfid.construction))).map((construction:Construction) => {return [construction.uid, construction.nome_obra]}) : [];


    const pageContent = () => {
        return (
            <>
                <Section text="Selecionar Obra">
                    <InputSection>
                        <InputSelectFieldEditSelector array={constructionSelection} label="Obra" onOptionSelected={onOptionSelected} />
                    </InputSection>
                </Section>
                
                <Section text='Selecionar Peças'>
                    <ReportTable columnRows={columns} tableRows={rows} onCheckClick={OnCheckClick} generatePDF={generatePDF} generateExcel={generateExcel}/>
                </Section>
            </>
        )
    }

    return(
        pageContent()
    )
} 