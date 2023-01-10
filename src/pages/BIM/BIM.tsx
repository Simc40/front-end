import React, { useEffect, useState } from "react"
import { Container } from "../../components/Container/Container";
import { SubPageButton } from "../../components/Subpage/SubPageButton";
import { SubPageContainer } from "../../components/Subpage/SubPageContainer";
import { Main } from "../../components/Container/Main";
import LoadingPage from "../LoadingPage/LoadingPage";
import './main.scss'
import 'https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.js'
import { useParams } from "react-router-dom";
import { BimManageModels } from "./BimManageModels";
import { forgeApi } from "../../apis/ForgeApi";
import { ApiFirebaseBIM } from "../../types/Forge";
import { BimVisualization } from "./BimVisualization";
import { BimSyncronization } from "./BimSyncronization";
import { elementsApi } from "../../apis/ElementsApi";
import { getElementsInterface } from "../../types/Element";

export const BIM = () => {

    const page = useParams().page
    const page1:string = 'gerenciar_modelos';
    const page2:string = 'visualizar_modelo_bim';
    const page3:string = 'sincronizar_modelo';

    const [isLoading, setIsLoading] = useState(true);
    const [listBIM, setListBIM] = useState<ApiFirebaseBIM>();
    const [elements, setElements] = useState<getElementsInterface>({'elements' : [], 'constructions': [], 'geometries': [], 'shapes': []});

    useEffect(() => {
        forgeApi().getListBIM()
        .then(setListBIM)
        .then(elementsApi().getElements)
        .then(setElements)
        .then(() => {
            setIsLoading(false);
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const RenderSwitch = () => {
        let page = useParams().page;
        switch(page) {
            case page1:
                return <BimManageModels BIM={listBIM} constructions={elements.constructions}/>;
            case page2:
                return <BimVisualization BIM={listBIM} constructions={elements.constructions}/>;
            case page3:
                return <BimSyncronization BIM={listBIM} constructions={elements.constructions} elements={elements} setIsLoading={setIsLoading}/>;
        }
    }

    const pageContent = () => {
        return (
            <Container>
                <LoadingPage loading={isLoading}/>
                <Main>
                    <SubPageContainer>
                        <SubPageButton text="Gerenciar Modelos BIM" path="/BIM/gerenciar_modelos" selected={(page === page1)}/>
                        <SubPageButton text="Visualizar Modelos BIM" path="/BIM/visualizar_modelo_bim" selected={(page === page2)}/>
                        <SubPageButton text="Sincronizar Modelo BIM" path="/BIM/sincronizar_modelo" selected={(page === page3)}/>
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