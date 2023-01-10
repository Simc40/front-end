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
import { geometriesApi } from "../../apis/GeometriesApi";
import { Geometry } from "../../types/Geometry";
import { InputPictureFieldEdit } from "../../components/forms/InputPictureFieldEdit";
import GeometryDefaultImg from '../../assets/imgs/elemento-peca.png'
import LoadingPage from "../LoadingPage/LoadingPage";


export const GeometriesEdit = ({geometries} : {geometries:Geometry[] | undefined}) => {
    let validFormValues:string[] = [];

    const auth = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        auth.setPath("Home → Gerenciamento → Geometrias → Editar Geometrias")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { register, handleSubmit, setValue } = useForm();
    const [geometry, setGeometry] = useState<Geometry>();

    const onOptionSelected = (event:ChangeEvent<HTMLSelectElement>) => {
        const getGeometry = (uid:string) => {
            return Array.from(Object.values(geometries!).filter((geometry:Geometry) => geometry.uid === uid))[0];
        }
        setGeometry(getGeometry(event.target.value));
        validFormValues = [];
    }

    const hasChanged = (name:string) => {
        validFormValues.push(name)
    }

    const onSubmit = (values:any) => {
        console.log(values)
        if (geometry === undefined) return swal("Oops!", "Nenhuma Geometria foi Selecionada!", "error");
        Object.keys(values).forEach((name:string) => {if(!validFormValues.includes(name)) delete values[name]})
        if(Object.keys(values).length === 0) return swal("Oops!", "Nenhuma modificação foi realizada!", "error");
        values.date = getFormatDate();
        console.log(values)
        const result:{[uid:string] : Geometry}  = {[geometry.uid] : values}

        setIsLoading(true)

        geometriesApi().editGeometry(result)
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

    const geometrySelection = (geometries === undefined) ? undefined : Array.from(Object.values(geometries).map((geometry: Geometry) => [geometry.uid, geometry.nome_tipo_peca]));


    const pageContent = () => {
        return (
            <form onSubmit={handleSubmit(onSubmit as any)}>
                <Section text="Selecionar Geometria">
                    <InputSection>
                        <InputSelectFieldEditSelector array={geometrySelection} label="Geometria" onOptionSelected={onOptionSelected} />
                    </InputSection>
                </Section>

                <Section text="Dados de Geometria">
                    <InputSection>
                        <InputTextFieldEdit formSetValue={setValue} editFrom={geometry} label="Nome Da Geometria" name="nome_tipo_peca" register={register} hasChanged={hasChanged} />
                    </InputSection>
                </Section>


                <Section text="Selecionar Imagem" alignCenter={true}>
                    <InputPictureFieldEdit formSetValue={setValue} editFrom={geometry} defaultSrc={GeometryDefaultImg} name="image" hasChanged={hasChanged}/>
                </Section>

                <SubmitButton text="Atualizar"/>
            </form>
        )
    }

    return(
        isLoading ? <LoadingPage/> : pageContent()
    )
} 