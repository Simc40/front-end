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
import { Vehicle } from "../../types/Vehicle";

export const TransportatorVehiclesRegister = ({
    uid_transportadora,
}: {
    uid_transportadora?: string;
}) => {
    const auth = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        auth.setPath(
            "Home → Gerenciamento → Transportadoras → Veículos → Cadastrar Veículos"
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth.usersNameMap]);

    const { register, handleSubmit } = useForm();

    const onSubmit = (data: Vehicle) => {
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
            .createVehicle(data)
            .then(async () => {
                setIsLoading(false);
                swal({
                    icon: "success",
                    title: "Veículo Registrado com sucesso!",
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

    const validateFields = (data: Vehicle) => {
        if (uid_transportadora === undefined)
            throw Error("Nenhuma Transportadora foi Selecionada!");
        Object.entries(data).forEach((field: [string, string | Vehicle]) => {
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
                <Section text="Dados do Veículo">
                    <InputSection>
                        <InputTextField
                            label="Marca"
                            name="marca"
                            register={register}
                        />
                        <InputTextField
                            label="Modelo"
                            name="modelo"
                            register={register}
                        />
                    </InputSection>
                    <InputSection>
                        <InputTextField
                            label="Placa"
                            name="placa"
                            register={register}
                        />
                    </InputSection>
                </Section>

                <Section text="Características do Veículo">
                    <InputSection>
                        <InputTextField
                            label="Peso (Kg)"
                            name="peso"
                            type="number"
                            register={register}
                        />
                        <InputTextField
                            label="Número de Eixos (und)"
                            name="numero_eixos"
                            type="number"
                            register={register}
                        />
                    </InputSection>
                    <InputSection>
                        <InputTextField
                            label="Capacidade de Carga (Kg)"
                            name="capacidade_carga"
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
