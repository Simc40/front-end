import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { Client } from "../../types/Client"
import swal from 'sweetalert';


export const ClientComponent = ({client} : {client: Client}) => {

    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [value] = useState(client);

    const handleClick = () => {
        auth.setUserClient(client)
        .then((success) => {
            if(success === 200) navigate('/home')
        }).catch((error) => {
            console.log(error)
            swal("Oops!", "Ocorreu um erro Inesperado, contate o suporte!", "error");
        })
    }

    return (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a className="list-group-item list-group-item-action py-3 lh-sm" onClick={handleClick}>
            <div className="d-flex w-100 align-items-center justify-content-between">
                <strong className="mb-1">{value.nome}</strong>
                <small className="text-muted">{value.uf}</small>
            </div>
            <div className="col-10 mb-1 small"><strong>CNPJ: </strong>{value.cnpj}</div>
            <div className="col-10 mb-1 small"><strong>CEP: </strong>{value.cep}</div>
            <div className="col-10 mb-1 small"><strong>Cidade: </strong>{value.cidade}</div>
        </a>
    )
}