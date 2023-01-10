import React, { ChangeEvent, useContext, useEffect, useState } from "react"
import { Section } from "../../components/forms/Section";
import { SubmitButton } from "../../components/Button/SubmitButton";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import swal from 'sweetalert';
import { TableManage } from "../../components/Tables/ManageTable";
import { GridColDef } from "@mui/x-data-grid";
import { getFormatDate } from "../../hooks/getDate";
import { LoadingPage } from "../LoadingPage/LoadingPage";
import { CheckboxInput } from "../../components/Button/CheckboxInput";
import { InputSection } from "../../components/forms/InputSection";
import { InputSelectFieldEditSelector } from "../../components/forms/InputSelectFieldEditSelector";
import { InputSelectFieldEdit } from "../../components/forms/InputSelectFieldEdit";
import { User } from "../../types/User";
import { manageAcessApi } from "../../apis/ManageAcessApi";
import { SectionInvisible } from "../../components/forms/SectionInvisible";


export const UserAccessManage = () => {

    const auth = useContext(AuthContext);
    
    const [showTable, setShowTable] = useState(false);
    const [validFormValues, setValidFormValues] = useState<string[]> ([]);
    const [userActivities, setUserActivities] = useState<{uid: number, activity: string, status: string}[]> ([]);
    const [userDefaultActivities, setUserDefaultActivities] = useState<{uid: number, activity: string, status: string}[]> ([]);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState<User>();
    const accessTypes = {
        "usuario" : "497ed826-c29f-4dc3-964b-d491f54a2a2f",
        "responsavel" : "49481bb2-4aa9-4266-ba2b-3d2faa6258a0",
        "admin" : "685fe674-9d61-4946-8435-9cbc23a1fc8a"
    }

    const accessTypesArray = (auth.user?.acesso === "admin") ? 
    [
        ["497ed826-c29f-4dc3-964b-d491f54a2a2f", "usuario"],
        ["49481bb2-4aa9-4266-ba2b-3d2faa6258a0", "responsavel"],
        ["685fe674-9d61-4946-8435-9cbc23a1fc8a", "admin"]
    ] 
    :
    [
        ["497ed826-c29f-4dc3-964b-d491f54a2a2f", "usuario"],
        ["49481bb2-4aa9-4266-ba2b-3d2faa6258a0", "responsavel"],
    ]   

    useEffect(() => {
        auth.setPath("Home → Gerenciamento → Acessos → Gerenciar Acesso")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { handleSubmit, setValue, getValues, register, watch} = useForm();

    watch("acesso")

    const columns: GridColDef[] = [
        { field: 'activity', headerName: 'Atividade', flex:3 , minWidth: 320, valueGetter: (params) => {return params.row.activity.replace("->" , "→").replace("->" , "→")}},
        { field: 'status', headerName: 'Status', 'disableColumnMenu': true, flex:1, 'align': 'center', 'headerAlign': 'center', minWidth: 100, renderCell: (params) => (
            <CheckboxInput
              checked={params.row.status === "ativo"}
              onChange={() => handleRowEditCommit(params)}
            />
          )}
    ];

    const handleRowEditCommit = (
        (params:any) => {
            const value:string = params.value; 
            params.row.status = (value === "ativo") ? "inativo" : "ativo";
            // setResult(params.row)
            console.log(userActivities)
        }
    );

    const onSubmit = (values:any) => {
        console.log(validFormValues)
        if (user === undefined) return swal("Oops!", "Nenhum Usuário foi Selecionado!", "error");
        if(!validFormValues.includes("acesso") && JSON.stringify(userActivities) === JSON.stringify(userDefaultActivities)) return swal("Oops!", "Nenhuma Modificação foi realizada!", "error");
        var post_result: {[uid:string] : User} = {};
        var post_data:any = {"date": getFormatDate()};
        if(validFormValues.includes("acesso")) post_data.acesso = values.acesso;
        if(JSON.stringify(userActivities) !== JSON.stringify(userDefaultActivities)) post_data.acessos_atividades = Object.assign({}, ...userActivities.map((x) => ({[x.activity]: x.status})))
        post_result = {[user.uid!] : post_data}
        console.log(post_result)

        setIsLoading(true)

        manageAcessApi().manageUserAcess(post_result)
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

    const onUserSelected = (event:ChangeEvent<HTMLSelectElement>) => {
        const selectedUser = auth.usersMap.get(event.target.value);
        setValidFormValues([]);
        setUser(selectedUser);
        const selectedUserActivities = (selectedUser === undefined) ? [] : 
        (selectedUser.acessos_atividades === undefined) ? [] : 
        Object.entries(selectedUser.acessos_atividades).map(([activity , status] : [string, string], i : number) => {
            return {
                "uid": i,
                "activity": activity,
                "status": status
            }
        })
        setUserActivities(selectedUserActivities)
        setUserDefaultActivities(structuredClone(selectedUserActivities))
        setShowTable(selectedUser?.acesso === accessTypes.usuario)
    }

    const onAccessSelected = (event:ChangeEvent<HTMLSelectElement> | undefined) => {
        const selectedUserActivities = (user === undefined) ? [] : 
        (user.acessos_atividades === undefined) ? [] : 
        Object.entries(user.acessos_atividades).map(([activity , status] : [string, string], i : number) => {
            return {
                "uid": i,
                "activity": activity,
                "status": status
            }
        })
        setUserActivities(selectedUserActivities)
        setUserDefaultActivities(structuredClone(selectedUserActivities))
        setShowTable(event?.target.value === accessTypes.usuario)
    }

    const hasChanged = (name:string) => {
        console.log("hasChanged")
        console.log(user?.acesso)
        console.log(getValues().acesso)

        if(user?.acesso === getValues().acesso) validFormValues.pop()
        else if(!validFormValues.includes(name))validFormValues.push(name)
        console.log(validFormValues)
    }

    const pageContent = () => {
        return (
            <form onSubmit={handleSubmit(onSubmit as any)}>

                <Section text="Selecionar Usuário">
                    <InputSection>
                        <InputSelectFieldEditSelector array={auth.usersNameMap.filter((map) => map[0] !== auth.user?.uid)} label="Usuário" onOptionSelected={onUserSelected} />
                    </InputSection>
                </Section>

                <SectionInvisible text="Selecionar Acesso" visible={user !== undefined}>
                    <InputSection>
                        <InputSelectFieldEdit array={accessTypesArray} formSetValue={setValue} editFrom={user} label="Acesso" name="acesso" register={register} hasChanged={hasChanged} onOptionSelected={onAccessSelected} />
                    </InputSection>
                </SectionInvisible>

                <SectionInvisible text='Gerenciar Status de Acesso de Atividades' visible={showTable}>
                    <TableManage columnRows={columns} tableRows={userActivities} callback={handleRowEditCommit}/>
                </SectionInvisible>

                <SubmitButton text="Atualizar"/>
            </form>
        )
    }

    return(
        isLoading ? <LoadingPage/> : pageContent()
    )
} 