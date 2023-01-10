import React, { ChangeEvent, useContext, useEffect, useState } from "react"
import { InputSection } from "../../components/forms/InputSection";
import { Section } from "../../components/forms/Section";
import { SubmitButton } from "../../components/Button/SubmitButton";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import swal from 'sweetalert';
import { InputSelectFieldEditSelector } from "../../components/forms/InputSelectFieldEditSelector";
import { InputTextFieldEdit } from "../../components/forms/InputTextFieldEdit";
import { getFormatDate } from "../../hooks/getDate";
import LoadingPage from "../LoadingPage/LoadingPage";
import { Shape } from "../../types/Shape";
import { shapesApi } from "../../apis/ShapesApi";


export const ShapesEdit = ({shapes} : {shapes:Shape[] | undefined}) => {
    let validFormValues:string[] = [];

    const auth = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        auth.setPath("Home → Gerenciamento → Formas → Editar Formas")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { register, handleSubmit, setValue } = useForm();
    const [shape, setShape] = useState<Shape>();

    const onOptionSelected = (event:ChangeEvent<HTMLSelectElement>) => {
        const getShape = (uid:string) => {
            return Array.from(Object.values(shapes!).filter((shape:Shape) => shape.uid === uid))[0];
        }
        setShape(getShape(event.target.value));
        validFormValues = [];
    }

    const hasChanged = (name:string) => {
        validFormValues.push(name)
    }

    const onSubmit = (values:any) => {
        console.log(values)
        if (shape === undefined) return swal("Oops!", "Nenhuma Forma foi Selecionada!", "error");
        Object.keys(values).forEach((name:string) => {if(!validFormValues.includes(name)) delete values[name]})
        if(Object.keys(values).length === 0) return swal("Oops!", "Nenhuma modificação foi realizada!", "error");
        values.date = getFormatDate();
        console.log(values)
        const result:{[uid:string] : Shape}  = {[shape.uid] : values}

        setIsLoading(true)

        shapesApi().editShape(result)
        .then(async () => {
            setIsLoading(false)
            return swal({
                icon: 'success',
                title: 'Mudanças realizadas com sucesso',
            }).then(() => {
                window.location.reload()
            })
        }).catch((error) => {
            setIsLoading(false)
            console.log(error);
            swal("Oops!", "Ocorreu um erro Inesperado, contate o suporte!", "error");
        })
    }

    const shapesSelection = (shapes === undefined) ? undefined : Array.from(Object.values(shapes).map((shape: Shape) => [shape.uid, shape.nome_forma_secao]));

    const pageContent = () => {
        return (
            <form onSubmit={handleSubmit(onSubmit as any)}>
                <Section text="Selecionar Forma">
                    <InputSection>
                        <InputSelectFieldEditSelector array={shapesSelection} label="Forma" onOptionSelected={onOptionSelected} />
                    </InputSection>
                </Section>

                <Section text="Dados da Forma">
                    <InputSection>
                        <InputTextFieldEdit formSetValue={setValue} editFrom={shape} label="Nome Da Forma" name="nome_forma" register={register} hasChanged={hasChanged} />
                    </InputSection>
                    <InputSection>
                    <InputTextFieldEdit formSetValue={setValue} editFrom={shape} label="b (cm)" name="b" type="number" register={register} hasChanged={hasChanged} />
                    <InputTextFieldEdit formSetValue={setValue} editFrom={shape} label="h (cm)" name="h" type="number" register={register} hasChanged={hasChanged} />
                    </InputSection>
                </Section>

                <SubmitButton text="Atualizar"/>
            </form>
        )
    }

    return(
        isLoading ? <LoadingPage/> : pageContent()
    )
} 