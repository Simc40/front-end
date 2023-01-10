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
import { User } from "../../types/User";
import { InputPictureField } from "../../components/forms/InputPictureField";
import GeometryDefaultImg from "../../assets/imgs/elemento-peca.png";
import { Geometry } from "../../types/Geometry";
import { geometriesApi } from "../../apis/GeometriesApi";
import LoadingPage from "../LoadingPage/LoadingPage";

export const GeometriesRegister = ({
    geometries,
}: {
    geometries: Geometry[];
}) => {
    const auth = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        auth.setPath(
            "Home → Gerenciamento → Geometrias → Cadastrar Geometrias"
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth.usersNameMap]);

    const { register, handleSubmit, setValue } = useForm();

    const onSubmit = (data: Geometry) => {
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

        geometriesApi()
            .createGeometry(data)
            .then(async () => {
                setIsLoading(false);
                swal({
                    icon: "success",
                    title: "Geomatria Registrada com sucesso!",
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

    const validateFields = (data: Geometry) => {
        Object.entries(data).forEach((field: [string, string | User]) => {
            if (field[1] === "")
                throw Error(
                    "O campo " +
                        firstLetterUpperCase(field[0]) +
                        " não foi Preenchido"
                );
        });
        if (
            geometries
                .map((geometry: Geometry) =>
                    geometry.nome_tipo_peca.toLowerCase()
                )
                .includes(data.nome_tipo_peca.toLowerCase())
        )
            throw Error(
                `Já existe uma Geomatria cadastrada com o nome ${data.nome_tipo_peca}`
            );
    };

    const pageContent = () => {
        return (
            <form onSubmit={handleSubmit(onSubmit as any)}>
                <Section text="Dados da Geometria">
                    <InputSection>
                        <InputTextField
                            label="Nome Da Geometria"
                            name="nome_tipo_peca"
                            register={register}
                        />
                    </InputSection>
                </Section>

                <Section
                    text="Selecionar Imagem de Geometria"
                    alignCenter={true}
                >
                    <InputPictureField
                        defaultSrc={GeometryDefaultImg}
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
