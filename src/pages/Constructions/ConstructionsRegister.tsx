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
import { Construction } from "../../types/Construction";
import { User } from "../../types/User";
import { InputSelectField } from "../../components/forms/InputSelectField";
import { constructionApi } from "../../apis/ConstructionApi";
import { InputDateField } from "../../components/forms/InputDateField";
import LoadingPage from "../LoadingPage/LoadingPage";

export const ConstructionsRegister = ({
    constructions,
}: {
    constructions: Construction[];
}) => {
    const auth = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    const consructionApi = constructionApi();

    useEffect(() => {
        auth.setPath("Home → Gerenciamento → Obras → Cadastrar Obras");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth.usersNameMap]);

    const { register, handleSubmit, setValue } = useForm();

    const onSubmit = (data: Construction) => {
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

        consructionApi
            .createConstruction(data)
            .then(async () => {
                setIsLoading(false);
                swal({
                    icon: "success",
                    title: "Obra Registrada com sucesso!",
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

    const validateFields = (data: Construction) => {
        Object.entries(data).forEach((field: [string, string | User]) => {
            if (field[1] === "")
                throw Error(
                    "O campo " +
                        firstLetterUpperCase(field[0]) +
                        " não foi Preenchido"
                );
        });
        if (
            constructions
                .map((construction: Construction) =>
                    construction.nome_obra.toLowerCase()
                )
                .includes(data.nome_obra.toLowerCase())
        )
            throw Error(
                `Já existe uma Obra cadastrada com o nome ${data.nome_obra}`
            );
    };

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
    ];

    const pageContent = () => {
        return (
            <form onSubmit={handleSubmit(onSubmit as any)}>
                <Section text="Dados da Obra">
                    <InputSection>
                        <InputTextField
                            label="Nome Da Obra"
                            name="nome_obra"
                            register={register}
                        />
                    </InputSection>
                    <InputSection>
                        <InputSelectField
                            array={auth.usersNameMap}
                            label="Responsável"
                            name="responsavel"
                            register={register}
                        />
                        <InputSelectField
                            array={constructionTypeSelection}
                            label="Tipo de Construcao"
                            name="tipo_construcao"
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

                <Section text="Informações de Projeto">
                    <InputSection>
                        <InputTextField
                            label="Quantidade de Peças"
                            name="quantidade_pecas"
                            type="number"
                            register={register}
                        />
                    </InputSection>
                    <InputSection>
                        <InputDateField
                            label="Previsão de Início"
                            name="previsao_inicio"
                            setFormValue={setValue}
                            register={register}
                        />
                        <InputDateField
                            label="Previsão de Entrega"
                            name="previsao_entrega"
                            setFormValue={setValue}
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
