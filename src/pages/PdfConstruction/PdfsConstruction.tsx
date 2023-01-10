import React, { useEffect, useState } from "react"
import { Container } from "../../components/Container/Container";
import { SubPageButton } from "../../components/Subpage/SubPageButton";
import { SubPageContainer } from "../../components/Subpage/SubPageContainer";
import { Main } from "../../components/Container/Main";
import LoadingPage from "../LoadingPage/LoadingPage";
import { PdfsConstructionPage } from "./PdfsConstructionPage";
import { pdfApi } from "../../apis/PdfApi";
import { constructionApi } from "../../apis/ConstructionApi";
import { Construction } from "../../types/Construction";
import { PDFConstructionApiGetInterface } from "../../types/Pdf";

export const PdfsConstruction = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [constructions, setConstructions] = useState<Construction[]>();
    const [pdfs, setPdfs] = useState<PDFConstructionApiGetInterface>();

    useEffect(() => {
        constructionApi()
        .getConstructions()
        .then(setConstructions)
        .then(pdfApi().getPdfConstruction)
        .then(setPdfs)
        .then(() => {
            setIsLoading(false)
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const pageContent = () => {
        return (
            <Container>
                <LoadingPage loading={isLoading}/>
                <Main>
                    <SubPageContainer>
                        <SubPageButton text="Gerenciar PDF de Obra" selected={true}/>
                    </SubPageContainer>
                    
                    <PdfsConstructionPage constructions={constructions}  pdfs={pdfs}/>

                </Main>
            </Container>
        )
    }

    return(
        pageContent()
    )
} 