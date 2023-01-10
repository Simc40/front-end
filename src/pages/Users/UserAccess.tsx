import React, { useEffect, useState } from "react"
import { Container } from "../../components/Container/Container";
import { SubPageButton } from "../../components/Subpage/SubPageButton";
import { SubPageContainer } from "../../components/Subpage/SubPageContainer";
import { Main } from "../../components/Container/Main";
import { useParams } from "react-router-dom";
import { UserRegister } from "./UserRegister";
import { UserAccessManage } from "./UserAccessManage";
import { UserEdit } from "./UserEdit";
import LoadingPage from "../LoadingPage/LoadingPage";

export const UserAccess = () => {

    const page = useParams().page
    const page1:string = 'cadastrar_usuario';
    const page2:string = 'gerenciar_acesso_usuario';
    const page3:string = 'editar_usuario';

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const RenderSwitch = () => {
        let page = useParams().page;
        switch(page) {
            case page1:
                return <UserRegister/>;
            case page2:
                return <UserAccessManage/>;
            case page3:
                return <UserEdit/>;
        }
    }

    const pageContent = () => {
        return (
            <Container>
                <LoadingPage loading={isLoading}/>
                <Main>
                    <SubPageContainer style={{'marginTop': '30px'}}>
                        <SubPageButton text="Cadastrar Usuário" path="/gerenciar_acesso/cadastrar_usuario" selected={(page === page1)}/>
                        <SubPageButton text="Gerenciar Acesso" path="/gerenciar_acesso/gerenciar_acesso_usuario" selected={(page === page2)}/>
                        <SubPageButton text="Editar Usuário" path="/gerenciar_acesso/editar_usuario" selected={(page === page3)}/>
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