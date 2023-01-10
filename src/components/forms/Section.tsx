import React from "react"
import styled from 'styled-components'

const DivTextCenter = styled.div`
    text-align: center;
    margin-top: 20px;
    font-weight: bold;
    margin-bottom: 7.5px;
`;

const DivText = styled.div`
    margin-top: 20px;
    font-weight: bold;
    margin-bottom: 7.5px;
`;

const DivCenter = styled.div`
    text-align: -webkit-center;
`;

export const Section = ({children, text, alignCenter} : {children?: JSX.Element | JSX.Element[], text?:string, alignCenter?:boolean}) => {

    return (
        <div>
            {(alignCenter !== undefined) ? <DivTextCenter>{text}</DivTextCenter> : <DivText>{text}</DivText>} 
            {(alignCenter !== undefined) ? <DivCenter>{children}</DivCenter> : <div>{children}</div>} 
        </div>
    )
}