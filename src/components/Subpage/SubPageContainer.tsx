import React from "react"
import styled from 'styled-components'

const DivSubPageContainer = styled.div`
    display: flex;
    width: 100%;
    border-bottom: 0px;
    box-shadow: rgb(136 136 136) 0px 1px 0px 0px;
    align-items: flex-end;
    overflow-x: scroll;

    ::-webkit-scrollbar {
        height: 0px;
        background: transparent; /* make scrollbar transparent */
    }
`;

export const SubPageContainer = ({children, style} : {children: JSX.Element | JSX.Element[], style?: React.CSSProperties}) => {

    return (
        <DivSubPageContainer style={style}>
            {children}
        </DivSubPageContainer>
    )
}