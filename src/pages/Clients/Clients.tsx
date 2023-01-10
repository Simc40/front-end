import React, { useContext, useEffect, useState } from "react"
import { Container } from "../../components/Container/Container";
import { SubPageButton } from "../../components/Subpage/SubPageButton";
import { SubPageContainer } from "../../components/Subpage/SubPageContainer";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { Main } from "../../components/Container/Main";
import { useParams } from "react-router-dom";
import { ClientsRegister } from "./ClientsRegister";
import { ClientsManage } from "./ClientsManage";
import { ClientsSincronizeDatabase } from "./ClientsSincronizeDatabase";
import { ClientsEdit } from "./ClientsEdit";
import { Client } from "../../types/Client";
import LoadingPage from "../LoadingPage/LoadingPage";

export const Clients = () => {

    const page = useParams().page
    const page1:string = 'cadastrar_cliente';
    const page2:string = 'sincronizar_banco_de_dados';
    const page3:string = 'gerenciar_cliente';
    const page4:string = 'editar_cliente';

    const auth = useContext(AuthContext);

    const [clients, setClients] = useState<Client[]>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        auth.getClients().then((clients:Client[]) => {
            setClients(clients)
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
                return <ClientsRegister/>;
            case page2:
                return <ClientsSincronizeDatabase/>;
            case page3:
                return <ClientsManage clients={clients}/>;
            case page4:
                return <ClientsEdit clients={clients}/>;
        }
    }

    const pageContent = () => {
        return (
            <Container>
                <LoadingPage loading={isLoading}/>
                <Main>
                    <SubPageContainer>
                        <SubPageButton text="Cadastrar Cliente" path="/clientes/cadastrar_cliente" selected={(page === page1)}/>
                        <SubPageButton text="Sincronizar Banco de Dados" path="/clientes/sincronizar_banco_de_dados" selected={(page === page2)}/>
                        <SubPageButton text="Gerenciar Clientes" path="/clientes/gerenciar_cliente" selected={(page === page3)}/>
                        <SubPageButton text="Editar Cliente" path="/clientes/editar_cliente" selected={(page === page4)}/>
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