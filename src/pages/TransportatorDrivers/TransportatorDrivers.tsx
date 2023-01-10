import React, { ChangeEvent, useEffect, useState } from "react"
import { Container } from "../../components/Container/Container";
import { SubPageButton } from "../../components/Subpage/SubPageButton";
import { SubPageContainer } from "../../components/Subpage/SubPageContainer";
import { Main } from "../../components/Container/Main";
import { useParams } from "react-router-dom";
import { TransportatorDriversRegister } from "./TransportatorDriversRegister";
import { TransportatorDriversManage } from "./TransportatorDriversManage";
import { TransportatorDriversEdit } from "./TransportatorDriversEdit";
import { transportatorsApi } from "../../apis/TransportatorsApi";
import { Transportator } from "../../types/Transportator";
import { InputSection } from "../../components/forms/InputSection";
import { InputSelectFieldEditSelector } from "../../components/forms/InputSelectFieldEditSelector";
import { Section } from "../../components/forms/Section";
import { Driver } from "../../types/Driver";
import LoadingPage from "../LoadingPage/LoadingPage";

export const TransportatorDrivers = () => {

    const page = useParams().page
    const page1:string = 'cadastrar_motoristas';
    const page2:string = 'gerenciar_motoristas';
    const page3:string = 'editar_motoristas';

    const [transportators, setTransportators] = useState<Transportator[]>();
    const [transportator, setTransportator] = useState<Transportator>();
    const [drivers, setdrivers] = useState<Driver[]>();
    const [TransportatorSelection, setTransportatorSelection] = useState<string[][] | (string | undefined)[][] | undefined>([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        transportatorsApi().getTransportators()
        .then((transportatorObjects: Transportator[]) => {
            setTransportators(transportatorObjects);
            setTransportatorSelection(transportatorObjects.map((transportatorObject) => {return [transportatorObject.uid, transportatorObject.nome_empresa]}))
        })
        .then(() => {
            setIsLoading(false);
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const RenderSwitch = () => {
        let page = useParams().page;
        switch(page) {
            case page1:
                return <TransportatorDriversRegister uid_transportadora={transportator?.uid}/>;
            case page2:
                return <TransportatorDriversManage drivers={drivers} uid_transportadora={transportator?.uid}/>;
            case page3:
                return <TransportatorDriversEdit drivers={drivers} uid_transportadora={transportator?.uid}/>;
        }
    }

    const onOptionSelected = (event:ChangeEvent<HTMLSelectElement>) => {
        const getTransportator = (uid:string) => {
            return Array.from(Object.values(transportators!).filter((transportator:Transportator) => transportator.uid === uid))[0];
        }
        const selectedTransportator = getTransportator(event.target.value)
        setTransportator(selectedTransportator);
        setdrivers((selectedTransportator === undefined) ? [] : Array.from(Object.values(selectedTransportator.motoristas)))
    }

    const pageContent = () => {
        return (
            <Container>
                <LoadingPage loading={isLoading}/>
                <Main>
                    <Section text="Selecionar Transportadora">
                        <InputSection>
                            <InputSelectFieldEditSelector array={TransportatorSelection} label="Transportadora" onOptionSelected={onOptionSelected} />
                        </InputSection>
                    </Section>

                    <SubPageContainer style={{'marginTop': '30px'}}>
                        <SubPageButton text="Cadastrar Motoristas" path="/transportadoras/motoristas/cadastrar_motoristas" selected={(page === page1)}/>
                        <SubPageButton text="Gerenciar Motoristas" path="/transportadoras/motoristas/gerenciar_motoristas" selected={(page === page2)}/>
                        <SubPageButton text="Editar Motoristas" path="/transportadoras/motoristas/editar_motoristas" selected={(page === page3)}/>
                    </SubPageContainer>
                    
                    {RenderSwitch()}

                </Main>
            </Container>
        )
    }

    return(
        pageContent()
    )
} 