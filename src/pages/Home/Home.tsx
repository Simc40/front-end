import React, { useContext, useEffect } from "react"
import Logo from '../../assets/imgs/logo.png'
import { Container } from "../../components/Container/Container";
import styled from 'styled-components'
import { AuthContext } from "../../contexts/Auth/AuthContext";

const DivHome = styled.div`
    width: 100%;
    height: 95%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    justify-content: space-around;
`;

const Img = styled.img`
    width: 300px;
`;

const DivInfo = styled.div`
    width: fit-content;
    text-align: center;
`;

export const Home = () => {

    const auth = useContext(AuthContext);
    
    useEffect(() => {
        auth.setPath("Home")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const pageContent = () => {
        return (
            <Container>
                <DivHome>
                    <div>
                        <Img src={Logo} alt=""/>
                    </div>
                </DivHome>
                <DivInfo>
                    <strong>contato@simc40.com.br</strong><br/>
                    <strong>+55 (71) 9964-5707</strong>
                </DivInfo>
            </Container>
        )
    }

    return(
        pageContent()
    )
}