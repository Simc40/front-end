import React, { useContext, useEffect, useState } from "react";
import { Container } from "../../components/Container/Container";
import { SubPageButton } from "../../components/Subpage/SubPageButton";
import { SubPageContainer } from "../../components/Subpage/SubPageContainer";
import { Main } from "../../components/Container/Main";
import { constructionApi } from "../../apis/ConstructionApi";
import { Construction } from "../../types/Construction";
import LoadingPage from "../LoadingPage/LoadingPage";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { Element, getElementsInterface } from "../../types/Element";
import { elementsApi } from "../../apis/ElementsApi";
import { InputSection } from "../../components/forms/InputSection";
import { InputSelectFieldEditSelector } from "../../components/forms/InputSelectFieldEditSelector";
import { Section } from "../../components/forms/Section";

export const Planning = () => {
    const auth = useContext(AuthContext);
    const [construction, setConstruction] = useState<Construction>();
    const [objects, setObjects] = useState<getElementsInterface>({
        elements: [],
        shapes: [],
        geometries: [],
        constructions: [],
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        elementsApi()
            .getElements()
            .then(setObjects)
            .then(() => {
                setIsLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        auth.setPath("Home → Programaçåo → Planejamento");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth.usersNameMap]);

    const onOptionSelected = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const getConstruction = (uid: string) => {
            return Array.from(
                Object.values(objects.constructions!).filter(
                    (construction: Construction) => construction.uid === uid
                )
            )[0];
        };
        setConstruction(getConstruction(event.target.value));
    };

    const constructionSelection =
        objects.elements === undefined
            ? []
            : Array.from(
                  new Set(
                      Object.values(objects.elements).map(
                          (element: Element) => element.construction
                      )
                  )
              ).map((construction: Construction | undefined) => {
                  return [construction!.uid, construction!.nome_obra];
              });

    const pageContent = () => {
        return (
            <Container>
                <LoadingPage loading={isLoading} />
                <Main>
                    <SubPageContainer>
                        <SubPageButton
                            text="Planejamento"
                            path="/programacao/planejamento"
                            selected={true}
                        />
                    </SubPageContainer>
                    <Section text="Selecionar Obra">
                        <InputSection>
                            <InputSelectFieldEditSelector
                                array={constructionSelection}
                                label="Obra"
                                onOptionSelected={onOptionSelected}
                            />
                        </InputSection>
                    </Section>
                </Main>
            </Container>
        );
    };

    return pageContent();
};
