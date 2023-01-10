import React, { useContext, useEffect, useState } from "react";
import { InputPictureField } from "../../components/forms/InputPictureField";
import { InputSection } from "../../components/forms/InputSection";
import { InputTextField } from "../../components/forms/InputTextField";
import { Section } from "../../components/forms/Section";
import { SubmitButton } from "../../components/Button/SubmitButton";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import swal from "sweetalert";
import { AlertYellow } from "../../components/Alert/AlertYellow";
import Logo from "../../assets/imgs/generic-logo.jpg";
import { firstLetterUpperCase } from "../../hooks/firstLetterUpperCase";
import { ClientForm } from "../../types/Client";
import { getFormatDate } from "../../hooks/getDate";
import LoadingPage from "../LoadingPage/LoadingPage";
import { InputSelectField } from "../../components/forms/InputSelectField";

export const ClientsRegister = () => {
    const auth = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        auth.setPath("Home → Clientes → Cadastrar Cliente");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { register, handleSubmit, setValue } = useForm();

    const onSubmit = (data: ClientForm) => {
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

        auth.createClient(data)
            .then(async () => {
                setIsLoading(false);
                swal({
                    icon: "success",
                    title: "Cliente Registrado com sucesso!",
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

    const validateFields = (data: ClientForm) => {
        Object.entries(data).forEach((field: [string, string]) => {
            if (field[1] === "")
                throw Error(
                    "O campo " +
                        firstLetterUpperCase(field[0]) +
                        " não foi Preenchido"
                );
        });
        if (!data.database.startsWith("https://"))
            throw Error("O campo Database deve começar com 'https://'");
        if (!data.database.endsWith("/"))
            throw Error("O campo Database deve terminar com '/'");
        if (data.storage.startsWith("gs://"))
            throw Error("O campo Storage não pode começar com 'gs://'");
    };

    const ufArray = [
        ["AC", "AC"],
        ["AL", "AL"],
        ["AP", "AP"],
        ["AM", "AM"],
        ["BA", "BA"],
        ["CE", "CE"],
        ["DF", "DF"],
        ["ES", "ES"],
        ["GO", "GO"],
        ["MA", "MA"],
        ["MT", "MT"],
        ["MS", "MS"],
        ["MG", "MG"],
        ["PA", "PA"],
        ["PB", "PB"],
        ["PR", "PR"],
        ["PE", "PE"],
        ["PI", "PI"],
        ["RJ", "RJ"],
        ["RN", "RN"],
        ["RS", "RS"],
        ["RO", "RO"],
        ["RR", "RR"],
        ["SC", "SC"],
        ["SP", "SP"],
        ["SE", "SE"],
        ["TO", "TO"],
    ];

    const pageContent = () => {
        return (
            <form onSubmit={handleSubmit(onSubmit as any)}>
                <AlertYellow
                    children={
                        <>
                            Antes de cadastrar o Cliente, sincronize o banco de
                            dados!{" "}
                            <a href="/clientes/sincronizar_banco_de_dados">
                                Sincronizar banco de dados
                            </a>
                        </>
                    }
                />
                <Section text="Dados do Cliente">
                    <InputSection>
                        <InputTextField
                            label="Nome Do Cliente"
                            name="nome"
                            register={register}
                        />
                        <InputTextField
                            label="Email"
                            name="email"
                            register={register}
                        />
                    </InputSection>
                    <InputSection>
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
                        <InputSelectField
                            array={ufArray}
                            label="UF"
                            name="uf"
                            register={register}
                        />
                    </InputSection>
                </Section>

                <Section text="Banco de Dados">
                    <InputSection>
                        <AlertYellow
                            children={
                                <>
                                    O banco de dados deve ter formato:{" "}
                                    <u>
                                        https://simc-iot-example.firebaseio.com/
                                    </u>
                                </>
                            }
                        />
                        <AlertYellow
                            children={
                                <>
                                    O Storage deve ter formato:{" "}
                                    <u>simc-iot-example.appspot.com</u>{" "}
                                    (removendo-se o gs://)
                                </>
                            }
                        />
                    </InputSection>
                    <InputSection>
                        <InputTextField
                            label="Database"
                            name="database"
                            register={register}
                        />
                        <InputTextField
                            label="Storage"
                            name="storage"
                            register={register}
                        />
                    </InputSection>
                </Section>

                <Section text="Selecionar Logo-Marca" alignCenter={true}>
                    <InputPictureField
                        defaultSrc={Logo}
                        name="image"
                        setValue={setValue}
                    />
                </Section>

                <SubmitButton text="Cadastrar" />
            </form>
        );
    };

    return isLoading ? <LoadingPage /> : pageContent();
};
