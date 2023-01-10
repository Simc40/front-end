import React, { useEffect, useState } from "react"
import { Container } from "../../components/Container/Container";
import { SubPageButton } from "../../components/Subpage/SubPageButton";
import { SubPageContainer } from "../../components/Subpage/SubPageContainer";
import { Main } from "../../components/Container/Main";
import LoadingPage from "../LoadingPage/LoadingPage";
import { PdfsElementPage } from "./PdfsElementPage";
import { pdfApi } from "../../apis/PdfApi";
import { PDFElementsApiGetInterface } from "../../types/Pdf";
import { elementsApi } from "../../apis/ElementsApi";
import { getElementsMapInterface } from "../../types/Element";

export const PdfsElement = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [elementsMap, setElementsMap] = useState<getElementsMapInterface>();
    const [pdfs, setPdfs] = useState<PDFElementsApiGetInterface>();

    useEffect(() => {
        elementsApi()
        .getElementsMap()
        .then(setElementsMap)
        .then(pdfApi().getPdfElements)
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
                        <SubPageButton text="Gerenciar PDF de Elementos" selected={true}/>
                    </SubPageContainer>
                    
                    <PdfsElementPage elementsMap={elementsMap}  pdfs={pdfs}/>

                </Main>
            </Container>
        )
    }

    return(
        pageContent()
    )
} 