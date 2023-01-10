import React, { useContext, useEffect, useState } from "react";
import { InputSection } from "../../components/forms/InputSection";
import { InputTextField } from "../../components/forms/InputTextField";
import { Section } from "../../components/forms/Section";
import { SubmitButton } from "../../components/Button/SubmitButton";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import swal from "sweetalert";
import { firstLetterUpperCase } from "../../hooks/firstLetterUpperCase";
import { getFormatDate } from "../../hooks/getDate";
import { Transportator } from "../../types/Transportator";
import { transportatorsApi } from "../../apis/TransportatorsApi";
import LoadingPage from "../LoadingPage/LoadingPage";

export const TransportatorsRegister = () => {
    const auth = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        auth.setPath(
            "Home → Gerenciamento → Transportadoras → Empresas → Cadastrar Transportadoras"
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth.usersNameMap]);

    const { register, handleSubmit } = useForm();

    const onSubmit = (data: Transportator) => {
        try {
            validateFields(data);
            data.date = getFormatDate();
            data.status = "ativo";
        } catch (error) {
            if (error instanceof Error) {
                console.log(error);
                return swal("Oops!", error.message, "error");
            }
        }

        setIsLoading(true);

        transportatorsApi()
            .createTransportator(data)
            .then(async () => {
                setIsLoading(false);
                swal({
                    icon: "success",
                    title: "Transportadora Registrada com sucesso!",
                }).then(() => {
                    window.location.reload();
                });
            })
            .catch((error) => {
                setIsLoading(false);
                console.log(error);
                swal("Oops!", error.message, "error");
            });
    };

    const validateFields = (data: Transportator) => {
        Object.entries(data).forEach((field: any) => {
            if (field[1] === "")
                throw Error(
                    "O campo " +
                        firstLetterUpperCase(field[0]) +
                        " não foi Preenchido"
                );
        });
    };

    const pageContent = () => {
        return (
            <form onSubmit={handleSubmit(onSubmit as any)}>
                <Section text="Dados da Empresa">
                    <InputSection>
                        <InputTextField
                            label="Nome Da Transportadora"
                            name="nome_empresa"
                            register={register}
                        />
                    </InputSection>
                    <InputSection>
                        <InputTextField
                            label="Email"
                            name="email"
                            register={register}
                        />
                        <InputTextField
                            type="phone"
                            label="Telefone"
                            name="telefone"
                            register={register}
                        />
                    </InputSection>
                </Section>

                <Section text="Localização">
                    <InputSection>
                        <InputTextField
                            label="Endereço"
                            name="endereco"
                            register={register}
                        />
                        <InputTextField
                            label="Bairro"
                            name="bairro"
                            register={register}
                        />
                    </InputSection>
                    <InputSection>
                        <InputTextField
                            type="CEP"
                            label="CEP"
                            name="cep"
                            register={register}
                        />
                        <InputTextField
                            label="Cidade"
                            name="cidade"
                            register={register}
                        />
                    </InputSection>
                    <InputSection>
                        <InputTextField
                            type="CNPJ"
                            label="CNPJ"
                            name="cnpj"
                            register={register}
                        />
                        <InputTextField
                            label="UF"
                            name="uf"
                            register={register}
                        />
                    </InputSection>
                </Section>

                <SubmitButton text="Cadastrar" />
            </form>
        );
    };

    return isLoading ? <LoadingPage /> : pageContent();
};
