import React from "react"
import styled from "styled-components";

const Link = styled.div`
    color: blue;
    text-decoration: underline;

    &:hover{
        cursor: pointer;
    }
`;

export const OnClickLink = ({text, onClick, onClickParams} : {onClickParams:any, text:string, onClick: (...args: any[]) => void}) => {

    const pageContent = () => {
        return (
            <Link onClick={() => onClick(onClickParams)}>{text}</Link>
        )
    }

    return(
        pageContent()
    )
} 