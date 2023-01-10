/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react"

export const SidebarLinkGroup = ({ children, text, icon, toggle }: { children: JSX.Element|JSX.Element[], text:string, icon:string, toggle:string}) => {

    const [visibility, setVisibility] = useState('collapse');
    const [arrow, setArrow] = useState('sidebar-dropdown');

    const handleVisibility = () => {
        setVisibility((visibility === 'collapse') ? 'collapse show' : 'collapse')
        setArrow((arrow === 'sidebar-dropdown') ? 'sidebar-dropdown active' : 'sidebar-dropdown')
    }

    return (
        (toggle === 'sidebar-wrapper collapse show') ? 
        <>
            <li className={arrow} data-bs-toggle="show" onClick={handleVisibility} style={{cursor:"pointer"}}>
                <a>
                    <span className="material-icons">{icon}</span>
                    <span style={{fontSize: '13px'}}>{text}</span>
                </a>
            </li>
            <div className={visibility} style={{paddingLeft: '30px'}}>
                {children}
            </div>
        </> :
        <>
        <li style={{cursor:"pointer"}}>
            <a>
                <span className="material-icons">{icon}</span>
            </a>
        </li>
    </>
            
    )
}