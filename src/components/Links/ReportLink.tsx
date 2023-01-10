import React, { Dispatch, SetStateAction } from "react"
import { Piece } from "../../types/Piece";
import styled from "styled-components";

const Link = styled.div`
    color: blue;
    text-decoration: underline;

    &:hover{
        cursor: pointer;
    }
`;

export const ReportLink = ({piece, setPiece} : {piece:Piece, setPiece: Dispatch<SetStateAction<Piece | undefined>>}) => {

    const pageContent = () => {
        return (
            <Link onClick={() => setPiece(piece)}>{piece.nome_peca}</Link>
        )
    }

    return(
        pageContent()
    )
} 