import React, { useEffect, useState } from "react"
import { Container } from "../../components/Container/Container";
import { SubPageButton } from "../../components/Subpage/SubPageButton";
import { SubPageContainer } from "../../components/Subpage/SubPageContainer";
import { Main } from "../../components/Container/Main";
import { useParams } from "react-router-dom";
import { TransportatorsRegister } from "./TransportatorsRegister";
import { TransportatorsManage } from "./TransportatorsManage";
import { TransportatorsEdit } from "./TransportatorsEdit";
import { transportatorsApi } from "../../apis/TransportatorsApi";
import { Transportator } from "../../types/Transportator";
import LoadingPage from "../LoadingPage/LoadingPage";

export const Transportators = () => {

    const page = useParams().page
    const page1:string = 'cadastrar_transportadoras';
    const page2:string = 'gerenciar_transportadoras';
    const page3:string = 'editar_transportadoras';

    const [Transportators, setTransportators] = useState<Transportator[]>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        transportatorsApi()
        .getTransportators()
        .then(setTransportators)
        .then(() => {
            setIsLoading(false);
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const RenderSwitch = () => {
        let page = useParams().page;
        switch(page) {
            case page1:
                return <TransportatorsRegister/>;
            case page2:
                return <TransportatorsManage transportators={Transportators}/>;
            case page3:
                return <TransportatorsEdit transportators={Transportators}/>;
        }
    }

    const pageContent = () => {
        return (
            <Container>
                <LoadingPage loading={isLoading}/>
                <Main>
                    <SubPageContainer>
                        <SubPageButton text="Cadastrar Transportadoras" path="/transportadoras/cadastrar_transportadoras" selected={(page === page1)}/>
                        <SubPageButton text="Gerenciar Transportadoras" path="/transportadoras/gerenciar_transportadoras" selected={(page === page2)}/>
                        <SubPageButton text="Editar Transportadoras" path="/transportadoras/editar_transportadoras" selected={(page === page3)}/>
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