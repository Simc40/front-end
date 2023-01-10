import React from "react"
import styled from "styled-components";

const LinkDiv = styled.div`
    color: blue;
    text-decoration: underline;

    &:hover{
        cursor: pointer;
    }
`;

export const Link = ({url} : {url:string}) => {

    const onClick = () => {
        window.open(url, '_blank');
    }

    const pageContent = () => {
        return (
            <LinkDiv onClick={onClick}>Exibir</LinkDiv>
        )
    }

    return(
        pageContent()
    )
} 