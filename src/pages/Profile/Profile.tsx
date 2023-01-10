import React, { useContext, useEffect } from "react"
import Avatar from '../../assets/imgs/male_avatar.png'
import { Container } from "../../components/Container/Container";
import { InputPictureField } from "../../components/forms/InputPictureField";
import { InputSection } from "../../components/forms/InputSection";
import { InputTextField } from "../../components/forms/InputTextField";
import { Section } from "../../components/forms/Section";
import { SubmitButton } from "../../components/Button/SubmitButton";
import { SubPageButton } from "../../components/Subpage/SubPageButton";
import { SubPageContainer } from "../../components/Subpage/SubPageContainer";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import swal from 'sweetalert';
import { User } from "../../types/User";
import { Main } from "../../components/Container/Main";

export const Profile = () => {

    const auth = useContext(AuthContext);

    const { register, handleSubmit, setValue } = useForm();
    const onSubmit = (data:any) => {
        console.log(data);
    }
    
    useEffect(() => {
        auth.getProfile().then((user:User) => {
            setValue('nome', user.nome);
            setValue('email', user.email);
            setValue('cliente', user.cliente);
            setValue('acesso', user.acesso);
            setValue('matricula', user.matricula);
            setValue('telefone', user.telefone);
            setValue('Image', user.imgUrl);
            auth.setPath("Home → Profile")
        }).catch((error) => {
            console.log(error)
            swal("Oops!", "Ocorreu um erro Inesperado, contate o suporte!", "error");
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const pageContent = () => {
        return (
            <Container>
                <Main>
                    <SubPageContainer>
                        <SubPageButton text="Perfil"/>
                    </SubPageContainer>
                    
                    <form onSubmit={handleSubmit(onSubmit as any)}>
                        <Section text="Dados de Usuário">
                            <InputSection>
                                <InputTextField label="Nome Completo" name="nome" register={register} disabled={true}/>
                                <InputTextField label="Email" name="email" register={register} disabled={true}/>
                            </InputSection>
                            <InputSection>
                                <InputTextField label="Empresa" name="cliente" register={register} disabled={true}/>
                                <InputTextField label="Acesso" name="acesso" register={register} disabled={true}/>
                            </InputSection>
                            <InputSection>
                                <InputTextField label="Matrícula" name="matricula" register={register} disabled={true}/>
                                <InputTextField label="Telefone" name="telefone" register={register} disabled={true}/>
                            </InputSection>
                        </Section>

                        <Section text="Selecionar Imagem" alignCenter={true}>
                            <InputPictureField defaultSrc={Avatar} name="image" setValue={setValue}/>
                        </Section>

                        <SubmitButton text="Editar"/>
                    </form>
                </Main>
            </Container>
        )
    }

    return(
        pageContent()
    )
} 