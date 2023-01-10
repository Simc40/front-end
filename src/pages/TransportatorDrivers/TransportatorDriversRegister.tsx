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
import { transportatorsApi } from "../../apis/TransportatorsApi";
import LoadingPage from "../LoadingPage/LoadingPage";
import { InputPictureField } from "../../components/forms/InputPictureField";
import Avatar from "../../assets/imgs/male_avatar.png";
import { Driver } from "../../types/Driver";

export const TransportatorDriversRegister = ({
    uid_transportadora,
}: {
    uid_transportadora?: string;
}) => {
    const auth = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        auth.setPath(
            "Home → Gerenciamento → Transportadoras → Motoristas → Cadastrar Motoristas"
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth.usersNameMap]);

    const { register, handleSubmit, setValue } = useForm();

    const onSubmit = (data: Driver) => {
        try {
            validateFields(data);
            data.date = getFormatDate();
            data.status = "ativo";
            data.uid_transportadora = uid_transportadora!;
        } catch (error) {
            if (error instanceof Error) {
                console.log(error);
                return swal("Oops!", error.message, "error");
            }
        }

        setIsLoading(true);

        transportatorsApi()
            .createDriver(data)
            .then(async () => {
                setIsLoading(false);
                swal({
                    icon: "success",
                    title: "Motorista Registrado com sucesso!",
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

    const validateFields = (data: Driver) => {
        if (uid_transportadora === undefined)
            throw Error("Nenhuma Transportadora foi Selecionada!");
        Object.entries(data).forEach((field: [string, string | Driver]) => {
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
                <Section text="Dados do Motorista">
                    <InputSection>
                        <InputTextField
                            label="Nome Completo"
                            name="nome_motorista"
                            register={register}
                        />
                        <InputTextField
                            type="CNH"
                            label="CNH"
                            name="cnh"
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

                <Section text="Selecionar Imagem" alignCenter={true}>
                    <InputPictureField
                        defaultSrc={Avatar}
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
