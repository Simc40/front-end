import React, { ChangeEvent, useContext, useEffect, useState } from "react"
import './main.scss'
import { Construction } from "../../types/Construction";
import { InputSelectFieldEditSelector } from "../../components/forms/InputSelectFieldEditSelector";
import { Section } from "../../components/forms/Section";
import { ApiFirebaseBIM, RVT } from "../../types/Forge";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import ViewerSyncronization from "./ViewerSyncronization";
import { Element, getElementsInterface } from "../../types/Element";

export const BimSyncronization = ({BIM, constructions, elements, setIsLoading} : {setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, elements: getElementsInterface, BIM?: ApiFirebaseBIM, constructions?: Construction[]}) => {

    const auth = useContext(AuthContext);
    const [urn, setUrn] = useState('');
    const [nomeObraModelo, setNomeObraModelo] = useState('');
    const [constructionUid, setConstructionUid] = useState('');

    useEffect(() => {
        auth.setPath("Home → Gerenciamento → BIM → Visualizar Modelos")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urn]);

    const constructionsWithBIM = BIM === undefined ? [] : Array.from(Object.keys(BIM))
    const constructionSelection = (constructions === undefined) ? [] : Array.from(Object.values(constructions).filter((construction: Construction) => constructionsWithBIM.includes(construction.uid)).map((construction: Construction) => [construction.uid, construction.nome_obra]));

    const onConstructionSelected = (event:ChangeEvent<HTMLSelectElement>) => {
        setConstructionUid(event.target.value);
        Object.values(BIM![event.target.value]).forEach((rvt: RVT) => {
            if(rvt.status === "ativo"){
                setNomeObraModelo(`Modelo BIM - ${event.target.options[event.target.selectedIndex].text} - ${rvt.nome_rvt}`)
                setUrn(rvt.urn!);
            }
        })
    }

    const pageContent = () => {
        return (
            <>
                <Section text="Selecionar Obra">
                    <InputSelectFieldEditSelector array={constructionSelection} label="Obra" onOptionSelected={onConstructionSelected} />
                </Section>
                
                {urn === '' ? <></> : <ViewerSyncronization setIsLoading={setIsLoading} urn={urn} nomeObraModelo={nomeObraModelo} elements={elements} constructionUid={constructionUid} mapElementsByName={new Map<string, Element>(elements.elements.filter((element: Element) => element.obra === constructionUid).map((element: Element) => {return [element.nome_elemento, element]}))}/>}
            </>
        )
    }

    return(
        pageContent()
    )
} 