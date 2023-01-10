import React, { useEffect, useState } from "react"
import { Container } from "../../components/Container/Container";
import { SubPageButton } from "../../components/Subpage/SubPageButton";
import { SubPageContainer } from "../../components/Subpage/SubPageContainer";
import { Main } from "../../components/Container/Main";
import { useParams } from "react-router-dom";
import { ChecklistUpdate } from "./ChecklistUpdate";
import { ChecklistHistory } from "./ChecklistHistory";
import { checklistApi } from "../../apis/ChecklistApi";
import { CheckListApiGetInterface, ChecklistHistoryType, ChecklistOnUse } from "../../types/Checklist";
import LoadingPage from "../LoadingPage/LoadingPage";

export const Checklists = () => {

    const page = useParams().page
    const page1:string = 'modificar_checklist';
    const page2:string = 'historico_checklist';

    const [checklist, setChecklist] = useState<ChecklistOnUse>();
    const [checklistHistory, setChecklistHistory] = useState<ChecklistHistoryType>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checklistApi().getChecklist()
        .then((result:CheckListApiGetInterface) => {
            getUpdatableCheckList(result);
            getHistoryCheckList(result);
        })
        .then(() => {
            setIsLoading(false);
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getUpdatableCheckList = (result:CheckListApiGetInterface) => {
        setChecklist(
            {
                'armacao': result.history.armacao[result.armacao],
                'armacaoForma': result.history.armacaoForma[result.armacaoForma],
                'cadastro': result.history.cadastro[result.cadastro],
                'carga': result.history.carga[result.carga],
                'concretagem': result.history.concretagem[result.concretagem],
                'descarga': result.history.descarga[result.descarga],
                'forma': result.history.forma[result.forma],
                'liberacao': result.history.liberacao[result.liberacao],
                'montagem': result.history.montagem[result.montagem],
                'planejamento': result.history.planejamento[result.planejamento],
            }
        )
    }

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

    const RenderSwitch = () => {
        let page = useParams().page;
        switch(page) {
            case page1:
                return <ChecklistUpdate checklist={checklist}/>;
            case page2:
                return <ChecklistHistory checklistHistory={checklistHistory}/>;
        }
    }

    const pageContent = () => {
        return (
            <Container>
                <LoadingPage loading={isLoading}/>
                <Main>
                    <SubPageContainer>
                        <SubPageButton text="Modificar Checklist" path="/checklists/modificar_checklist" selected={(page === page1)}/>
                        <SubPageButton text="Histórico de Checklists" path="/checklists/historico_checklist" selected={(page === page2)}/>
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