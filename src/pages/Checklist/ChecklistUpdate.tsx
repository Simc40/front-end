import React, { ChangeEvent, useContext, useEffect, useState } from "react"
import { Section } from "../../components/forms/Section";
import { SubmitButton } from "../../components/Button/SubmitButton";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import swal from 'sweetalert';
import { GridColDef } from "@mui/x-data-grid";
import { getFormatDate } from "../../hooks/getDate";
import { LoadingPage } from "../LoadingPage/LoadingPage";
import { ChecklistOnUse } from "../../types/Checklist";
import { InputSection } from "../../components/forms/InputSection";
import { InputSelectFieldEditSelector } from "../../components/forms/InputSelectFieldEditSelector";
import { ResetableTable } from "../../components/Tables/ResetableTable";
import { InputTextField } from "../../components/forms/InputTextField";
import { DangerButton } from "../../components/Button/DangerButton";
import { checklistApi } from "../../apis/ChecklistApi";


export const ChecklistUpdate = ({checklist} : {checklist?:ChecklistOnUse}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [selectedChecklist, setSelectedChecklist] = useState("");
    const [rows, setRows] = useState<{ order: string; item: string; }[]>([]);
    const [rowsCopy, setRowsCopy] = useState<{ order: string; item: string; }[]>([]);

    const auth = useContext(AuthContext);

    useEffect(() => {
        auth.setPath("Home → Gerenciamento → Elementos → Gerenciar Elementos")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { handleSubmit, register } = useForm();

    const columns: GridColDef[] = [
        { field: 'order', headerName: 'Ordem', flex:1 , minWidth: 80},
        { field: 'item', headerName: 'Item', flex: 3, minWidth: 250},
        { field: 'remover', headerName: 'Remover', flex:1 , minWidth: 150, 'align': 'center', 'headerAlign': 'center', renderCell: (params) => (
            <DangerButton
                text="Remover"
                onClick={() => handleRowEditCommit(params)}
            />
        )}
    ];

    const handleRowEditCommit = (
        (params:any) => {
            if(rows.length <= 1) return swal("Oops!", "Ao menos um Item deve existir no Checklist", "error");
            const editedRows = rows.filter((row) => row.order !== params.row.order).map((row, i) => {
                return{
                    "order": i.toString(),
                    "item": row.item,
                }
            })
            setRows(editedRows);
        }
    );

    const onSubmit = () => {
        if(selectedChecklist === '') return swal("Oops!", "Selecione uma Etapa do Processo", "error");
        if(JSON.stringify(rows) === JSON.stringify(rowsCopy)) return swal("Oops!", "Nenhuma Modificação foi realizada!", "error");
        const checklist = Object.assign({}, ...rows.map((x) => ({[x.order]: x.item})));
        checklist.date = getFormatDate();
        
        const result = {[selectedChecklist] : checklist}
        setIsLoading(true)

        console.log(result)
        checklistApi().updateChecklist(result)
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

    const onAddNewItem = (params: {"nome_item" : string}) => {
        if(selectedChecklist === '') return swal("Oops!", "Selecione uma Etapa do Processo", "error");
        if(params.nome_item === '') return swal("Oops!", "O Campo Nome do Item está vazio", "error");
        if(rows.map((row: { order: string; item: string; }) => row.item.toLocaleLowerCase()).includes(params.nome_item.toLocaleLowerCase())) return swal("Oops!", "O Campo Nome do Item preenchido já existe no checklist!", "error");
        const newRows = rows.concat({"order": (rows.length).toString(), "item": params.nome_item});
        setRows(newRows)
    }

    const checklistProcessSelection = [
        ["planejamento", "Planejamento"],
        ["cadastro", "Produção/Cadastro"],
        ["armacao", "Produção/Armação"],
        ["forma", "Produção/Forma"],
        ["armacaoForma", "Produção/Armação com Forma"],
        ["concretagem", "Produção/Concretagem"],
        ["liberacao", "Produção/Liberação Final"],
        ["carga", "Transporte/Carga"],
        ["descarga", "Transporte/Descarga"],
        ["montagem", "Montagem"],
    ]

    const onOptionSelected = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedChecklist(event.target.value)
        let checklistItems = checklist![event.target.value];
        if(checklistItems !== undefined) {
            delete checklistItems.createdBy;
            delete checklistItems.creation;
        }
        const selectedRows = Array.from(Object.entries(checklistItems)).map((item) => {return {'order': item[0], 'item': item[1]}});
        setRows(selectedRows);
        setRowsCopy(structuredClone(selectedRows));
    }


    const pageContent = () => {
        return (
            <>  
                <Section text="Selecionar Etapa do Processo">
                    <InputSelectFieldEditSelector array={checklistProcessSelection} label="Processo" onOptionSelected={onOptionSelected} />
                </Section>
                
                <form onSubmit={handleSubmit(onAddNewItem as any)}>
                    <Section text='Adicionar Item ao Checklist'>
                        <InputSection>
                            <InputTextField label="Nome do Item" name="nome_item" register={register} />
                            <SubmitButton text="Adicionar Item ao Checklist" flex={true}/>
                        </InputSection>
                    </Section>
                </form>

                <form onSubmit={handleSubmit(onSubmit as any)}>
                    <Section text='Modificar Checklist' alignCenter={true}>
                        <p style={{'textAlign': 'center'}}>(Clique duas vezes no Item do Checklist para modificar)</p>
                        <ResetableTable id={"order"} columnRows={columns} tableRows={rows} callback={handleRowEditCommit} reset={() => setRows(structuredClone(rowsCopy))}/>
                    </Section>
                
                    <SubmitButton text="Atualizar"/>
                </form>
            </>
        )
    }

    return(
        isLoading ? <LoadingPage/> : pageContent()
    )
} 