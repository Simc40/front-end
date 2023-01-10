import { DataGrid, ptBR, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from 'react';
import styled from "styled-components";
import { ClickAwayListener } from '@mui/material';

const DataGridContent = styled.div`
    width: 100%;
    height: 17vh;

    .MuiDataGrid-footerContainer{
        display: none!important;
    }

    .MuiDataGrid-columnHeader{
        background-color: rgb(232, 232, 232);
    }

    .Mui-selected{
        background: rgba(0, 0, 255, 0.1)!important;
    }

    .MuiDataGrid-row:hover{
        background: rgba(128, 128, 128, 0.1);
    }

    .MuiDataGrid-root .MuiDataGrid-cell{
        white-space: normal !important;
        text-align: center;
    }

    .super-app-theme--Solucionado{
        background: rgba(0,0,255,0.3);
    }

    .super-app-theme--Aberto{
        background: rgba(255,0,0,0.3);
    }
`;

export const DashboardTableConsume = ({columnRows, tableRows} : {columnRows: any,tableRows:any}) => {

    const columns: GridColDef[] = columnRows;
    const rows: GridRowsProp = (tableRows === undefined) ? [] : Array.from(Object.values(tableRows));
    const [selectionModel, setSelectionModel] = React.useState([]);

    const theme = createTheme(
        {
            palette: {
            primary: { main: '#1976d2' },
            },
        },
        ptBR, // x-data-grid translations
    );

    const handleSelection = (newSelection:any) => {
        if (newSelection)
        {
            setSelectionModel(newSelection.selectionModel);
        }
        else
        {
            setSelectionModel([]);
        }
    }
    const handleClickAway = () => {
        handleSelection(null);
    };

    return(
        <DataGridContent>
            <ThemeProvider theme={theme}>
            <ClickAwayListener onClickAway={handleClickAway}>
                <DataGrid 
                    rows={rows} 
                    columns={columns} 
                    getRowId={(row:any) => {return row.uid}}
                    autoHeight={true}
                    getRowClassName={(params) => `super-app-theme--${params.row.status}`}
                    onSelectionModelChange={handleSelection}
                    selectionModel={selectionModel}
                />
            </ClickAwayListener>
            </ThemeProvider>
        </DataGridContent>
    )
}