import React from "react"
import styled from 'styled-components'

const DivBoardContainer = styled.div`
    display: block;
    background: #57a695;
    box-shadow: 0px -1px 3px #282c33;
    padding: 0.5rem 1rem;
    width: 30%;
`;

const DivTop = styled.div`

    @media screen and (max-width: 550px){
        font-size: 50%;
        flex-grow: 1;
    }

    @media screen and (min-width: 551px) and (max-width: 708px){
        font-size: 50%;
        
        &.TRANSPORTADO{
            font-size: 40%;
        }
    }

    @media screen and (min-width: 709px) and (max-width: 883px){
        &.TRANSPORTADO{
            font-size: 62%;
        }
    }

    font-size: 90%;
    color: white;
`;

const DivBottom = styled.div`
    @media screen and (max-width: 708px){
        font-size: calc(1.0rem + .8vw);
    }

    @media screen and (min-width: 709px) and (max-width: 883px){
        font-size: calc(1.0rem + .8vw);
    }

    display: flex;
    align-items: center;
    font-size: calc(1.5rem + .8vw);
    color: white;
`;
const Icon = styled.span`
    @media screen and (max-width: 708px){
        font-size: calc(1.0rem + .8vw);
    }

    @media screen and (min-width: 709px) and (max-width: 883px){
        font-size: calc(1.0rem + .8vw);
    }


    color: black;
    margin-left: auto;
    font-size: calc(1.5rem + .8vw);
`;

export const BoardScore = ({text, number, icon}: {text:string, number:number, icon:string}) => {

    const pageContent = () => {
        return (
            <DivBoardContainer className="card">
                <DivTop className={text}>
                    <strong>{text}</strong>
                </DivTop>

                <DivBottom>
                    <strong>{number}</strong>
                    <Icon className="material-icons">{icon}</Icon>
                </DivBottom>
            </DivBoardContainer>
        )
    }

    return(
        pageContent()
    )
}