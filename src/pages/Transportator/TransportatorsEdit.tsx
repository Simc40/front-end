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
import { Transportator } from "../../types/Transportator";
import { transportatorsApi } from "../../apis/TransportatorsApi";
import LoadingPage from "../LoadingPage/LoadingPage";


export const TransportatorsEdit = ({transportators} : {transportators:Transportator[] | undefined}) => {
    let validFormValues:string[] = [];

    const auth = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        auth.setPath("Home → Gerenciamento → Transportadoras → Empresas → Editar Transportadoras")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { register, handleSubmit, setValue } = useForm();
    const [Transportator, setTransportator] = useState<Transportator>();

    const onOptionSelected = (event:ChangeEvent<HTMLSelectElement>) => {
        const getTransportator = (uid:string) => {
            return Array.from(Object.values(transportators!).filter((transportator:Transportator) => transportator.uid === uid))[0];
        }
        setTransportator(getTransportator(event.target.value));
        validFormValues = [];
    }

    const hasChanged = (name:string) => {
        validFormValues.push(name)
    }

    const onSubmit = (values:any) => {
        console.log(values)
        if (Transportator === undefined) return swal("Oops!", "Nenhuma Transportadora foi Selecionada!", "error");
        Object.keys(values).forEach((name:string) => {if(!validFormValues.includes(name)) delete values[name]})
        if(Object.keys(values).length === 0) return swal("Oops!", "Nenhuma modificação foi realizada!", "error");
        values.date = getFormatDate();
        console.log(values)
        const result:{[uid:string] : Transportator}  = {[Transportator.uid] : values}

        setIsLoading(true)

        transportatorsApi().editTransportator(result)
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

    const TransportatorSelection = (transportators === undefined) ? undefined : Array.from(Object.values(transportators).map((transportator: Transportator) => [transportator.uid, transportator.nome_empresa]));

    const pageContent = () => {
        return (
            <form onSubmit={handleSubmit(onSubmit as any)}>
                <Section text="Selecionar Transportadora">
                    <InputSection>
                        <InputSelectFieldEditSelector array={TransportatorSelection} label="Transportadora" onOptionSelected={onOptionSelected} />
                    </InputSection>
                </Section>

                <Section text="Dados da Transportadora">
                    <InputSection>
                        <InputTextFieldEdit formSetValue={setValue} editFrom={Transportator} label="Nome Da Transportadora" name="nome_empresa" register={register} hasChanged={hasChanged} />
                    </InputSection>
                    <InputSection>
                        <InputTextFieldEdit formSetValue={setValue} editFrom={Transportator} label="Email" name="email" register={register} hasChanged={hasChanged} />
                        <InputTextFieldEdit type="phone" formSetValue={setValue} editFrom={Transportator} label="Telefone" name="telefone" register={register} hasChanged={hasChanged} />
                    </InputSection>
                </Section>

                <Section text="Localização">
                    <InputSection>
                        <InputTextFieldEdit formSetValue={setValue} editFrom={Transportator} label="Endereço" name="endereco" register={register} hasChanged={hasChanged} />
                        <InputTextFieldEdit formSetValue={setValue} editFrom={Transportator} label="Bairro" name="bairro" register={register} hasChanged={hasChanged} />
                    </InputSection>
                    <InputSection>
                        <InputTextFieldEdit type="CEP" formSetValue={setValue} editFrom={Transportator} label="CEP" name="cep" register={register} hasChanged={hasChanged} />
                        <InputTextFieldEdit formSetValue={setValue} editFrom={Transportator} label="Cidade" name="cidade" register={register} hasChanged={hasChanged} />
                    </InputSection>
                    <InputSection>
                        <InputTextFieldEdit type="CNPJ" formSetValue={setValue} editFrom={Transportator} label="CNPJ" name="cnpj" register={register} hasChanged={hasChanged} />
                        <InputTextFieldEdit formSetValue={setValue} editFrom={Transportator} label="UF" name="uf" register={register} hasChanged={hasChanged} />
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