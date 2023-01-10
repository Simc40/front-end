/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { MouseEventHandler, useContext, useState } from "react";
import './Navbar.scss'
import Logo from '../../assets/imgs/logo.png'
import Avatar from '../../assets/imgs/male_avatar.png'
import { AuthContext } from "../../contexts/Auth/AuthContext";
import swal from 'sweetalert';
import { useNavigate } from "react-router";

const Navbar = ({setSidebarVisibility} : {setSidebarVisibility: MouseEventHandler<HTMLSpanElement> | undefined}) => {

    const [userDropdown, setUserDropdown] = useState('collapse dropdown-menu-dark text-small shadow');

    const toggleUserDropdown = () => {
        setUserDropdown((userDropdown === 'collapse dropdown-menu-dark text-small shadow') ? 'collapse dropdown-menu-dark text-small shadow show' : 'collapse dropdown-menu-dark text-small shadow')
    }

    const auth = useContext(AuthContext);
    const user = auth.user;
    const navigate = useNavigate();

    const logout = (event: any) => {
        event.preventDefault();

        if(auth.user?.acesso === "admin"){
            swal({
                title: "Deseja Selecionar Outro Cliente?",
                icon: "warning",
                buttons: {
                    cancel: {
                        visible: true,
                        text: "Logout",
                        value: "logout",
                    },
                    catch: {
                        visible: true,
                        text: "Selecionar Cliente",
                        value: "client",
                        className: "swal-button--danger"
                    },
                },
                dangerMode: true,
            })
            .then((confirm) => {
                console.log(confirm)
                if (confirm === "logout") {
                    auth
                    .signout()
                    .then(() => {
                        navigate("/");
                    })
                }else if(confirm === "client"){
                    navigate("/selecionar_cliente");
                }
            });
        }else{
            swal({
                title: "Realizar Logout?",
                icon: "warning",
                buttons: ["cancel", "ok"],
                dangerMode: true,
            })
            .then((confirm) => {
                if (confirm) {
                    auth
                    .signout()
                    .then(() => {
                        navigate("/");
                    })
                }
            });
        }
    }

    return (
        <div className="topnav">
           <div className="brandAndLogos">
                <a className="topnav-brand">
                    <span id="menu-collapse-icon" className="material-icons" data-bs-toggle="collapse" data-bs-target="#sidebar" onClick={setSidebarVisibility}>menu</span>
                    <img className = "topnav-img" id="topnav-logo" src={(user?.logoUrl !== undefined) ? user.logoUrl : Logo}/>
                </a>
                <a className="topnav-text cliente">
                    <strong><span id="topnav-cliente" className="topnav-cliente">{(user != null) ? user.cliente : ''}</span></strong>
                </a>
                <a className="topnav-text path">
                    <strong><span className = "topnav-path">{auth.path}</span></strong>
                </a>
            </div>
            <div className="userDropdown">
                <div id="dropdown" className="dropdown">
                    <a href="#" className="d-flex align-items-center text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="collapse" data-bs-target="#dropdown-menu" onClick={toggleUserDropdown}>
                    <img id="user-image" src={(user?.imgUrl !== undefined) ? user.imgUrl : Avatar} alt="" width="32" height="32" className="rounded-circle me-2"/>
                    <strong id="user-name">{(user != null && user.nome !== undefined) ? Array.from(user.nome.split(' ')).filter((_word, i) => i <= 1).join(' ') : ''}</strong>
                    </a>
                    <ul id = "dropdown-menu" className={userDropdown} aria-labelledby="dropdownUser1">
                        <li><a className="dropdown-item" href="#">Configurações</a></li>
                        <li><a className="dropdown-item" href="/profile">Perfil</a></li>
                        <li><hr className="dropdown-divider"/></li>
                        <li><a id="profile-list-logoff" className="dropdown-item" onClick={logout}>Log-Out</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navbar;