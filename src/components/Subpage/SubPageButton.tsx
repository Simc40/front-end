import React from "react"
import { useNavigate } from "react-router";
import styled from 'styled-components'

const DivSubPageButton = styled.div`
    margin-right: 10px;
    cursor: pointer;
    height: fit-content;
    margin-top: 1px;
    margin-left: 1px;

    &.adjust-font{
        @media screen and (max-width: 550px){
            font-size: 10px;
            max-width: 40%;
        }
    }
`;

const SpanSubPageButton = styled.span`
    white-space: nowrap;
    display: block;
    position: relative;
    height: 100%;
    border-radius: 5px 5px 0px 0px;
    background: rgb(232, 232, 232);
    padding: 5px 30px;
`;

const SpanSelectedSubPageButton = styled.span`
    white-space: nowrap;
    display: block;
    position: relative;
    height: 100%;
    border-radius: 5px 5px 0px 0px;
    background: rgb(232, 232, 232);
    padding: 5px 30px;
    color: rgb(87, 166, 149);
    font-weight: bold;
    box-shadow: rgb(136 136 136) 0px 0px 1px 1px;
    
    &.adjust-font{
        @media screen and (max-width: 550px){
            white-space: break-spaces;
            text-align: center;
        }
    }
`;

export const SubPageButton = ({text, path, selected, fontSize}: {fontSize?:string, text:string | JSX.Element, path?:string, selected?: boolean}) => {

    const navigate = useNavigate();

    const goTo = () => {
        if(path !== undefined) navigate(path)
    }

    return (
        <DivSubPageButton onClick={goTo} className={fontSize}>
            {(selected) ? <SpanSelectedSubPageButton className={fontSize}>{text}</SpanSelectedSubPageButton> : <SpanSubPageButton>{text}</SpanSubPageButton>}
        </DivSubPageButton>
    )
}