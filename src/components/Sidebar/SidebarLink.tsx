/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react"
import styled from 'styled-components'

const Li = styled.li`
    &.invisible{
        display: none;
    }
`;

export const SidebarLink = ({link, text, icon, toggle, visibility} : {visibility?: boolean, link:string, text:string, icon:string, toggle:string}) => {

    return (
        (toggle === 'sidebar-wrapper collapse show') ? 
        <Li className={visibility ? "invisible" : ""}>
            <a href={link}>
                <span className="material-icons">{icon}</span>
                <span>{text}</span>
            </a>
        </Li> : 
        <Li className={visibility ? "invisible" : ""}>
            <a>
                <span className="material-icons">{icon}</span>
            </a>
        </Li>
    )
}