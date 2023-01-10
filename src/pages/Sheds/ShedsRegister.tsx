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
import { InputSelectField } from "../../components/forms/InputSelectField";
import LoadingPage from "../LoadingPage/LoadingPage";
import { shedsApi } from "../../apis/ShedsApi";
import { Shed } from "../../types/Shed";

export const ShedsRegister = () => {
    const auth = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        auth.setPath("Home → Gerenciamento → Galpões → Cadastrar Galpão");

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth.usersNameMap]);

    const { register, handleSubmit } = useForm();

    const onSubmit = (data: Shed) => {
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

        shedsApi()
            .createShed(data)
            .then(async () => {
                setIsLoading(false);
                swal({
                    icon: "success",
                    title: "Galpão Registrado com sucesso!",
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

    const validateFields = (data: Shed) => {
        Object.entries(data).forEach((field: [string, string | Shed]) => {
            if (field[1] === "")
                throw Error(
                    "O campo " +
                        firstLetterUpperCase(field[0]) +
                        " não foi Preenchido"
                );
        });
    };

    const shedStatus = [
        ["ativo", "Disponível"],
        ["inativo", "Indisponível"],
    ];

    const pageContent = () => {
        return (
            <form onSubmit={handleSubmit(onSubmit as any)}>
                <Section text="Dados Do Galpão">
                    <InputSection>
                        <InputTextField
                            label="Nome Do Galpão"
                            name="nome_galpao"
                            register={register}
                        />
                    </InputSection>
                    <InputSection>
                        <InputSelectField
                            array={shedStatus}
                            label="Disponibilidade"
                            name="status"
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
