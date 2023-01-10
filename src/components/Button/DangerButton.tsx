import React, { MouseEventHandler } from "react"
import styled from 'styled-components'

const Button = styled.button`
    background-color: #842029;
    text-align: center;
    max-width: 210px;
    width: 50%;
    border-radius: 25px;
    height: calc(2.0rem + 2px);
    font-size: 0.8rem;
    margin: 7.5px 0;
    padding: 0;
    line-height: 0;
    color: white;

    &:hover{
        background-color: #bf545e;
        border-color: #bf545e
    }
`;

export const DangerButton = ({text, onClick} : {text:string, onClick: (MouseEventHandler<HTMLButtonElement> | undefined)}) => {

    return (
        <Button className="btn btn-lg btn-primary" type="button" onClick={onClick}>{text}</Button>
    )
}