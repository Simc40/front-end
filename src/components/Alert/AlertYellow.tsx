import React from "react"
import styled from 'styled-components'

export const AlertYellow = ({children} : {children: JSX.Element | JSX.Element[]}) => {

    return (
        <DivYellowAlert className="alert alert-warning full-width" role="alert">
            <span id="alert" className="material-icons" style={{'verticalAlign': 'sub', 'marginRight': '10px'}}>error</span>{children}
        </DivYellowAlert>
    )
}

const DivYellowAlert = styled.div`
    margin-top: 30px;
    font-size: 0.9rem;
    min-width: 48.5%;

    a {
        color: #57a695;
        text-decoration: underline;
    }

    .material-icons{
        font-size: 18px;
    }
`;