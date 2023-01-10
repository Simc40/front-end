import React, { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../contexts/Auth/AuthContext";
import './SelectClient.scss';
import Logo from '../../assets/imgs/logo.png'
import { ClientComponent } from "./ClientComponent";
import { Client } from "../../types/Client";
import LoadingPage from "../LoadingPage/LoadingPage";

export const SelectClient = () => {

    const [loading, setLoading] = useState(true)
    const [items, setItems] = useState([])

    const auth = useContext(AuthContext);

    useEffect(() => {
        auth.getClients().then((resJson) => {
            return setItems(resJson);
        }).then(() => {
            setLoading(false);
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const content = loading ? <div>loading...</div> : Object.values(items).map((client:Client) => <ClientComponent key={client.uid} client={client}/>);
    
    const pageContent = () => {
        return (
            <div className="container">
                <div className="card">
                    <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-white">
                        <a href="/" className="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom">
                        <img src={Logo} className="bi pe-none me-2" width="30" height="24" alt=""></img>
                        <span className="fs-5 fw-semibold">Lista  de Clientes</span>
                        </a>
                        <div id ='lista' className="list-group list-group-flush border-bottom scrollarea">
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return(
        loading? <LoadingPage/> : pageContent()
    )
}