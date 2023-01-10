/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { MouseEventHandler, useContext } from "react";
import { SidebarLink } from "./SidebarLink";
import "./sidebar.scss";
import { SidebarLinkGroup } from "./SidebarLinkGroup";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import swal from "sweetalert";
import { useNavigate } from "react-router";

const Sidebar = ({
    sidebarVisibility,
    setSidebarVisibility,
}: {
    sidebarVisibility: string;
    setSidebarVisibility: MouseEventHandler<HTMLSpanElement> | undefined;
}) => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const logout = (event: any) => {
        event.preventDefault();

        if (auth.user?.acesso === "admin") {
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
                        className: "swal-button--danger",
                    },
                },
                dangerMode: true,
            }).then((confirm) => {
                console.log(confirm);
                if (confirm === "logout") {
                    auth.signout().then(() => {
                        navigate("/");
                    });
                } else if (confirm === "client") {
                    navigate("/selecionar_cliente");
                }
            });
        } else {
            swal({
                title: "Realizar Logout?",
                icon: "warning",
                buttons: ["cancel", "ok"],
                dangerMode: true,
            }).then((confirm) => {
                if (confirm) {
                    auth.signout().then(() => {
                        navigate("/");
                    });
                }
            });
        }
    };

    return (
        <nav id="sidebar" className={sidebarVisibility}>
            <div className="sidebar-content" style={{ paddingBottom: "10px" }}>
                <div className="toggleSidebarContainer">
                    <span
                        className="material-icons toggleSidebar"
                        onClick={setSidebarVisibility}
                    >
                        menu
                    </span>
                </div>
                <div className="sidebar-menu">
                    <ul>
                        <li className="header-menu">
                            <span>Menu</span>
                        </li>
                        <SidebarLink
                            link={"/home"}
                            text={"Menu Principal"}
                            icon={"home"}
                            toggle={sidebarVisibility}
                        />
                        <SidebarLink
                            link={"/dashboard"}
                            text={"Dashboard"}
                            icon={"insights"}
                            toggle={sidebarVisibility}
                        />
                        <SidebarLink
                            link={"/clientes/cadastrar_cliente"}
                            text={"Clientes"}
                            icon={"person_add"}
                            toggle={sidebarVisibility}
                            visibility={auth.user?.acesso !== "admin"}
                        />

                        <SidebarLinkGroup
                            text={"Gerenciamento"}
                            icon={"class"}
                            toggle={sidebarVisibility}
                        >
                            <SidebarLink
                                link={"/gerenciar_acesso/cadastrar_usuario"}
                                text={"Acesso"}
                                icon={"engineering"}
                                toggle={sidebarVisibility}
                            />
                            <SidebarLink
                                link={"/obras/cadastrar_obras"}
                                text={"Obras"}
                                icon={"home_work"}
                                toggle={sidebarVisibility}
                            />
                            <SidebarLink
                                link={"/geometrias/cadastrar_geometrias"}
                                text={"Geometrias"}
                                icon={"arrow_upward"}
                                toggle={sidebarVisibility}
                            />
                            <SidebarLink
                                link={"/formas/cadastrar_formas"}
                                text={"Formas"}
                                icon={"category"}
                                toggle={sidebarVisibility}
                            />
                            <SidebarLink
                                link={"/elementos/cadastrar_elementos"}
                                text={"Elementos"}
                                icon={"format_shapes"}
                                toggle={sidebarVisibility}
                            />

                            <SidebarLinkGroup
                                text={"Transportadoras"}
                                icon={"business"}
                                toggle={sidebarVisibility}
                            >
                                <SidebarLink
                                    link={
                                        "/transportadoras/cadastrar_transportadoras"
                                    }
                                    text={"Empresas"}
                                    icon={"emoji_transportation"}
                                    toggle={sidebarVisibility}
                                />
                                <SidebarLink
                                    link={
                                        "/transportadoras/motoristas/cadastrar_motoristas"
                                    }
                                    text={"Motoristas"}
                                    icon={"badge"}
                                    toggle={sidebarVisibility}
                                />
                                <SidebarLink
                                    link={
                                        "/transportadoras/veiculos/cadastrar_veiculos"
                                    }
                                    text={"Veículos"}
                                    icon={"local_shipping"}
                                    toggle={sidebarVisibility}
                                />
                            </SidebarLinkGroup>

                            <SidebarLink
                                link={"/galpoes/cadastrar_galpoes"}
                                text={"Galpões"}
                                icon={"inventory"}
                                toggle={sidebarVisibility}
                            />
                            <SidebarLink
                                link={"/checklists/modificar_checklist"}
                                text={"Checklist"}
                                icon={"checklist"}
                                toggle={sidebarVisibility}
                            />

                            <SidebarLinkGroup
                                text={"PDFs"}
                                icon={"picture_as_pdf"}
                                toggle={sidebarVisibility}
                            >
                                <SidebarLink
                                    link={"/PDF/obras"}
                                    text={"Obras"}
                                    icon={"home_work"}
                                    toggle={sidebarVisibility}
                                />
                                <SidebarLink
                                    link={"/PDF/elementos"}
                                    text={"Elementos"}
                                    icon={"format_shapes"}
                                    toggle={sidebarVisibility}
                                />
                            </SidebarLinkGroup>

                            <SidebarLink
                                link={"/BIM/gerenciar_modelos"}
                                text={"BIM"}
                                icon={"map"}
                                toggle={sidebarVisibility}
                            />
                        </SidebarLinkGroup>

                        <SidebarLinkGroup
                            text={"Logistica"}
                            icon={"account_tree"}
                            toggle={sidebarVisibility}
                        >
                            <SidebarLink
                                link={"/romaneio/registrar_romaneio"}
                                text={"Romaneio"}
                                icon={"streetview"}
                                toggle={sidebarVisibility}
                            />
                        </SidebarLinkGroup>

                        <SidebarLinkGroup
                            text={"Programação"}
                            icon={"assignment"}
                            toggle={sidebarVisibility}
                        >
                            <SidebarLink
                                link={"/programacao-semanal"}
                                text={"Semanal"}
                                icon={"pie_chart"}
                                toggle={sidebarVisibility}
                            />
                            <SidebarLink
                                link={"/programacao/planejamento"}
                                text={"Planejamento"}
                                icon={"maps_home_work"}
                                toggle={sidebarVisibility}
                            />
                        </SidebarLinkGroup>

                        <SidebarLinkGroup
                            text={"Relatórios"}
                            icon={"summarize"}
                            toggle={sidebarVisibility}
                        >
                            <SidebarLink
                                link={"/relatorios/geral"}
                                text={"Geral"}
                                icon={"factory"}
                                toggle={sidebarVisibility}
                            />
                            <SidebarLink
                                link={"/relatorios/inspecao"}
                                text={"Inspeção"}
                                icon={"checklist"}
                                toggle={sidebarVisibility}
                            />
                            <SidebarLink
                                link={"/relatorios-montagem"}
                                text={"Montagem"}
                                icon={"extension"}
                                toggle={sidebarVisibility}
                            />
                        </SidebarLinkGroup>
                    </ul>
                </div>
            </div>
            {sidebarVisibility === "sidebar-wrapper collapse show" ? (
                <div className="sidebar-footer">
                    <a href="/profile">
                        <i className="fas fa-user"></i>
                    </a>
                    <a href="">
                        <i className="fa fa-envelope"></i>
                        <span className="badge badge-pill badge-success notification">
                            7
                        </span>
                    </a>
                    <a href="">
                        <i className="fa fa-cog"></i>
                    </a>
                    <a id="log-off" onClick={logout}>
                        <i className="fa fa-power-off"></i>
                    </a>
                </div>
            ) : (
                <div className="sidebar-footer" onClick={logout}>
                    <a id="log-off">
                        <i className="fa fa-power-off"></i>
                    </a>
                </div>
            )}
        </nav>
    );
};

export default Sidebar;
