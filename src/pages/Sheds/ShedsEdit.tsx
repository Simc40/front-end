import React, { ChangeEvent, useContext, useEffect, useState } from "react"
import { InputSection } from "../../components/forms/InputSection";
import { Section } from "../../components/forms/Section";
import { SubmitButton } from "../../components/Button/SubmitButton";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import swal from 'sweetalert';
import { InputSelectFieldEditSelector } from "../../components/forms/InputSelectFieldEditSelector";
import { InputTextFieldEdit } from "../../components/forms/InputTextFieldEdit";
import { getFormatDate } from "../../hooks/getDate";
import { InputSelectFieldEdit } from "../../components/forms/InputSelectFieldEdit";
import LoadingPage from "../LoadingPage/LoadingPage";
import { shedsApi } from "../../apis/ShedsApi";
import { Shed } from "../../types/Shed";


export const ShedsEdit = ({sheds} : {sheds:Shed[] | undefined}) => {
    let validFormValues:string[] = [];

    const auth = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        auth.setPath("Home → Gerenciamento → Galpões → Editar Galpão")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { register, handleSubmit, setValue } = useForm();
    const [shed, setShed] = useState<Shed>();

    const onOptionSelected = (event:ChangeEvent<HTMLSelectElement>) => {
        const getShed = (uid:string) => {
            return Array.from(Object.values(sheds!).filter((shed:Shed) => shed.uid === uid))[0];
        }
        setShed(getShed(event.target.value));
        validFormValues = [];
    }

    const hasChanged = (name:string) => {
        validFormValues.push(name)
    }

    const onSubmit = (values:any) => {
        console.log(values)
        if (shed === undefined) return swal("Oops!", "Nenhum Galpão foi Selecionado!", "error");
        Object.keys(values).forEach((name:string) => {if(!validFormValues.includes(name)) delete values[name]})
        if(Object.keys(values).length === 0) return swal("Oops!", "Nenhuma modificação foi realizada!", "error");
        values.date = getFormatDate();
        console.log(values)
        const result:{[uid:string] : Shed}  = {[shed.uid] : values}

        setIsLoading(true)

        shedsApi().editShed(result)
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

    const constructionSelection = (sheds === undefined) ? undefined : Array.from(Object.values(sheds).map((shed: Shed) => [shed.uid, shed.nome_galpao]));
    
    const shedStatus = [
        ["ativo", "Disponível"],
        ["inativo", "Indisponível"],
    ]

    const pageContent = () => {
        return (
            <form onSubmit={handleSubmit(onSubmit as any)}>
                <Section text="Selecionar Galpão">
                    <InputSection>
                        <InputSelectFieldEditSelector array={constructionSelection} label="Galpão" onOptionSelected={onOptionSelected} />
                    </InputSection>
                </Section>

                <Section text="Dados do Galpão">
                    <InputSection>
                        <InputTextFieldEdit formSetValue={setValue} editFrom={shed} label="Nome Do Galpão" name="nome_galpao" register={register} hasChanged={hasChanged} />
                    </InputSection>
                    <InputSection>
                        <InputSelectFieldEdit array={shedStatus} formSetValue={setValue} editFrom={shed} label="Disponibilidade" name="status" register={register} hasChanged={hasChanged} />
                    </InputSection>
                </Section>

                <SubmitButton text="Atualizar"/>
            </form>
        )
    }

    return(
        isLoading ? <LoadingPage/> : pageContent()
    )
} 