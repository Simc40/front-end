import React from "react"
import styled from 'styled-components'

const DivImgContainer = styled.div`
    margin-top: 25px;
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const Img = styled.img`
    @media screen and (max-width: 480px){
        width: 200px;
    }

    @media screen and (min-width: 481px){
        width: 300px;
    }
`;

export const PictureField = ({src, ...props} : {src:string}) => {

    return (
        <DivImgContainer><Img className="form-control" alt="" src={src} {...props}/></DivImgContainer>
    )
}