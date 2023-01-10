import React, { Dispatch, SetStateAction, useContext, useEffect } from "react"
import { Section } from "../../components/forms/Section";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import swal from 'sweetalert';
import { GridColDef, GridColumnHeaderParams, GridValidRowModel } from "@mui/x-data-grid";
import { CheckboxInput } from "../../components/Button/CheckboxInput";
import { ReportTable } from "../../components/Tables/ReportTable";
import { Piece, PiecesApiGetInterface } from "../../types/Piece";
import { ErrorsApiGetInterface } from "../../types/Erros";
import { ReportLink } from "../../components/Links/ReportLink";
import * as XLSX from 'xlsx'


export const ReportGeneralPage = ({pieces, errors, setPiece} : {pieces:PiecesApiGetInterface | undefined, errors: ErrorsApiGetInterface | undefined, setPiece: Dispatch<SetStateAction<Piece | undefined>>}) => {

    const auth = useContext(AuthContext);
    const rows = (pieces === undefined) ? [] : Object.values(pieces).flatMap((element:any) => Object.values(element)).flatMap((rfid:any) => Object.values(rfid)).map((row:any, i:number) => {return {'index': i, 'check': false, ...row}})

    useEffect(() => {
        auth.setPath("Home → Relatórios → Relatório Geral")
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
        { field: 'obra', headerName: 'Obra', 'align': 'center', 'headerAlign': 'center', flex:2 , minWidth: 200, valueGetter: (params) => {return (params.row.construction !== undefined) ? params.row.construction.nome_obra : ''}},
        { field: 'tipo', headerName: 'Tipo', 'align': 'center', 'headerAlign': 'center', flex:1 , minWidth: 100, valueGetter: (params) => {return (params.row.element !== undefined) ? params.row.element.geometry.nome_tipo_peca : ''}}, 
        { field: 'elemento', headerName: 'Elemento', 'align': 'center', 'headerAlign': 'center', flex:1 , minWidth: 100, valueGetter: (params) => {return (params.row.element !== undefined) ? params.row.element.nome_elemento : ''}}, 
        { field: 'secao', headerName: 'Seção', 'align': 'center', 'headerAlign': 'center', flex:1 , minWidth: 150, valueGetter: (params) => {return (params.row.element !== undefined) ? params.row.element.b + "cm x " + params.row.element.h + "cm" : ''}},
        { field: 'c', headerName: 'Comprimento', 'align': 'center', 'headerAlign': 'center', flex:2 , minWidth: 150, valueGetter: (params) => {return (params.row.element !== undefined) ? params.row.element.c + "m" : ''}},
        { field: 'erros', headerName: 'Nº Erros', 'align': 'center', 'headerAlign': 'center', flex:1 , minWidth: 120 , valueGetter: (params) => {return (errors !== undefined && errors[params.row.obra] !== undefined && errors[params.row.obra][params.row.tag] !== undefined) ? Array.from(Object.values(errors[params.row.obra][params.row.tag])).length : "0"}, 'cellClassName': (params) => {return (params.value !== "0") ? "text-red" : ""}},
        { field: 'armacao', headerName: 'Armação', 'align': 'center', 'headerAlign': 'center', flex:2 , minWidth: 180 , valueGetter: (params) => {return (params.row.etapas.armacao !== undefined) ? params.row.etapas.armacao.creation : '-'}},
        { field: 'forma', headerName: 'Forma', 'align': 'center', 'headerAlign': 'center', flex:2 , minWidth: 180 , valueGetter: (params) => {return (params.row.etapas.forma !== undefined) ? params.row.etapas.forma.creation : '-'}},
        { field: 'armacaoForma', headerName: 'Armacao c/ Forma', 'align': 'center', 'headerAlign': 'center', flex:2 , minWidth: 180 , valueGetter: (params) => {return (params.row.etapas.armacaoForma !== undefined) ? params.row.etapas.armacaoForma.creation.substring(0, 10) : '-'}},
        { field: 'concretagem', headerName: 'Concretagem', 'align': 'center', 'headerAlign': 'center', flex:2 , minWidth: 180 , valueGetter: (params) => {return (params.row.etapas.concretagem !== undefined) ? params.row.etapas.concretagem.creation : '-'}},
        { field: 'liberacao', headerName: 'Liberação Final', 'align': 'center', 'headerAlign': 'center', flex:2 , minWidth: 180 , valueGetter: (params) => {return (params.row.etapas.liberacao !== undefined) ? params.row.etapas.liberacao.creation : '-'}},
        { field: 'carga', headerName: 'Carga', 'align': 'center', 'headerAlign': 'center', flex:2 , minWidth: 180 , valueGetter: (params) => {return (params.row.etapas.carga !== undefined) ? params.row.etapas.carga.creation : '-'}},
        { field: 'descarga', headerName: 'Descarga', 'align': 'center', 'headerAlign': 'center', flex:2 , minWidth: 180 , valueGetter: (params) => {return (params.row.etapas.descarga !== undefined) ? params.row.etapas.descarga.creation : '-'}},
        { field: 'montagem', headerName: 'Montagem', 'align': 'center', 'headerAlign': 'center', flex:2 , minWidth: 180 , valueGetter: (params) => {return (params.row.etapas.montagem !== undefined) ? params.row.etapas.montagem.creation : '-'}},
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

    const generateExcel = () => {
        if(rows === undefined) return swal("Oops!", "Selecione uma Obra", "error");
        const checkedPieces = rows!.filter((piece: Piece) => piece.check);
        if(checkedPieces.length === 0 ) return swal("Oops!", "Nenhuma Peça foi Selecionada", "error");
        const xlsRows: any = rows.filter((piece:Piece) => piece.check).map((piece:Piece) => {
            return{
                'Nome da Peça': piece.nome_peca,
                'RFID': piece.tag,
                'Etapa Atual': piece.pretty_etapa_atual,
                'Obra': (piece.construction !== undefined) ? piece.construction.nome_obra : '',
                'Tipo': (piece.element !== undefined && piece.element !== undefined && piece.element.geometry !== undefined) ? piece.element.geometry.nome_tipo_peca : '',
                'Elemento': (piece.element !== undefined) ? piece.element.nome_elemento : '',
                'Seção': (piece.element !== undefined) ? piece.element.b + "cm x " + piece.element.h + "cm" : '',
                'Comprimento': (piece.element !== undefined) ? piece.element.c + "m" : '',
                'Nº Erros': (errors !== undefined && errors[piece.obra] !== undefined && errors[piece.obra][piece.tag] !== undefined) ? Array.from(Object.values(errors[piece.obra][piece.tag])).length : "0",
                'Armação': (piece.etapas.armacao !== undefined) ? piece.etapas.armacao.creation : '-',
                'Forma': (piece.etapas.forma !== undefined) ? piece.etapas.forma.creation : '-',
                'Armação com Forma': (piece.etapas.armacaoForma !== undefined) ? piece.etapas.armacaoForma.creation : '-',
                'Concretagem': (piece.etapas.concretagem !== undefined) ? piece.etapas.concretagem.creation : '-',
                'Liberacao Final': (piece.etapas.liberacao !== undefined) ? piece.etapas.liberacao.creation : '-',
                'Carga': (piece.etapas.carga !== undefined) ? piece.etapas.carga.creation : '-',
                'Descarga': (piece.etapas.descarga !== undefined) ? piece.etapas.descarga.creation : '-',
                'Montagem': (piece.etapas.montagem !== undefined) ? piece.etapas.montagem.creation : '-',
            }
        })
        let wb = XLSX.utils.book_new(), ws = XLSX.utils.json_to_sheet(xlsRows);
        XLSX.utils.book_append_sheet(wb, ws, "Relatório Inspeção");
        XLSX.writeFile(wb, "Relatório Geral.xlsx")

    }

    const generatePDF = () => {}

    const pageContent = () => {
        return (
            <>
                <Section text='Selecionar Peças'>
                    <ReportTable columnRows={columns} tableRows={rows} onCheckClick={OnCheckClick} generatePDF={generatePDF} generateExcel={generateExcel} hidePdf={true}/>
                </Section>
            </>
        )
    }

    return(
        pageContent()
    )
} 