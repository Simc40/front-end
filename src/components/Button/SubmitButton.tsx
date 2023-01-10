import React from "react"
import styled from 'styled-components'

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-top: 20px;
`;

const Button = styled.button`
    --bs-btn-bg: #57a695;
    --bs-btn-border-color: #57a695;
    --bs-btn-disabled-bg: #57a695;
    --bs-btn-disabled-border-color: #57a695;
    --bs-btn-hover-bg: #a8cf45;
    --bs-btn-hover-border-color: #a8cf45;
    --bs-btn-active-bg: #a8cf45;
    --bs-btn-active-border-color: #a8cf45;
    text-align: center;
    max-width: 210px;
    width: 50%;
    border-radius: 25px;
    height: calc(2.8rem + 2px);
    font-size: 1.25rem;
    margin: 7.5px 0;
    margin-top: 20px;
    padding: 0;
    line-height: 0;
    color: white;
`;

const ButtonContainerFlex = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;

    &.flex-center {
        align-items: center;
        margin-top: 20px;
        width: 50%;

        button{
            width: 90%;
        }
    }
`;

const ButtonFlex = styled.button`
    --bs-btn-bg: #57a695;
    --bs-btn-border-color: #57a695;
    --bs-btn-disabled-bg: #57a695;
    --bs-btn-disabled-border-color: #57a695;
    --bs-btn-hover-bg: #a8cf45;
    --bs-btn-hover-border-color: #a8cf45;
    --bs-btn-active-bg: #a8cf45;
    --bs-btn-active-border-color: #a8cf45;
    text-align: center;
    max-width: 300px;
    width: 300px;
    border-radius: 25px;
    height: calc(2.8rem + 2px);
    font-size: 1.25rem;
    margin: 7.5px 0;
    padding: 0;
    line-height: 0;
    color: white;
`;

export const SubmitButton = ({text, flex, flexCenter} : {flexCenter?: string, flex?: boolean, text:string}) => {

    const normalContainer = () => {
        return (
            <ButtonContainer>
                <Button id="btn-editar" className="btn btn-lg btn-primary" type="submit">{text}</Button>
            </ButtonContainer>
        )
    }

    const flexContainer = () => {

        return (
            <ButtonContainerFlex className={flexCenter}>
                <ButtonFlex id="btn-editar" className="btn btn-lg btn-primary" type="submit">{text}</ButtonFlex>
            </ButtonContainerFlex>
        )
    }

    return (
        (flex === undefined) ? normalContainer() : flexContainer()
    )
}