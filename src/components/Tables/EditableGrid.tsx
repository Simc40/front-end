import * as React from "react";
import {
    GridColumns,
    GridCellParams,
    GridRowsProp,
    DataGrid,
    GridCellModesModel,
    GridCellModes,
} from "@mui/x-data-grid";
import {
    randomCreatedDate,
    randomTraderName,
    randomUpdatedDate,
} from "@mui/x-data-grid-generator";

export default function StartEditButtonGrid() {
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

    return (
        <div style={{ height: 400, width: "100%" }}>
            <DataGrid
                rows={rows}
                columns={columns}
                cellModesModel={cellModesModel}
                onCellModesModelChange={handleCellModesModelChange}
                onCellClick={handleCellClick}
                experimentalFeatures={{ newEditingApi: true }}
            />
        </div>
    );
}

const columns: GridColumns = [
    { field: "name", headerName: "Name", width: 180, editable: true },
    { field: "age", headerName: "Age", type: "number", editable: true },
    {
        field: "dateCreated",
        headerName: "Date Created",
        type: "date",
        width: 180,
        editable: true,
    },
    {
        field: "lastLogin",
        headerName: "Last Login",
        type: "dateTime",
        width: 220,
        editable: true,
    },
];

const rows: GridRowsProp = [
    {
        id: 1,
        name: randomTraderName(),
        age: 25,
        dateCreated: randomCreatedDate(),
        lastLogin: randomUpdatedDate(),
    },
    {
        id: 2,
        name: randomTraderName(),
        age: 36,
        dateCreated: randomCreatedDate(),
        lastLogin: randomUpdatedDate(),
    },
    {
        id: 3,
        name: randomTraderName(),
        age: 19,
        dateCreated: randomCreatedDate(),
        lastLogin: randomUpdatedDate(),
    },
    {
        id: 4,
        name: randomTraderName(),
        age: 28,
        dateCreated: randomCreatedDate(),
        lastLogin: randomUpdatedDate(),
    },
    {
        id: 5,
        name: randomTraderName(),
        age: 23,
        dateCreated: randomCreatedDate(),
        lastLogin: randomUpdatedDate(),
    },
];
