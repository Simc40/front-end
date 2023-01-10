import React, { ChangeEvent, useContext, useEffect, useState } from "react";
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
import { InputSelectField } from "../../components/forms/InputSelectField";
import LoadingPage from "../LoadingPage/LoadingPage";
import { Element, getElementsInterface } from "../../types/Element";
import { Geometry } from "../../types/Geometry";
import { Shape } from "../../types/Shape";
import { PictureField } from "../../components/forms/PictureField";
import GeometryDefaultImg from "../../assets/imgs/elemento-peca.png";
import { elementsApi } from "../../apis/ElementsApi";

export const ElementsRegister = ({
    objects,
}: {
    objects: getElementsInterface;
}) => {
    const auth = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [src, setSrc] = useState(GeometryDefaultImg);

    useEffect(() => {
        auth.setPath("Home → Gerenciamento → Elementos → Cadastrar Elementos");

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth.usersNameMap]);

    const { register, handleSubmit } = useForm();

    const onSubmit = (data: Element) => {
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

        console.log(data);

        elementsApi()
            .createElement(data)
            .then(async () => {
                setIsLoading(false);
                swal({
                    icon: "success",
                    title: "Elemento Registrado com sucesso!",
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

    const validateFields = (data: Element) => {
        Object.entries(data).forEach(
            (field: [string, string | Shape | Construction | Geometry]) => {
                if (field[1] === "")
                    throw Error(
                        "O campo " +
                            firstLetterUpperCase(field[0]) +
                            " não foi Preenchido"
                    );
            }
        );
        if (
            objects.elements
                .map((element: Element) => element.nome_elemento.toLowerCase())
                .includes(data.nome_elemento.toLowerCase())
        )
            throw Error(
                `Já existe um Elemento cadastrado com o nome ${data.nome_elemento}`
            );
    };

    const onOptionSelected = (event: ChangeEvent<HTMLSelectElement>) => {
        const getGeometrySrc = (uid: string) => {
            return Array.from(
                Object.values(objects.geometries).filter(
                    (geometry: Geometry) => geometry.uid === uid
                )
            )[0].imgUrl;
        };
        setSrc(
            getGeometrySrc(event.target.value) === undefined
                ? GeometryDefaultImg
                : getGeometrySrc(event.target.value)
        );
    };

    const constructionSelection =
        objects.constructions === undefined
            ? []
            : Array.from(
                  Object.values(objects.constructions).map(
                      (construction: Construction) => [
                          construction.uid,
                          construction.nome_obra,
                      ]
                  )
              );
    const shapeSelection =
        objects.shapes === undefined
            ? []
            : Array.from(
                  Object.values(objects.shapes).map((shape: Shape) => [
                      shape.uid,
                      shape.nome_forma_secao,
                  ])
              );
    const geometrySelection =
        objects.geometries === undefined
            ? []
            : Array.from(
                  Object.values(objects.geometries).map(
                      (geometry: Geometry) => [
                          geometry.uid,
                          geometry.nome_tipo_peca,
                      ]
                  )
              );

    const pageContent = () => {
        return (
            <form onSubmit={handleSubmit(onSubmit as any)}>
                <Section text="Selecionar Obra">
                    <InputSection>
                        <InputSelectField
                            array={constructionSelection}
                            label="Obra"
                            name="obra"
                            register={register}
                        />
                    </InputSection>
                </Section>

                <Section text="Dados do Elemento">
                    <InputSection>
                        <InputTextField
                            label="Nome do Elemento"
                            name="nome_elemento"
                            register={register}
                        />
                    </InputSection>
                    <InputSection>
                        <InputSelectField
                            array={shapeSelection}
                            label="Forma"
                            name="forma"
                            register={register}
                        />
                        <InputSelectField
                            array={geometrySelection}
                            label="Tipo de Peça"
                            name="tipo"
                            onOptionSelected={onOptionSelected}
                            register={register}
                        />
                    </InputSection>
                </Section>

                <Section alignCenter={true}>
                    <PictureField src={src} />
                </Section>

                <Section text="Dimensão do Elemento">
                    <InputSection>
                        <InputTextField
                            type="number"
                            label="b (cm)"
                            name="b"
                            register={register}
                        />
                        <InputTextField
                            type="number"
                            label="h (cm)"
                            name="h"
                            register={register}
                        />
                    </InputSection>
                    <InputSection>
                        <InputTextField
                            type="number"
                            label="c (m)"
                            name="c"
                            register={register}
                        />
                    </InputSection>
                </Section>

                <Section text="Planejamento">
                    <InputSection>
                        <InputTextField
                            type="number"
                            label="Numero de Peças Planejadas"
                            name="numMax"
                            register={register}
                        />
                    </InputSection>
                </Section>

                <Section text="Propriedades do Elemento">
                    <InputSection>
                        <InputTextField
                            type="number"
                            label="Fck Desforma (Mpa)"
                            name="fckdesf"
                            register={register}
                        />
                        <InputTextField
                            type="number"
                            label="Fck Içamento (Mpa)"
                            name="fckic"
                            register={register}
                        />
                    </InputSection>
                    <InputSection>
                        <InputTextField
                            type="number"
                            label="Volume (m³)"
                            name="volume"
                            register={register}
                        />
                        <InputTextField
                            type="number"
                            label="Peso (Kg)"
                            name="peso"
                            register={register}
                        />
                    </InputSection>
                    <InputSection>
                        <InputTextField
                            type="number"
                            label="Peso do Aço (Kg)"
                            name="taxaaco"
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
