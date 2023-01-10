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
import LoadingPage from "../LoadingPage/LoadingPage";
import { Shape } from "../../types/Shape";
import { shapesApi } from "../../apis/ShapesApi";

export const ShapesRegister = () => {
    const auth = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    const shapeApi = shapesApi();

    useEffect(() => {
        auth.setPath("Home → Gerenciamento → Formas → Cadastrar Formas");

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth.usersNameMap]);

    const { register, handleSubmit } = useForm();

    const onSubmit = (data: Shape) => {
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

        shapeApi
            .createShape(data)
            .then(async () => {
                setIsLoading(false);
                swal({
                    icon: "success",
                    title: "Forma Registrada com sucesso!",
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

    const validateFields = (data: Shape) => {
        Object.entries(data).forEach((field: [string, string | Shape]) => {
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
                <Section text="Dados da Forma">
                    <InputSection>
                        <InputTextField
                            label="Nome Da Forma"
                            name="nome_forma"
                            register={register}
                        />
                    </InputSection>
                    <InputSection>
                        <InputTextField
                            label="b (cm)"
                            name="b"
                            type="number"
                            register={register}
                        />
                        <InputTextField
                            label="h (cm)"
                            name="h"
                            type="number"
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
