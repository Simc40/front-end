import { DataGrid, ptBR, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from 'react';
import styled from "styled-components";

const DataGridContent = styled.div`
    width: 100%;
    height: 55vh;
    margin-top: 20px;

    .MuiTablePagination-root p{
        margin-top: auto;
    }

    .super-app-theme--inativo{
        background: rgba(255,0,0,0.1);
    }

    .super-app-theme--ativo{
        background: rgba(0,128,0,0.1);
    }

    .Mui-selected{
        background: rgba(0,0,0,0)!important;
    }

    .MuiDataGrid-row:hover{
        background: rgba(0,0,0,0)!important;
    }
`;

export const TableManage = ({columnRows, tableRows, callback} : {columnRows: any,tableRows:any, callback:any}) => {

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

    return(
        <DataGridContent>
            <ThemeProvider theme={theme}>
                <DataGrid 
                    rows={rows} 
                    columns={columns} 
                    componentsProps={{ toolbar: { csvOptions: { allColumns: true } } }}
                    getRowId={(row: any) =>  row.uid}
                    onCellEditCommit={callback}
                    getRowClassName={(params) => `super-app-theme--${params.row.status}`}
                />
            </ThemeProvider>
        </DataGridContent>
    )
}