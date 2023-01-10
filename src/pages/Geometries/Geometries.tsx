import React, { useEffect, useState } from "react"
import { Container } from "../../components/Container/Container";
import { SubPageButton } from "../../components/Subpage/SubPageButton";
import { SubPageContainer } from "../../components/Subpage/SubPageContainer";
import { Main } from "../../components/Container/Main";
import { useParams } from "react-router-dom";
import { GeometriesRegister } from "./GeometriesRegister";
import { GeometriesManage } from "./GeometriesManage";
import { GeometriesEdit } from "./GeometriesEdit";
import { geometriesApi } from "../../apis/GeometriesApi";
import { Geometry } from "../../types/Geometry";
import LoadingPage from "../LoadingPage/LoadingPage";

export const Geometries = () => {

    const page = useParams().page
    const page1:string = 'cadastrar_geometrias';
    const page2:string = 'gerenciar_geometrias';
    const page3:string = 'editar_geometrias';

    const [geometries, setGeometries] = useState<Geometry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        geometriesApi()
        .getGeometries()
        .then(setGeometries)
        .then(() => {
            setIsLoading(false);
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const RenderSwitch = () => {
        let page = useParams().page;
        switch(page) {
            case page1:
                return <GeometriesRegister geometries={geometries}/>;
            case page2:
                return <GeometriesManage geometries={geometries}/>;
            case page3:
                return <GeometriesEdit geometries={geometries}/>;
        }
    }

    const pageContent = () => {
        return (
            <Container>
                <LoadingPage loading={isLoading}/>
                <Main>
                    <SubPageContainer>
                        <SubPageButton text="Cadastrar Geometrias" path="/geometrias/cadastrar_geometrias" selected={(page === page1)}/>
                        <SubPageButton text="Gerenciar Geometrias" path="/geometrias/gerenciar_geometrias" selected={(page === page2)}/>
                        <SubPageButton text="Editar Geometrias" path="/geometrias/editar_geometrias" selected={(page === page3)}/>
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