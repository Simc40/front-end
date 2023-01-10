import React from "react"
import styled from 'styled-components'

const DivText = styled.div`
    margin-top: 20px;
    font-weight: bold;
    margin-bottom: 7.5px;
`;

const DivInvisible = styled.div`
    &.invisible{
        display: none;
    }
`;

export const SectionInvisible = ({children, text, visible} : {children?: JSX.Element | JSX.Element[], text?:string, visible: boolean}) => {

    return (
        <DivInvisible className={(visible) ? "visible" : "invisible"}>
            <DivText>{text}</DivText>
            <div>{children}</div>
        </DivInvisible>
    )
}