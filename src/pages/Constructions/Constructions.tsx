import React, { useEffect, useState } from "react"
import { Container } from "../../components/Container/Container";
import { SubPageButton } from "../../components/Subpage/SubPageButton";
import { SubPageContainer } from "../../components/Subpage/SubPageContainer";
import { Main } from "../../components/Container/Main";
import { useParams } from "react-router-dom";
import { ConstructionsRegister } from "./ConstructionsRegister";
import { ConstructionsManage } from "./ConstructionsManage";
import { ConstructionsEdit } from "./ConstructionsEdit";
import { constructionApi } from "../../apis/ConstructionApi";
import { Construction } from "../../types/Construction";
import LoadingPage from "../LoadingPage/LoadingPage";

export const Constructions = () => {

    const page = useParams().page
    const page1:string = 'cadastrar_obras';
    const page2:string = 'gerenciar_obras';
    const page3:string = 'editar_obras';

    const [constructions, setConstructions] = useState<Construction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        constructionApi()
        .getConstructions()
        .then(setConstructions)
        .then(() => {
            setIsLoading(false);
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const RenderSwitch = () => {
        let page = useParams().page;
        switch(page) {
            case page1:
                return <ConstructionsRegister constructions={constructions}/>;
            case page2:
                return <ConstructionsManage constructions={constructions}/>;
            case page3:
                return <ConstructionsEdit constructions={constructions}/>;
        }
    }

    const pageContent = () => {
        return (
            <Container>
                <LoadingPage loading={isLoading}/>
                <Main>
                    <SubPageContainer>
                        <SubPageButton text="Cadastrar Obras" path="/obras/cadastrar_obras" selected={(page === page1)}/>
                        <SubPageButton text="Gerenciar Obras" path="/obras/gerenciar_obras" selected={(page === page2)}/>
                        <SubPageButton text="Editar Obras" path="/obras/editar_obras" selected={(page === page3)}/>
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