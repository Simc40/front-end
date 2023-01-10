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
import { InputPictureField } from "../../components/forms/InputPictureField";
import Avatar from "../../assets/imgs/male_avatar.png";
import { InputSelectField } from "../../components/forms/InputSelectField";
import { User } from "../../types/User";
import { manageAcessApi } from "../../apis/ManageAcessApi";

export const UserRegister = ({
    uid_transportadora,
}: {
    uid_transportadora?: string;
}) => {
    const auth = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const activityAccesses = {
        Aplicativo: "inativo",
        "Aplicativo -> Relatórios": "inativo",
        Website: "inativo",
        "Website -> Gerenciamento": "inativo",
        "Website -> Gerenciamento -> Acesso": "inativo",
        "Website -> Gerenciamento -> BIM": "inativo",
        "Website -> Gerenciamento -> Checklist": "inativo",
        "Website -> Gerenciamento -> Elementos": "inativo",
        "Website -> Gerenciamento -> Formas": "inativo",
        "Website -> Gerenciamento -> Galpões": "inativo",
        "Website -> Gerenciamento -> Geometrias": "inativo",
        "Website -> Gerenciamento -> Obras": "inativo",
        "Website -> Gerenciamento -> PDF": "inativo",
        "Website -> Gerenciamento -> Transportadoras": "inativo",
        "Website -> Logística": "inativo",
        "Website -> Planejamento": "inativo",
        "Website -> Relatórios": "inativo",
    };

    const accessTypesArray =
        auth.user?.acesso === "admin"
            ? [
                  ["497ed826-c29f-4dc3-964b-d491f54a2a2f", "usuario"],
                  ["49481bb2-4aa9-4266-ba2b-3d2faa6258a0", "responsavel"],
                  ["685fe674-9d61-4946-8435-9cbc23a1fc8a", "admin"],
              ]
            : [
                  ["497ed826-c29f-4dc3-964b-d491f54a2a2f", "usuario"],
                  ["49481bb2-4aa9-4266-ba2b-3d2faa6258a0", "responsavel"],
              ];

    useEffect(() => {
        auth.setPath("Home → Gerenciamento → Acessos → Cadastrar Usuário");

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth.usersNameMap]);

    const { register, handleSubmit, setValue } = useForm();

    const onSubmit = (data: User) => {
        try {
            validateFields(data);
            data.date = getFormatDate();
            data.status = "ativo";
            data.acessos_atividades = activityAccesses;
        } catch (error) {
            if (error instanceof Error) {
                console.log(error);
                return swal("Oops!", error.message, "error");
            }
        }

        setIsLoading(true);

        manageAcessApi()
            .createUser(data)
            .then(async () => {
                setIsLoading(false);
                swal({
                    icon: "success",
                    title: "Usuário Registrado com sucesso!",
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

    const validateFields = (data: User) => {
        Object.entries(data).forEach((field: [string, string | any]) => {
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
                        <InputSelectField
                            array={[
                                [auth.user?.clienteUid, auth.user?.cliente],
                            ]}
                            label="cliente"
                            name="cliente"
                            register={register}
                        />
                        <InputSelectField
                            array={accessTypesArray}
                            label="Acesso"
                            name="acesso"
                            register={register}
                        />
                    </InputSection>
                    <InputSection>
                        <InputTextField
                            label="Matricula"
                            name="matricula"
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
