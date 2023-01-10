import React, { useEffect, useState } from "react"
import { Container } from "../../components/Container/Container";
import { SubPageButton } from "../../components/Subpage/SubPageButton";
import { SubPageContainer } from "../../components/Subpage/SubPageContainer";
import { Main } from "../../components/Container/Main";
import { useParams } from "react-router-dom";
import { ShedsRegister } from "./ShedsRegister";
import { ShedsManage } from "./ShedsManage";
import { ShedsEdit } from "./ShedsEdit";
import { shedsApi } from "../../apis/ShedsApi";
import { Shed } from "../../types/Shed";
import LoadingPage from "../LoadingPage/LoadingPage";

export const Sheds = () => {

    const page = useParams().page
    const page1:string = 'cadastrar_galpoes';
    const page2:string = 'gerenciar_galpoes';
    const page3:string = 'editar_galpoes';

    const [sheds, setSheds] = useState<Shed[]>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        shedsApi()
        .getSheds()
        .then(setSheds)
        .then(() => {
            setIsLoading(false);
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const RenderSwitch = () => {
        let page = useParams().page;
        switch(page) {
            case page1:
                return <ShedsRegister/>;
            case page2:
                return <ShedsManage sheds={sheds}/>;
            case page3:
                return <ShedsEdit sheds={sheds}/>;
        }
    }

    const pageContent = () => {
        return (
            <Container>
                <LoadingPage loading={isLoading}/>
                <Main>
                    <SubPageContainer>
                        <SubPageButton text="Cadastrar Galpoes" path="/galpoes/cadastrar_galpoes" selected={(page === page1)}/>
                        <SubPageButton text="Gerenciar Galpoes" path="/galpoes/gerenciar_galpoes" selected={(page === page2)}/>
                        <SubPageButton text="Editar Galpoes" path="/galpoes/editar_galpoes" selected={(page === page3)}/>
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