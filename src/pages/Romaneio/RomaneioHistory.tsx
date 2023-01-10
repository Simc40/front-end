import React, { useContext, useEffect } from "react"
import { Section } from "../../components/forms/Section";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { GridColDef, GridColumnHeaderParams, GridValidRowModel } from "@mui/x-data-grid";
import { RomaneioTable } from "../../components/Tables/RomaneioTable";
import { CheckboxInput } from "../../components/Button/CheckboxInput";
import { RomaneioCarga } from "../../types/RomaneioCarga";
import { CircleCheckBox } from "../../components/Button/CircleCheckbox";
import { generateRomaneioReport } from "./RomaneioPDF";

export const RomaneioHistory = ({cargas} : {cargas:RomaneioCarga[] | undefined}) => {

    const auth = useContext(AuthContext);
    console.log(cargas)

    useEffect(() => {
        auth.setPath("Home → Gerenciamento → Logística → Romaneio")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns: GridColDef[] = [
        { field: 'romaneio_carga', headerName: 'Nº Carga', 'align': 'center', 'headerAlign': 'center', flex:1 , minWidth: 100},
        { field: 'A', headerName: 'A', 'align': 'center', 'headerAlign': 'center', flex:1 , minWidth: 50, renderCell: (params) => (
            <CircleCheckBox
              checked={params.row.data_carga !== undefined}
            />
        )},
        { field: 'B', headerName: 'B', 'align': 'center', 'headerAlign': 'center', flex:1 , minWidth: 50, renderCell: (params) => (
            <CircleCheckBox
              checked={params.row.data_transporte !== undefined}
            />
        )},
        { field: 'C', headerName: 'C', 'align': 'center', 'headerAlign': 'center', flex:1 , minWidth: 50, renderCell: (params) => (
            <CircleCheckBox
              checked={params.row.data_descarga !== undefined}
            />
        )},
        { field: 'data_prev', headerName: 'Data Prev.', 'align': 'center', 'headerAlign': 'center', flex:2 , minWidth: 150},
        { field: 'qnt_pecas', headerName: 'Quant. Peças', 'align': 'center', 'headerAlign': 'center', flex:1 , minWidth: 120 , valueGetter: (params) => {return (params.row.pecas !== undefined) ? Array.from(Object.values(params.row.pecas)).length : '0'}},
        { field: 'transportadora', headerName: 'Transportadora', 'align': 'center', 'headerAlign': 'center', flex:2 , minWidth: 150, valueGetter: (params) => {return (params.row.transportator !== undefined) ? params.row.transportator.nome_empresa : ''}},
        { field: 'obra', headerName: 'Destino', 'align': 'center', 'headerAlign': 'center', flex:2 , minWidth: 150, valueGetter: (params) => {return (params.row.construction !== undefined) ? params.row.construction.nome_obra : ''}},
        { field: 'check', 'disableColumnMenu': true, headerName: 'Check', flex:1, 'align': 'center', 'headerAlign': 'center', minWidth: 100, renderCell: (params) => (
            <CheckboxInput
              checked={params.row.check}
              onChange={() => handleConfirmChange(params.row)}
            />
        )},
    ];

    function handleConfirmChange(params:any) {
        params.row.check = !params.row.check;
        return params;
    }

    const OnCheckClick = (event: GridColumnHeaderParams<any, GridValidRowModel, any>) => {
        console.log(event)
        if(event.field !== 'check') return;
        cargas?.forEach((row: RomaneioCarga) => {
            row.check = !row.check;
        })
        return event
    }

    cargas?.sort((a, b) => a.romaneio_carga > b.romaneio_carga ? 1 : -1)

    const pageContent = () => {
        return (
            <>
                <Section text='Selecionar Cargas'>
                    <RomaneioTable columnRows={columns} tableRows={cargas} onCheckClick={OnCheckClick} onCellClick={undefined} generatePDF={() => {if(cargas !== undefined) generateRomaneioReport(cargas.filter((carga) => carga.check), auth)}}/>
                </Section>
            </>
        )
    }

    return(
        pageContent()
    )
} 