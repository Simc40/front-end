import React, { ChangeEvent, useContext, useEffect, useState } from "react"
import { InputSection } from "../../components/forms/InputSection";
import { Section } from "../../components/forms/Section";
import { SubmitButton } from "../../components/Button/SubmitButton";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import swal from 'sweetalert';
import Logo from '../../assets/imgs/generic-logo.jpg'
import { InputSelectFieldEditSelector } from "../../components/forms/InputSelectFieldEditSelector";
import { Client } from "../../types/Client";
import { InputTextFieldEdit } from "../../components/forms/InputTextFieldEdit";
import { InputPictureFieldEdit } from "../../components/forms/InputPictureFieldEdit";
import { getFormatDate } from "../../hooks/getDate";
import LoadingPage from "../LoadingPage/LoadingPage";
import { InputSelectFieldEdit } from "../../components/forms/InputSelectFieldEdit";

export const ClientsEdit = ({clients} : {clients:Client[] | undefined}) => {

    let validFormValues:string[] = [];

    const auth = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        auth.setPath("Home → Clientes → Editar Cliente")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { register, handleSubmit, setValue } = useForm();
    const [client, setClient] = useState<Client>();

    const onOptionSelected = (event:ChangeEvent<HTMLSelectElement>) => {
        const getClient = (uid:string) => {
            return Array.from(Object.values(clients!).filter((client:Client) => client.uid === uid))[0];
        }
        setClient(getClient(event.target.value));
        validFormValues = [];
    }

    const hasChanged = (name:string) => {
        validFormValues.push(name)
    }

    const onSubmit = (result:any) => {
        if (client === undefined) return swal("Oops!", "Nenhum Cliente foi Selecionado!", "error");
        Object.keys(result).forEach((name:string) => {if(!validFormValues.includes(name)) delete result[name]})
        if(Object.keys(result).length === 0) return swal("Oops!", "Nenhuma modificação foi realizada!", "error");
        result.date = getFormatDate();
        if(result.image !== undefined) result.storage = client.storage;
        result = {[client.uid] : result}
        
        setIsLoading(true)

        auth.editClient(result)
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

    const clientSelection = (clients === undefined) ? undefined : Array.from(Object.values(clients).map((client: Client) => [client.uid, client.nome]));
    const ufArray = [["AC", "AC"], ["AL", "AL"], ["AP", "AP"], ["AM", "AM"], ["BA", "BA"], ["CE", "CE"], ["DF", "DF"], ["ES", "ES"], ["GO", "GO"], ["MA", "MA"], ["MT", "MT"], ["MS", "MS"], ["MG", "MG"], ["PA", "PA"], ["PB", "PB"], ["PR", "PR"], ["PE", "PE"], ["PI", "PI"], ["RJ", "RJ"], ["RN", "RN"], ["RS", "RS"], ["RO", "RO"], ["RR", "RR"], ["SC", "SC"], ["SP", "SP"], ["SE", "SE"], ["TO", "TO"]]

    const pageContent = () => {
        return (
            <form onSubmit={handleSubmit(onSubmit as any)}>
                <Section text="Selecionar Cliente">
                    <InputSection>
                        <InputSelectFieldEditSelector array={clientSelection} label="Cliente" onOptionSelected={onOptionSelected} />
                    </InputSection>
                </Section>

                <Section text="Dados do Cliente">
                    <InputSection>
                        <InputTextFieldEdit formSetValue={setValue} editFrom={client} label="Nome Do Cliente" name="nome" register={register} hasChanged={hasChanged} />
                        <InputTextFieldEdit formSetValue={setValue} editFrom={client} label="Email" name="email" register={register} hasChanged={hasChanged} />
                    </InputSection>
                    <InputSection>
                        <InputTextFieldEdit type="phone" formSetValue={setValue} editFrom={client} label="Telefone" name="telefone" register={register} hasChanged={hasChanged} />
                    </InputSection>
                </Section>

                <Section text="Localização">
                    <InputSection>
                        <InputTextFieldEdit formSetValue={setValue} editFrom={client} label="Endereço" name="endereco" register={register} hasChanged={hasChanged} />
                        <InputTextFieldEdit formSetValue={setValue} editFrom={client} label="Bairro" name="bairro" register={register} hasChanged={hasChanged} />
                    </InputSection>
                    <InputSection>
                        <InputTextFieldEdit type="CEP" formSetValue={setValue} editFrom={client} label="CEP" name="cep" register={register} hasChanged={hasChanged} />
                        <InputTextFieldEdit formSetValue={setValue} editFrom={client} label="Cidade" name="cidade" register={register} hasChanged={hasChanged} />
                    </InputSection>
                    <InputSection>
                        <InputTextFieldEdit type="CNPJ" formSetValue={setValue} editFrom={client} label="CNPJ" name="cnpj" register={register} hasChanged={hasChanged} />
                        <InputSelectFieldEdit array={ufArray} formSetValue={setValue} editFrom={client} label="UF" name="uf" register={register} hasChanged={hasChanged} />
                    </InputSection>
                </Section>

                <Section text="Banco de Dados">
                    <InputSection>
                        <InputTextFieldEdit formSetValue={setValue} editFrom={client} label="Database" name="database" register={register} hasChanged={hasChanged} />
                        <InputTextFieldEdit formSetValue={setValue} editFrom={client} label="Storage" name="storage" register={register} hasChanged={hasChanged} />
                    </InputSection>
                </Section>

                <Section text="Selecionar Logo-Marca" alignCenter={true}>
                    <InputPictureFieldEdit formSetValue={setValue} editFrom={client} defaultSrc={Logo} name="image" hasChanged={hasChanged}/>
                </Section>

                <SubmitButton text="Atualizar"/>
            </form>
        )
    }

    return(
        isLoading ? <LoadingPage/> : pageContent()
    )
} 