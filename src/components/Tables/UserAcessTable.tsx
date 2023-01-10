import { DataGrid, ptBR, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from 'react';
import styled from "styled-components";
import { ClickAwayListener } from '@mui/material';

const DataGridContent = styled.div`
    width: 100%;
    height: auto;

    .MuiDataGrid-footerContainer{
        display: none!important;
    }

    .Mui-selected{
        background: rgba(0, 0, 255, 0.1)!important;
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

export const EtapasTable = ({columnRows, tableRows} : {columnRows: any,tableRows:any}) => {

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
                    getRowId={(row:any) => {return row.index}}
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