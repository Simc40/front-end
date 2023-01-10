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
import LoadingPage from "../LoadingPage/LoadingPage";
import { InputPictureFieldEdit } from "../../components/forms/InputPictureFieldEdit";
import Avatar from '../../assets/imgs/male_avatar.png'
import { User } from "../../types/User";
import { manageAcessApi } from "../../apis/ManageAcessApi";
import { InputSelectFieldEdit } from "../../components/forms/InputSelectFieldEdit";


export const UserEdit = () => {
    let validFormValues:string[] = [];

    const auth = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        auth.setPath("Home → Gerenciamento → Acessos → Editar Usuário")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { register, handleSubmit, setValue } = useForm();
    const [user, setUser] = useState<User>();

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

    const onOptionSelected = (event:ChangeEvent<HTMLSelectElement>) => {
        setUser(auth.usersMap.get(event.target.value));
        validFormValues = [];
    }

    const hasChanged = (name:string) => {
        validFormValues.push(name)
    }

    const onSubmit = (values:any) => {
        if (user === undefined) return swal("Oops!", "Nenhum Motorista foi Selecionado!", "error");
        Object.keys(values).forEach((name:string) => {if(!validFormValues.includes(name)) delete values[name]})
        if(Object.keys(values).length === 0) return swal("Oops!", "Nenhuma modificação foi realizada!", "error");
        values.date = getFormatDate();
        console.log(values)
        const result:{[uid:string] : User}  = {[user.uid!] : values}

        setIsLoading(true)

        manageAcessApi().editUser(result)
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
                <Section text="Selecionar Motorista">
                    <InputSection>
                        <InputSelectFieldEditSelector array={auth.usersNameMap} label="Usuário" onOptionSelected={onOptionSelected} />
                    </InputSection>
                </Section>

                <Section text="Dados do Motorista">
                    <InputSection>
                        <InputTextFieldEdit formSetValue={setValue} editFrom={user} label="Nome Completo" name="nome" register={register} hasChanged={hasChanged} />
                        <InputTextFieldEdit formSetValue={setValue} editFrom={user} label="Email" name="email" register={register} disabled={true} hasChanged={hasChanged} />
                    </InputSection>
                    <InputSection>
                        <InputSelectFieldEdit array={[[auth.user?.clienteUid, auth.user?.cliente]]} formSetValue={setValue} editFrom={user} label="Empresa" name="cliente" register={register} hasChanged={hasChanged} />
                        <InputSelectFieldEdit array={accessTypesArray} formSetValue={setValue} editFrom={user} label="Acesso" name="acesso" register={register} hasChanged={hasChanged} />
                    </InputSection>
                    <InputSection>
                        <InputTextFieldEdit formSetValue={setValue} editFrom={user} label="Matrícula" name="matricula" register={register} hasChanged={hasChanged} />
                        <InputTextFieldEdit type="phone" formSetValue={setValue} editFrom={user} label="Telefone" name="telefone" register={register} hasChanged={hasChanged} />
                    </InputSection>
                </Section>

                <Section text="Selecionar Imagem" alignCenter={true}>
                    <InputPictureFieldEdit formSetValue={setValue} editFrom={user} defaultSrc={Avatar} name="image" hasChanged={hasChanged}/>
                </Section>

                <SubmitButton text="Atualizar"/>
            </form>
        )
    }

    return(
        isLoading ? <LoadingPage/> : pageContent()
    )
} 