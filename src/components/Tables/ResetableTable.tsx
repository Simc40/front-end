import { DataGrid, ptBR, GridRowsProp, GridColDef, GridFooterContainer, GridFooter } from '@mui/x-data-grid';
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

    .super-app-theme--odd{
        background: rgba(128, 128, 128, 0.1);

        &.super-app-theme--show{
            background: white;

        }

        &.super-app-theme--remove{
            background: white;
        }
    }

    .super-app-theme--even{
        background: rgba(255,255,255,1);

        &.super-app-theme--show{
            background: white;

        }

        &.super-app-theme--remove{
            background: white;
        }
    }

    .Mui-selected{
        background: rgba(0, 0, 255, 0.1)!important;
    }

    .MuiDataGrid-row:hover{
        background: rgba(128, 128, 128, 0.1)!important;
    }

    .super-app-theme--remove{
        display: none!important;
    }
`;

const CardTitle = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 0.8em;

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
    margin-right: 0.3rem;
`;

export const ResetableTable = ({columnRows, tableRows, callback, reset, id} : {id?: string, columnRows: any,tableRows:any, callback?:any, reset: undefined | (() => void)}) => {

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
            <CardTitle className={(reset === undefined) ? "hide" : ""} onClick={reset}>
                <CardIcon className="material-icons">replay</CardIcon>
                <strong>Descartar Mudanças</strong>
            </CardTitle>

            <GridFooter sx={{
              border: 'none', // To delete double border.
              }} />
          </GridFooterContainer>
        );
    }

    const getIdEvenOrOdd = (params: any) => {
        const variable = (id === "order") ? params.row.order : params.row.index;
        return (variable % 2 === 0) ? "odd" : "even"
    }

    return(
        <DataGridContent>
            <ThemeProvider theme={theme}>
                <DataGrid 
                    rows={rows} 
                    columns={columns} 
                    getRowId={(row: any) => (id === "order") ? row.order : row.uid}
                    onCellEditCommit={callback}
                    getRowClassName={(params) => `super-app-theme--${getIdEvenOrOdd(params)} ${(params.row.activity === "remove") ? "super-app-theme--remove" : "super-app-theme--show"}`}
                    components={{Footer: CustomFooter}}
                />
            </ThemeProvider>
        </DataGridContent>
    )
}