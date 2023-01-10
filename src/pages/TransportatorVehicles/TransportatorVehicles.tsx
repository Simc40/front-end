import React, { ChangeEvent, useEffect, useState } from "react"
import { Container } from "../../components/Container/Container";
import { SubPageButton } from "../../components/Subpage/SubPageButton";
import { SubPageContainer } from "../../components/Subpage/SubPageContainer";
import { Main } from "../../components/Container/Main";
import { useParams } from "react-router-dom";
import { TransportatorVehiclesRegister } from "./TransportatorVehiclesRegister";
import { TransportatorVehiclesManage } from "./TransportatorVehiclesManage";
import { TransportatorVehiclesEdit } from "./TransportatorVehiclesEdit";
import { transportatorsApi } from "../../apis/TransportatorsApi";
import { Transportator } from "../../types/Transportator";
import { Vehicle } from "../../types/Vehicle";
import { InputSection } from "../../components/forms/InputSection";
import { InputSelectFieldEditSelector } from "../../components/forms/InputSelectFieldEditSelector";
import { Section } from "../../components/forms/Section";
import LoadingPage from "../LoadingPage/LoadingPage";

export const TransportatorVehicles = () => {

    const page = useParams().page
    const page1:string = 'cadastrar_veiculos';
    const page2:string = 'gerenciar_veiculos';
    const page3:string = 'editar_veiculos';

    const [transportators, setTransportators] = useState<Transportator[]>();
    const [transportator, setTransportator] = useState<Transportator>();
    const [vehicles, setVehicles] = useState<Vehicle[]>();
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
                return <TransportatorVehiclesRegister uid_transportadora={transportator?.uid}/>;
            case page2:
                return <TransportatorVehiclesManage vehicles={vehicles} uid_transportadora={transportator?.uid}/>;
            case page3:
                return <TransportatorVehiclesEdit vehicles={vehicles} uid_transportadora={transportator?.uid}/>;
        }
    }

    const onOptionSelected = (event:ChangeEvent<HTMLSelectElement>) => {
        const getTransportator = (uid:string) => {
            return Array.from(Object.values(transportators!).filter((transportator:Transportator) => transportator.uid === uid))[0];
        }
        const selectedTransportator = getTransportator(event.target.value);
        setTransportator(selectedTransportator);
        const vehiclesArray = (selectedTransportator === undefined) ? [] : Array.from(Object.values(selectedTransportator.veiculos)).map((vehicle:Vehicle) => {
            return{
                ...vehicle,
                "nome_veiculo": vehicle.marca + ' - ' + vehicle.placa,
            }
        })
        setVehicles((selectedTransportator === undefined) ? [] : vehiclesArray)
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
                        <SubPageButton text="Cadastrar Veículos" path="/transportadoras/veiculos/cadastrar_veiculos" selected={(page === page1)}/>
                        <SubPageButton text="Gerenciar Veículos" path="/transportadoras/veiculos/gerenciar_veiculos" selected={(page === page2)}/>
                        <SubPageButton text="Editar Veículos" path="/transportadoras/veiculos/editar_veiculos" selected={(page === page3)}/>
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