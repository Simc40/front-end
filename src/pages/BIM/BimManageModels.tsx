import React, { ChangeEvent, useContext, useEffect, useState } from "react"
import LoadingPage from "../LoadingPage/LoadingPage";
import './main.scss'
import 'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.js'
import { Construction } from "../../types/Construction";
import { InputSection } from "../../components/forms/InputSection";
import { InputSelectFieldEditSelector } from "../../components/forms/InputSelectFieldEditSelector";
import { Section } from "../../components/forms/Section";
import { ResetableTable } from "../../components/Tables/ResetableTable";
import { GridColDef } from "@mui/x-data-grid";
import { DangerButton, CheckboxInput } from "../../components/";
import { ApiFirebaseBIM, RVT } from "../../types/Forge";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { useForm } from "react-hook-form";
import swal from 'sweetalert';
import { forgeApi } from "../../apis/ForgeApi";
import { getFormatDate } from "../../hooks/getDate";
import { SubmitButton } from "../../components/Button/SubmitButton";

export const BimManageModels = ({BIM, constructions} : {BIM?: ApiFirebaseBIM, constructions?: Construction[]}) => {

    const auth = useContext(AuthContext);
    const { handleSubmit } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedConstruction, setSelectedConstruction] = useState('');
    const [rows, setRows] = useState<RVT[]>([]);
    const [rowsCopy, setRowsCopy] = useState<RVT[]>([]);
    console.log(BIM)

    useEffect(() => {
        auth.setPath("Home → Gerenciamento → BIM → Gerenciar Modelos")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const constructionSelection = (constructions === undefined) ? [] : Array.from(Object.values(constructions).map((construction: Construction) => [construction.uid, construction.nome_obra]));


    const columns: GridColDef[] = [
        { field: 'nome_rvt', headerName: 'Nome do PDF', flex:3 , minWidth: 150},
        { field: 'creation', headerName: 'Data de Registro', flex:2 , minWidth: 180},
        { field: 'lastModifiedOn', headerName: 'Última Modificação', flex:2 , minWidth: 180},
        { field: 'status', headerName: 'Status', flex:1 , minWidth: 100, 'align': 'center', 'headerAlign': 'center', renderCell: (params) => (
            <CheckboxInput checked={params.row.status === "ativo"} onChange={() => handleStatusChange(params)} />
        )},
        { field: 'remover', headerName: 'Remover', flex:1 , minWidth: 150, 'align': 'center', 'headerAlign': 'center', renderCell: (params) => (
            <DangerButton text="Remover" onClick={() => handleRemoveChange(params)} />
        )}
    ];

    const handleStatusChange = (
        (params:any) => {
            if(params.row.status === "ativo") return;
            const editedRows = rows.map((row) => {
                if(row.uid === params.row.uid && row.activity === "RVT") return{
                    ...row,
                    "status": "ativo",
                }
                else if(row.uid === params.row.uid) return{
                    ...row,
                    "status": "ativo",
                    "activity": "status",
                }
                else if (row.status === "ativo") return{
                    ...row,
                    "status": "inativo",
                    "activity": (row.activity !== "RVT") ? "status" : "RVT",
                }
                else return row;
            })
            setRows(editedRows);
        }
    );

    const handleRemoveChange = (
        (params:any) => {
            if(params.row.status === "ativo") return swal("Oops!", "Não é possível remover um PDF com status Ativo, selecione outro PDF como ativo para remover!", "error");
            if(params.row.activity === "RVT"){
                const editedRows = rows.filter((row) => row.uid !== params.row.uid)
                return setRows(editedRows);
            }
            
            const editedRows = rows.map((row) => {
                if(row.uid === params.row.uid) return{
                    ...row,
                    "activity": "remove",
                }
                else return row;
            })
            setRows(editedRows);
        }
    );

    const onConstructionSelected = (event:ChangeEvent<HTMLSelectElement>) => {
        setSelectedConstruction(event.target.value);
        if(BIM === undefined || BIM[event.target.value] === undefined){
            setRows([]);
            setRowsCopy([]);
            return;
        }
        const selectedRows = Array.from(Object.values(BIM[event.target.value]).map((rvt: RVT, i: number) => {return {...rvt, 'index': i}}));
        setRows(selectedRows);
        setRowsCopy(structuredClone(selectedRows));
    }

    const onPdfUploaded = async (event:ChangeEvent<HTMLInputElement>) => {
        const file: File | undefined = event?.target.files![0];
        if(file === undefined) return;
        console.log(event!.target.value.replace('\\', "\\\\"))
        const newPdf: RVT = {
            "uid": crypto.randomUUID().toString(), 
            "index": rows.length,
            "nome_rvt": file.name,
            "obra": selectedConstruction,
            "status": "inativo",
            "activity": "RVT",
            "file": file
        }
        const newRows = rows.concat(newPdf);
        setRows(newRows);
    }

    const onSubmit = (data:Construction) => {
        if(selectedConstruction === '') return swal("Oops!", "Selecione uma Obra", "error");
        if(JSON.stringify(rows) === JSON.stringify(rowsCopy)) return swal("Oops!", "Nenhuma Modificação foi realizada!", "error");
        let formData = new FormData();
        let formSize = 0;
        rows.forEach((row) => {
            if(row.activity === undefined) return;
            else if(row.activity === "remove"){
                formSize++;
                formData.append(`formData_${formSize}`, JSON.stringify({"uid": row.uid, "nome_rvt" : row.nome_rvt, "activity": "remove"}));
            }
            else if(row.activity === "RVT"){
                formSize++;
                formData.append(`formData_${formSize}`, JSON.stringify({"nome_rvt": row.nome_rvt, "obra": row.obra, "status": row.status, "activity": "RVT"}));
                formData.append(`uploadedFile_${formSize}`, row.file!);
            }
            else if(row.activity === "status"){
                formSize++;
                formData.append(`formData_${formSize}`, JSON.stringify({"uid": row.uid, "status": row.status, "activity": "status"}));
            }
        })

        formData.append("formData_size", formSize.toString());
        formData.append("formData_obra", selectedConstruction);
        formData.append("formData_date", getFormatDate());
        
        setIsLoading(true)

        forgeApi().postModel(formData)
        .then(async () => {
            setIsLoading(false)
            return swal({
                icon: 'success',
                title: 'Mudanças realizadas com sucesso',
            }).then(() => {
                window.location.reload()
            })
        }).catch((error) => {
            setIsLoading(false)
            console.log(error);
            swal("Oops!", "Ocorreu um erro Inesperado, contate o suporte!", "error");
        })
    }


    const pageContent = () => {
        return (
            <form onSubmit={handleSubmit(onSubmit as any)}>

                    <Section text="Selecionar Obra">
                        <InputSelectFieldEditSelector array={constructionSelection} label="Obra" onOptionSelected={onConstructionSelected} />
                    </Section>
                    
                    <Section text='Adicionar Modelo BIM'>
                        <InputSection style={{'marginTop': '20px', 'marginBottom': '50px'}}>
                            <input id="img-input" type="file" accept=".rvt" onChange={onPdfUploaded}/>
                        </InputSection>
                    </Section>

                    <Section text='Gerenciar Modelos BIM' alignCenter={true}>
                        <ResetableTable id="index" columnRows={columns} tableRows={rows} reset={undefined}/>
                    </Section>

                    <SubmitButton text="Atualizar"/>

            </form>
        

            
        )
    }

    return(
        isLoading ? <LoadingPage/> : pageContent()
    )
} 