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
import { Construction, ConstructionForm } from "../../types/Construction";
import { constructionApi } from "../../apis/ConstructionApi";
import { InputDateFieldEdit } from "../../components/forms/InputDateFieldEdit";
import { InputSelectFieldEdit } from "../../components/forms/InputSelectFieldEdit";
import LoadingPage from "../LoadingPage/LoadingPage";


export const ConstructionsEdit = ({constructions} : {constructions:Construction[] | undefined}) => {
    let validFormValues:string[] = [];

    const auth = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        auth.setPath("Home → Gerenciamento → Obras → Editar Obras")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { register, handleSubmit, setValue } = useForm();
    const [construction, setConstruction] = useState<Construction>();

    const onOptionSelected = (event:ChangeEvent<HTMLSelectElement>) => {
        const getConstruction = (uid:string) => {
            return Array.from(Object.values(constructions!).filter((construction:Construction) => construction.uid === uid))[0];
        }
        setConstruction(getConstruction(event.target.value));
        validFormValues = [];
    }

    const hasChanged = (name:string) => {
        validFormValues.push(name)
    }

    const onSubmit = (values:any) => {
        console.log(values)
        if (construction === undefined) return swal("Oops!", "Nenhuma Obra foi Selecionada!", "error");
        Object.keys(values).forEach((name:string) => {if(!validFormValues.includes(name)) delete values[name]})
        if(Object.keys(values).length === 0) return swal("Oops!", "Nenhuma modificação foi realizada!", "error");
        values.date = getFormatDate();
        console.log(values)
        const result:{[uid:string] : ConstructionForm}  = {[construction.uid] : values}

        setIsLoading(true)

        constructionApi().editConstruction(result)
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

    const constructionSelection = (constructions === undefined) ? undefined : Array.from(Object.values(constructions).map((construction: Construction) => [construction.uid, construction.nome_obra]));
    
    const constructionTypeSelection = [
        ["Conjunto", "Conjunto"],
        ["Escola", "Escola"],
        ["Galpão", "Galpão"],
        ["Hospital", "Hospital"],
        ["Metrô", "Metrô"],
        ["Passarela", "Passarela"],
        ["Ponte", "Ponte"],
        ["Prédio", "Prédio"],
        ["Residência", "Residência"],
    ]

    const pageContent = () => {
        return (
            <form onSubmit={handleSubmit(onSubmit as any)}>
                <Section text="Selecionar Obra">
                    <InputSection>
                        <InputSelectFieldEditSelector array={constructionSelection} label="Obra" onOptionSelected={onOptionSelected} />
                    </InputSection>
                </Section>

                <Section text="Dados da Obra">
                    <InputSection>
                        <InputTextFieldEdit formSetValue={setValue} editFrom={construction} label="Nome Da Obra" name="nome_obra" register={register} hasChanged={hasChanged} />
                    </InputSection>
                    <InputSection>
                        <InputSelectFieldEdit array={auth.usersNameMap} formSetValue={setValue} editFrom={construction} label="Responsável" name="responsavel" register={register} hasChanged={hasChanged} />
                        <InputSelectFieldEdit array={constructionTypeSelection} formSetValue={setValue} editFrom={construction} label="Tipo de Construcao" name="tipo_construcao" register={register} hasChanged={hasChanged} />
                    </InputSection>
                </Section>

                <Section text="Localização">
                    <InputSection>
                        <InputTextFieldEdit formSetValue={setValue} editFrom={construction} label="Endereço" name="endereco" register={register} hasChanged={hasChanged} />
                        <InputTextFieldEdit formSetValue={setValue} editFrom={construction} label="Bairro" name="bairro" register={register} hasChanged={hasChanged} />
                    </InputSection>
                    <InputSection>
                        <InputTextFieldEdit type="CEP" formSetValue={setValue} editFrom={construction} label="CEP" name="cep" register={register} hasChanged={hasChanged} />
                        <InputTextFieldEdit formSetValue={setValue} editFrom={construction} label="Cidade" name="cidade" register={register} hasChanged={hasChanged} />
                    </InputSection>
                    <InputSection>
                        <InputTextFieldEdit type="CNPJ" formSetValue={setValue} editFrom={construction} label="CNPJ" name="cnpj" register={register} hasChanged={hasChanged} />
                        <InputTextFieldEdit formSetValue={setValue} editFrom={construction} label="UF" name="uf" register={register} hasChanged={hasChanged} />
                    </InputSection>
                </Section>

                <Section text="Informações de Projeto">
                    <InputSection>
                        <InputTextFieldEdit formSetValue={setValue} editFrom={construction} label="Quantidade de Peças" name="quantidade_pecas" type="number" register={register} hasChanged={hasChanged} />
                    </InputSection>
                    <InputSection>
                        <InputDateFieldEdit formSetValue={setValue} editFrom={construction} label="Previsão de Início" name="previsao_inicio" register={register} hasChanged={hasChanged} />
                        <InputDateFieldEdit formSetValue={setValue} editFrom={construction} label="Previsão de Entrega" name="previsao_entrega" register={register} hasChanged={hasChanged} />
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