import React, { useState } from "react"
import Sidebar from '../Sidebar/Sidebar'
import Navbar from "../Navbar/Navbar";
import styled from 'styled-components'

const DivWrapper = styled.div`
    min-height: 100vh;
    display: flex;
    background: white;
`;

const DivContainer = styled.div`

    @media screen and (max-width: 480px){
        width: 100%;
        // padding-top: 12vh;
        // padding-bottom: 5vh;
        // margin: 0px 20px;
        padding: 12vh 20px 5vh 20px;
    }

    @media screen and (min-width: 481px){
        width: 100%;
        // padding-top: 12vh;
        // padding-bottom: 5vh;
        // margin: 0px 50px;
        padding: 12vh 50px 5vh 50px;

    }
`;

export const Container = ({children} : {children: JSX.Element | JSX.Element[]}) => {

    const [sidebarVisibility, setSidebarVisibility] = useState('sidebar-wrapper collapse show minWidth');

    const changeSidebarVisibility = () => {
        setSidebarVisibility((sidebarVisibility === 'sidebar-wrapper collapse show minWidth') ? 'sidebar-wrapper collapse show' : 'sidebar-wrapper collapse show minWidth')
    }

    return (
        <DivWrapper className="wrapper">
            <Navbar setSidebarVisibility={changeSidebarVisibility}/>
            <Sidebar sidebarVisibility = {sidebarVisibility} setSidebarVisibility={changeSidebarVisibility}/>
            <DivContainer>
                {children}
            </DivContainer>
        </DivWrapper>
    )
}