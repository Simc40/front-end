import { DataGrid, ptBR, GridRowsProp, GridColDef, GridValidRowModel, GridColumnHeaderParams, GridFooter, GridFooterContainer } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from 'react';
import styled from "styled-components";

const DataGridContent = styled.div`
    width: 100%;
    height: 80vh;
    margin-top: 20px;

    .MuiTablePagination-root p{
        margin-top: auto;
    }

    .super-app-theme--true{
        background: rgba(0,128,0,0.1)!important;
    }

    .super-app-theme--odd{
        background: rgba(128, 128, 128, 0.1);
    }

    .super-app-theme--even{
        background: rgba(255,255,255,1);
    }

    .Mui-selected{
        background: rgba(0, 0, 255, 0.1)!important;
    }

    .MuiDataGrid-row:hover{
        background: rgba(128, 128, 128, 0.3)!important;
    }

    .text-red{
        color: red;
        font-weight: bold;
    }
`;

const CardTitle = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 0.5em;

    &: hover{
        cursor: pointer;
        padding: 7px;
        background: rgba(128, 128, 128, 0.2);

    }

    &.hide{
        visibility: collapse;
    }
`;

const CardIcon = styled.span`
    margin-right: 10px;
`;

export const ReportTable = ({columnRows, tableRows, callback, onCheckClick, generatePDF, generateExcel, hidePdf} : {hidePdf?:boolean, generatePDF: () => void, generateExcel:() => void, columnRows: any,tableRows:any, callback?:any, onCheckClick?: (event: GridColumnHeaderParams<any, GridValidRowModel, any>) => GridColumnHeaderParams<any, GridValidRowModel, any> | undefined}) => {

    const columns: GridColDef[] = columnRows;
    const rows: GridRowsProp = (tableRows === undefined) ? [] : Array.from(Object.values(tableRows));

    const theme = createTheme(
        {
            palette: {
            primary: { main: '#1976d2' },
            },
        },
        ptBR, // x-data-grid translations
    );

    const CustomFooter = () => {
        return (
          <GridFooterContainer>
            <CardTitle className={(hidePdf !== undefined) ? "hide" : ""} onClick={generatePDF}>
                <CardIcon className="material-icons">picture_as_pdf</CardIcon>
                <strong>Gerar PDF</strong>
            </CardTitle>

            <CardTitle onClick={generateExcel}>
                <CardIcon className="material-icons">table_chart</CardIcon>
                <strong>Gerar Excel</strong>
            </CardTitle>

            <GridFooter sx={{
              border: 'none', // To delete double border.
              }} />
          </GridFooterContainer>
        );
    }

    return(
        <DataGridContent id="ReportInspectionTable">
            <ThemeProvider theme={theme}>
                <DataGrid 
                    rows={rows} 
                    columns={columns} 
                    getRowId={(row:any) => {return row.index}}
                    onCellEditCommit={callback}
                    getRowClassName={(params) => `super-app-theme--${params.row.check} super-app-theme--${(params.row.index % 2 === 0) ? "odd" : "even"}`}
                    onColumnHeaderClick={(event) => {if(onCheckClick !== undefined) return onCheckClick(event)}}
                    components={{Footer: CustomFooter}}
                />
            </ThemeProvider>
        </DataGridContent>
    )
}