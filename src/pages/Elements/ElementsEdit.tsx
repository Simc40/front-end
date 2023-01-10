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
import { Construction } from "../../types/Construction";
import { InputSelectFieldEdit } from "../../components/forms/InputSelectFieldEdit";
import LoadingPage from "../LoadingPage/LoadingPage";
import { Element, getElementsInterface } from "../../types/Element";
import { Shape } from "../../types/Shape";
import { Geometry } from "../../types/Geometry";
import { elementsApi } from "../../apis/ElementsApi";
import { PictureField } from "../../components/forms/PictureField";
import GeometryDefaultImg from '../../assets/imgs/elemento-peca.png'


export const ElementsEdit = ({objects} : {objects:getElementsInterface}) => {

    let validFormValues:string[] = [];
    const auth = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, setValue } = useForm();
    const [element, setElement] = useState<Element | undefined>();
    const [elementSelectionValue, setElementSelectionValue] = useState('');
    const [elementsSelection, setElementsSelection] = useState<string[][] | (string | undefined)[][] | undefined>([]);
    const [src, setSrc] = useState(GeometryDefaultImg);

    useEffect(() => {
        auth.setPath("Home → Gerenciamento → Elementos → Editar Elementos")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const hasChanged = (name:string) => {
        validFormValues.push(name)
    }

    const onSubmit = (values:any) => {
        if (element === undefined) return swal("Oops!", "Nenhum Elemento foi Selecionado!", "error");
        Object.keys(values).forEach((name:string) => {if(!validFormValues.includes(name)) delete values[name]})
        if(Object.keys(values).length === 0) return swal("Oops!", "Nenhuma modificação foi realizada!", "error");
        values.date = getFormatDate();
        values.obra = element.obra;
        console.log(values)
        const result:{[uid:string] : Element}  = {[element.uid] : values}

        setIsLoading(true)

        elementsApi().editElement(result)
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

    const onConstructionOptionSelected = (event:ChangeEvent<HTMLSelectElement>) => {
        const getElementsFromConstruction = (uid:string) => {
            return Array.from(Object.values(objects.elements).filter((element:Element) => element.obra === uid)).map((element:Element) => {return [element.uid, element.nome_elemento]});
        }
        setElementsSelection(getElementsFromConstruction(event.target.value));
        setElementSelectionValue("");
        setSrc(GeometryDefaultImg)
        setElement(undefined);
        validFormValues = [];
    }

    const onElementOptionSelected = (event:ChangeEvent<HTMLSelectElement>) => {
        setElementSelectionValue(event.target.value);
        const getElement = (uid:string) => {
            return Array.from(Object.values(objects.elements).filter((element:Element) => element.uid === uid))[0];
        }
        const element = getElement(event.target.value)
        setElement(element);
        setSrc((element.geometry?.imgUrl === undefined) ? GeometryDefaultImg : element.geometry.imgUrl)
        validFormValues = [];
    }

    const onGeometryOptionSelected = (event:ChangeEvent<HTMLSelectElement> | undefined) => {
        const getGeometrySrc = (uid:string) => {
            return Array.from(Object.values(objects.geometries).filter((geometry:Geometry) => geometry.uid === uid))[0].imgUrl;
        }
        setSrc((getGeometrySrc(event!.target.value) === undefined) ? GeometryDefaultImg : getGeometrySrc(event!.target.value));
    }

    const constructionSelection = (objects.elements === undefined) ? [] : Array.from(new Set(Object.values(objects.elements).map((element: Element) => element.construction))).map((construction: Construction | undefined) => {return [construction!.uid, construction!.nome_obra]});
    const shapeSelection = (objects.shapes === undefined) ? [] : Array.from(Object.values(objects.shapes).map((shape: Shape) => [shape.uid, shape.nome_forma_secao]));
    const geometrySelection = (objects.geometries === undefined) ? [] : Array.from(Object.values(objects.geometries).map((geometry: Geometry) => [geometry.uid, geometry.nome_tipo_peca]));
    
    const pageContent = () => {
        return (
            <form onSubmit={handleSubmit(onSubmit as any)}>
                <Section text="Selecionar Obra">
                    <InputSection>
                        <InputSelectFieldEditSelector array={constructionSelection} label="Obra" onOptionSelected={onConstructionOptionSelected} />
                    </InputSection>
                </Section>

                <Section text="Selecionar Elemento">
                    <InputSection>
                        <InputSelectFieldEditSelector value={elementSelectionValue} array={elementsSelection} label="Elemento" onOptionSelected={onElementOptionSelected} />
                    </InputSection>
                </Section>

                <Section text="Dados do Elemento">
                    <InputSection>
                        <InputTextFieldEdit formSetValue={setValue} editFrom={element} label="Nome do Elemento" name="nome_elemento" register={register} hasChanged={hasChanged} />
                    </InputSection>
                    <InputSection>
                        <InputSelectFieldEdit array={shapeSelection} formSetValue={setValue} editFrom={element} label="Forma" name="forma" register={register} hasChanged={hasChanged} />
                        <InputSelectFieldEdit array={geometrySelection} onOptionSelected={onGeometryOptionSelected} formSetValue={setValue} editFrom={element} label="Tipo de Peça" name="tipo" register={register} hasChanged={hasChanged} />
                    </InputSection>
                </Section>

                <Section alignCenter={true}>
                    <PictureField src={src} />
                </Section>

                <Section text="Dimensão do Elemento">
                    <InputSection>
                        <InputTextFieldEdit type="number" formSetValue={setValue} editFrom={element} label="b (cm)" name="b" register={register} hasChanged={hasChanged} />
                        <InputTextFieldEdit type="number" formSetValue={setValue} editFrom={element} label="h (cm)" name="h" register={register} hasChanged={hasChanged} />
                    </InputSection>
                    <InputSection>
                        <InputTextFieldEdit type="number" formSetValue={setValue} editFrom={element} label="c (m)" name="c" register={register} hasChanged={hasChanged} />
                    </InputSection>
                </Section>

                <Section text="Planejamento">
                    <InputSection>
                        <InputTextFieldEdit type="number" formSetValue={setValue} editFrom={element} label="Número de Peças Planejadas" name="numMax" register={register} hasChanged={hasChanged} />
                    </InputSection>
                </Section>

                <Section text="Propriedades do Elemento">
                    <InputSection>
                        <InputTextFieldEdit type="number" formSetValue={setValue} editFrom={element} label="Fck Desforma (Mpa)" name="fckdesf" register={register} hasChanged={hasChanged} />
                        <InputTextFieldEdit type="number" formSetValue={setValue} editFrom={element} label="Fck Içamento (Mpa)" name="fckic" register={register} hasChanged={hasChanged} />
                    </InputSection>
                    <InputSection>
                        <InputTextFieldEdit type="number" formSetValue={setValue} editFrom={element} label="Volume (m³)" name="volume" register={register} hasChanged={hasChanged} />
                        <InputTextFieldEdit type="number" formSetValue={setValue} editFrom={element} label="Peso (Kg)" name="peso" register={register} hasChanged={hasChanged} />
                    </InputSection>
                    <InputSection>
                        <InputTextFieldEdit type="number" formSetValue={setValue} editFrom={element} label="Peso do Aço (Kg)" name="taxaaco" register={register} hasChanged={hasChanged} />
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