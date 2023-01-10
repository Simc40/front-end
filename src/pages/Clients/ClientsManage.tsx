import React, { useContext, useEffect, useState } from "react"
import { Section } from "../../components/forms/Section";
import { SubmitButton } from "../../components/Button/SubmitButton";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import swal from 'sweetalert';
import { TableManage } from "../../components/Tables/ManageTable";
import { Client } from "../../types/Client";
import { GridColDef } from "@mui/x-data-grid";
import { getFormatDate } from "../../hooks/getDate";
import LoadingPage from "../LoadingPage/LoadingPage";
import { CheckboxInput } from "../../components/Button/CheckboxInput";


export const ClientsManage = ({clients} : {clients:Client[] | undefined}) => {

    type Dataset = {date?:string, status:string};
    const [result] = useState<{[fieldName: string]: Dataset}> ({});
    const [isLoading, setIsLoading] = useState(false);

    const auth = useContext(AuthContext);

    useEffect(() => {
        auth.setPath("Home → Clientes → Gerenciar Clientes")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { handleSubmit } = useForm();

    const columns: GridColDef[] = [
        { field: 'nome', headerName: 'Nome do Cliente', flex:2 , minWidth: 150},
        { field: 'created', headerName: 'Data de Registro', flex:2 , minWidth: 180},
        { field: 'lastModifiedOn', headerName: 'Última Modificação', flex:2 , minWidth: 180},
        { field: 'status', headerName: 'Status', 'disableColumnMenu': true, flex:1, 'align': 'center', 'headerAlign': 'center', minWidth: 100, renderCell: (params) => (
            <CheckboxInput
              checked={params.row.status === "ativo"}
              onChange={() => handleRowEditCommit(params)}
            />
          )}
    ];

    const handleRowEditCommit = React.useCallback(
        (params:any) => {
            console.log(params)
            const id:string = params.id;
            const value:string = params.value; 
            if(result[id] === undefined) {
                result[id] = {'status': (value === "ativo") ? "inativo" : "ativo"};
                params.row.status = (value === "ativo") ? "inativo" : "ativo";
            }
            else {
                delete result[id]
                params.row.status = (value === "ativo") ? "inativo" : "ativo";
            }
            console.log(result)
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const onSubmit = () => {
        console.log(result)
        if(Object.keys(result).length === 0) return swal("Oops!", "Nenhuma modificação de Status foi realizada!", "error");
        const date = getFormatDate();
        Object.keys(result).forEach((key) => {
            result[key].date = date;
        })

        setIsLoading(true)

        auth.updateClient(result).then(() => {
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
                <Section text='Gerenciar Status de Clientes.'>
                    <p>(Clique duas vezes no Status para modificar)</p>
                    <TableManage columnRows={columns} tableRows={clients} callback={handleRowEditCommit}/>
                </Section>

                <SubmitButton text="Atualizar"/>
            </form>
        )
    }

    return(
        isLoading ? <LoadingPage/> : pageContent()
    )
} 