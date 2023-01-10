import React, { useEffect, useState } from "react"
import { Container } from "../../components/Container/Container";
import { SubPageButton } from "../../components/Subpage/SubPageButton";
import { SubPageContainer } from "../../components/Subpage/SubPageContainer";
import { Main } from "../../components/Container/Main";
import { useParams } from "react-router-dom";
import { RomaneioRegister } from "./RomaneioRegister";
import { RomaneioHistory } from "./RomaneioHistory";
import { piecesApi } from "../../apis/PiecesApi";
import { PiecesApiGetInterface } from "../../types/Piece";
import LoadingPage from "../LoadingPage/LoadingPage";
import { transportatorsApi } from "../../apis/TransportatorsApi";
import { Transportator } from "../../types/Transportator";
import { romaneiosApi } from "../../apis/RomaneiosApi";
import { RomaneioCarga } from "../../types/RomaneioCarga";

export const Romaneios = () => {

    const page = useParams().page
    const page1:string = 'registrar_romaneio';
    const page2:string = 'historico_romaneio';

    const [isLoading, setIsLoading] = useState(true);
    const [transportators, setTransportators] = useState<Transportator[]>([]);
    const [pieces, setPieces] = useState<PiecesApiGetInterface>({});
    const [cargas, setCargas] = useState<RomaneioCarga[]>([]);


    useEffect(() => {
        piecesApi()
        .getPieces()
        .then(setPieces)
        .then(transportatorsApi().getTransportators)
        .then(setTransportators)
        .then(romaneiosApi().getCargas)
        .then((response) => {
            setCargas(response.cargas)
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
                return <RomaneioRegister transportators={transportators} pieces={pieces}/>;
            case page2:
                return <RomaneioHistory cargas={cargas}/>;
        }
    }

    const pageContent = () => {
        return (
            <Container>
                <LoadingPage loading={isLoading}/>
                <Main>
                    <SubPageContainer>
                        <SubPageButton text="Registrar Romaneio" path="/romaneio/registrar_romaneio" selected={(page === page1)}/>
                        <SubPageButton text="Romaneio de Cargas" path="/romaneio/historico_romaneio" selected={(page === page2)}/>
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