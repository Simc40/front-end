import React, { useEffect, useState } from "react"
import { Container } from "../../components/Container/Container";
import { SubPageButton } from "../../components/Subpage/SubPageButton";
import { SubPageContainer } from "../../components/Subpage/SubPageContainer";
import { Main } from "../../components/Container/Main";
import { ReportGeneralPage } from "./ReportGeneralPage";
import { piecesApi } from "../../apis/PiecesApi";
import { Piece, PiecesApiGetInterface } from "../../types/Piece";
import LoadingPage from "../LoadingPage/LoadingPage";
import { errosApi } from "../../apis/ErrosApi";
import { ErrorsApiGetInterface } from "../../types/Erros";
import { InspectionPieceWindow } from "../../components/Windows/InspectionPieceWindow";
import { CheckListApiGetInterface, ChecklistHistoryType } from "../../types/Checklist";
import { checklistApi } from "../../apis/ChecklistApi";

export const ReportGeneral = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [pieces, setPieces] = useState<PiecesApiGetInterface>({});
    const [errors, setErrors] = useState<ErrorsApiGetInterface>({});
    const [piece, setPiece] = useState<Piece>();
    const [checklistHistory, setChecklistHistory] = useState<ChecklistHistoryType>();


    useEffect(() => {
        errosApi()
        .getErros()
        .then(setErrors)
        .then(piecesApi().getPieces)
        .then(setPieces)
        .then(checklistApi().getChecklist)
        .then(getHistoryCheckList)
        .then(() => {
            setIsLoading(false);
        })
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getHistoryCheckList = (result:CheckListApiGetInterface) => {
        setChecklistHistory(
            {
                'armacao': result.history.armacao,
                'armacaoForma': result.history.armacaoForma,
                'cadastro': result.history.cadastro,
                'carga': result.history.carga,
                'concretagem': result.history.concretagem,
                'descarga': result.history.descarga,
                'forma': result.history.forma,
                'liberacao': result.history.liberacao,
                'montagem': result.history.montagem,
                'planejamento': result.history.planejamento,
            }
        )
    }

   

    const pageContent = () => {
        return (
            <Container>
                <LoadingPage loading={isLoading}/>
                <InspectionPieceWindow errors={errors} piece={piece} setPiece={setPiece} checklistHistory={checklistHistory}/>
                <Main>
                    <SubPageContainer>
                        <SubPageButton text="Relatório Geral" selected={true}/>
                    </SubPageContainer>
                    
                    <ReportGeneralPage pieces={pieces} errors={errors} setPiece={setPiece}/>
                </Main>
            </Container>
        )
    }

    return(
        pageContent()
    )
} 