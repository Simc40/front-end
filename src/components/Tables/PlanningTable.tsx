import {
    DataGrid,
    ptBR,
    GridRowsProp,
    GridColDef,
    GridCellEditCommitParams,
    MuiEvent,
} from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React from "react";
import styled from "styled-components";
import { ClickAwayListener } from "@mui/material";
import {
    GridColumns,
    GridCellParams,
    GridCellModesModel,
    GridCellModes,
} from "@mui/x-data-grid";
import {
    randomCreatedDate,
    randomTraderName,
    randomUpdatedDate,
} from "@mui/x-data-grid-generator";

const DataGridContent = styled.div`
    width: 100%;
    height: auto;

    .MuiDataGrid-footerContainer {
        display: none !important;
    }

    .MuiDataGrid-columnHeader {
        background-color: #a8cf45;
    }

    .Mui-selected {
        background: rgba(0, 0, 255, 0.1) !important;
    }

    .MuiDataGrid-row:hover {
        background: rgba(128, 128, 128, 0.1);
    }

    .MuiDataGrid-root .MuiDataGrid-cell {
        white-space: normal !important;
        text-align: center;
    }

    .super-app-theme--Solucionado {
        background: rgba(0, 0, 255, 0.3);
    }

    .super-app-theme--Aberto {
        background: rgba(255, 0, 0, 0.3);
    }
`;

export const PlanningTable = ({
    columnRows,
    tableRows,
    callback,
}: {
    columnRows: any;
    tableRows: any;
    callback: any;
}) => {
    const [cellModesModel, setCellModesModel] =
        React.useState<GridCellModesModel>({});

    const handleCellClick = React.useCallback((params: GridCellParams) => {
        setCellModesModel((prevModel) => {
            return {
                // Revert the mode of the other cells from other rows
                ...Object.keys(prevModel).reduce(
                    (acc, id) => ({
                        ...acc,
                        [id]: Object.keys(prevModel[id]).reduce(
                            (acc2, field) => ({
                                ...acc2,
                                [field]: { mode: GridCellModes.View },
                            }),
                            {}
                        ),
                    }),
                    {}
                ),
                [params.id]: {
                    // Revert the mode of other cells in the same row
                    ...Object.keys(prevModel[params.id] || {}).reduce(
                        (acc, field) => ({
                            ...acc,
                            [field]: { mode: GridCellModes.View },
                        }),
                        {}
                    ),
                    [params.field]: { mode: GridCellModes.Edit },
                },
            };
        });
    }, []);

    const handleCellModesModelChange = React.useCallback((newModel: any) => {
        setCellModesModel(newModel);
    }, []);
    const columns: GridColDef[] = columnRows;
    const rows: GridRowsProp =
        tableRows === undefined ? [] : Array.from(Object.values(tableRows));
    const [selectionModel, setSelectionModel] = React.useState([]);

    const theme = createTheme(
        {
            palette: {
                primary: { main: "#1976d2" },
            },
        },
        ptBR // x-data-grid translations
    );

    const handleSelection = (newSelection: any) => {
        if (newSelection) {
            setSelectionModel(newSelection.selectionModel);
        } else {
            setSelectionModel([]);
        }
    };
    const handleClickAway = () => {
        handleSelection(null);
    };

    return (
        <DataGridContent>
            <ThemeProvider theme={theme}>
                <ClickAwayListener onClickAway={handleClickAway}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        getRowId={(row: any) => {
                            return row.id;
                        }}
                        autoHeight={true}
                        getRowClassName={(params) =>
                            `super-app-theme--${params.row.status}`
                        }
                        // onSelectionModelChange={handleSelection}
                        // selectionModel={selectionModel}
                        // cellModesModel={cellModesModel}
                        // onCellModesModelChange={handleCellModesModelChange}
                        // onCellClick={handleCellClick}
                        // experimentalFeatures={{ newEditingApi: true }}
                        onCellEditCommit={callback}
                    />
                </ClickAwayListener>
            </ThemeProvider>
        </DataGridContent>
    );
};
