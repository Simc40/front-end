import React, { useEffect, useState } from "react"
import { Container } from "../../components/Container/Container";
import { SubPageButton } from "../../components/Subpage/SubPageButton";
import { SubPageContainer } from "../../components/Subpage/SubPageContainer";
import { Main } from "../../components/Container/Main";
import { useParams } from "react-router-dom";
import { ShapesRegister } from "./ShapesRegister";
import { ShapesManage } from "./ShapesManage";
import { ShapesEdit } from "./ShapesEdit";
import { shapesApi } from "../../apis/ShapesApi";
import { Shape } from "../../types/Shape";
import LoadingPage from "../LoadingPage/LoadingPage";

export const Shapes = () => {

    const page = useParams().page
    const page1:string = 'cadastrar_formas';
    const page2:string = 'gerenciar_formas';
    const page3:string = 'editar_formas';

    const [shapes, setShapes] = useState<Shape[]>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        shapesApi()
        .getShapes()
        .then(setShapes)
        .then(() => {
            setIsLoading(false);
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const RenderSwitch = () => {
        let page = useParams().page;
        switch(page) {
            case page1:
                return <ShapesRegister/>;
            case page2:
                return <ShapesManage shapes={shapes}/>;
            case page3:
                return <ShapesEdit shapes={shapes}/>;
        }
    }

    const pageContent = () => {
        return (
            <Container>
                <LoadingPage loading={isLoading}/>
                <Main>
                    <SubPageContainer>
                        <SubPageButton text="Cadastrar Formas" path="/formas/cadastrar_formas" selected={(page === page1)}/>
                        <SubPageButton text="Gerenciar Formas" path="/formas/gerenciar_formas" selected={(page === page2)}/>
                        <SubPageButton text="Editar Formas" path="/formas/editar_formas" selected={(page === page3)}/>
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