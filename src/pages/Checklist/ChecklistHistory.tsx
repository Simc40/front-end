import React, { ChangeEvent, useContext, useEffect, useState } from "react"
import { Section } from "../../components/forms/Section";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { GridColDef } from "@mui/x-data-grid";
import { ChecklistHistoryType } from "../../types/Checklist";
import { InputSection } from "../../components/forms/InputSection";
import { InputSelectFieldEditSelector } from "../../components/forms/InputSelectFieldEditSelector";
import { ResetableTable } from "../../components/Tables/ResetableTable";


export const ChecklistHistory = ({checklistHistory} : {checklistHistory?:ChecklistHistoryType}) => {

    const [process, setProcess] = useState("");
    const [selectedChecklist, setSelectedChecklist] = useState("");
    const [checklistSelection, setChecklistSelection] = useState<string[][] | []>([]);
    const [rows, setRows] = useState<{ order: string; item: string; }[]>([]);
    const auth = useContext(AuthContext);

    useEffect(() => {
        auth.setPath("Home → Gerenciamento → Elementos → Gerenciar Elementos")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns: GridColDef[] = [
        { field: 'order', headerName: 'Ordem', flex:1 , minWidth: 150},
        { field: 'item', headerName: 'Item', flex: 2, minWidth: 250},
    ];

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

    const onProcessSelected = (event: ChangeEvent<HTMLSelectElement>) => {
        setProcess(event.target.value)
        setRows([])
        setSelectedChecklist("")
        setChecklistSelection(Array.from(Object.entries(checklistHistory![event.target.value]).map(([uid, checklist]) => { return [uid, "Checklist Criado em: " + checklist.creation] })))
        let checklistItems = checklistHistory![event.target.value];
        if(checklistItems !== undefined) {
            delete checklistItems.createdBy
            delete checklistItems.creation
        }
    }

    const onChecklistSelected = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedChecklist(event.target.value)
        let checklistItems = checklistHistory![process][event.target.value];
        if(checklistItems !== undefined) {
            delete checklistItems.createdBy
            delete checklistItems.creation
        }
        setRows(Array.from(Object.entries(checklistItems)).map((item) => {return {'order': item[0], 'item': item[1]}}))
    }

    const pageContent = () => {
        return (
            <>
                <Section text="Selecionar Etapa do Processo">
                    <InputSection>
                        <InputSelectFieldEditSelector array={checklistProcessSelection} label="Processo" onOptionSelected={onProcessSelected} />
                    </InputSection>
                </Section>

                <Section text="Selecionar Checklist">
                    <InputSection>
                        <InputSelectFieldEditSelector value={selectedChecklist} array={checklistSelection} label="Checklist" onOptionSelected={onChecklistSelected} />
                    </InputSection>
                </Section>
                <Section text='Histórico de Checklists'>
                    <ResetableTable id={"order"} columnRows={columns} tableRows={rows} reset={undefined}/>
                </Section>
            </>
        )
    }

    return(
        pageContent()
    )
} 