import React, { ChangeEvent, useContext, useEffect, useState } from "react"
import './main.scss'
import { Construction } from "../../types/Construction";
import { InputSelectFieldEditSelector } from "../../components/forms/InputSelectFieldEditSelector";
import { Section } from "../../components/forms/Section";
import { ApiFirebaseBIM, RVT } from "../../types/Forge";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import Viewer from "./Viewer";

export const BimVisualization = ({BIM, constructions} : {BIM?: ApiFirebaseBIM, constructions?: Construction[]}) => {

    const auth = useContext(AuthContext);
    const [urn, setUrn] = useState('');
    const [nomeObraModelo, setNomeObraModelo] = useState('');
    console.log(BIM)

    useEffect(() => {
        auth.setPath("Home → Gerenciamento → BIM → Gerenciar Modelos")
        console.log(urn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urn]);

    const constructionsWithBIM = BIM === undefined ? [] : Array.from(Object.keys(BIM))
    const constructionSelection = (constructions === undefined) ? [] : Array.from(Object.values(constructions).filter((construction: Construction) => constructionsWithBIM.includes(construction.uid)).map((construction: Construction) => [construction.uid, construction.nome_obra]));

    const onConstructionSelected = (event:ChangeEvent<HTMLSelectElement>) => {
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
                
                {urn === '' ? <></> : <Viewer urn={urn} nomeObraModelo={nomeObraModelo}/>}
            </>
        )
    }

    return(
        pageContent()
    )
} 