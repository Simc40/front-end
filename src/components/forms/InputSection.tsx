import React from "react"
import styled from 'styled-components'

const DivInputSection = styled.div`
    @media screen and (max-width: 480px){
        flex-direction: column;
    }
    
    @media screen and (min-width: 481px) and (max-width: 768px){
        flex-direction: column;
    }

    justify-content: space-between;
    flex-direction: row;
    flex: 1;
    display: flex;
    gap: 3%;
`;

export const InputSection = ({children, style} : {children: JSX.Element | JSX.Element[], style?: React.CSSProperties}) => {

    return (
        <DivInputSection style={style}>{children}</DivInputSection>
    )
}