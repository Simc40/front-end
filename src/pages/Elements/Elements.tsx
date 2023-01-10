import React, { useEffect, useState } from "react"
import { Container } from "../../components/Container/Container";
import { SubPageButton } from "../../components/Subpage/SubPageButton";
import { SubPageContainer } from "../../components/Subpage/SubPageContainer";
import { Main } from "../../components/Container/Main";
import { useParams } from "react-router-dom";
import { ElementsRegister } from "./ElementsRegister";
import { ElementsManage } from "./ElementsManage";
import { ElementsEdit } from "./ElementsEdit";
import { getElementsInterface } from "../../types/Element";
import { elementsApi } from "../../apis/ElementsApi";
import LoadingPage from "../LoadingPage/LoadingPage";

export const Elements = () => {

    const page = useParams().page
    const page1:string = 'cadastrar_elementos';
    const page2:string = 'gerenciar_elementos';
    const page3:string = 'editar_elementos';

    const [objects, setObjects] = useState<getElementsInterface>({'elements': [], 'shapes': [], 'geometries': [], 'constructions': []});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        elementsApi()
        .getElements()
        .then(setObjects)
        .then(() => {
            setIsLoading(false);
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const RenderSwitch = () => {
        let page = useParams().page;
        switch(page) {
            case page1:
                return <ElementsRegister objects={objects}/>;
            case page2:
                return <ElementsManage objects={objects}/>;
            case page3:
                return <ElementsEdit objects={objects}/>;
        }
    }

    const pageContent = () => {
        return (
            <Container>
                <LoadingPage loading={isLoading}/>
                <Main>
                    <SubPageContainer>
                        <SubPageButton text="Cadastrar Elementos" path="/elementos/cadastrar_elementos" selected={(page === page1)}/>
                        <SubPageButton text="Gerenciar Elementos" path="/elementos/gerenciar_elementos" selected={(page === page2)}/>
                        <SubPageButton text="Editar Elementos" path="/elementos/editar_elementos" selected={(page === page3)}/>
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