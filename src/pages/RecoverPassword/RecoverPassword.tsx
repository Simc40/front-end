import React, { ChangeEvent, FormEvent, useState } from "react"
import { LoadingPage } from "../LoadingPage/LoadingPage"
import Logo from '../../assets/imgs/logo.png'
import swal from 'sweetalert';
import { ContainerLogin, Card, ContainerHeader, Img, FormSignIn, InputEmail, Button } from '../Login/LoginStyles'

export const RecoverPassword = () => {

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);


    const handleEmailInput = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
    }

    const validateForm = () =>{
        if(email === "") throw Error("O Email não foi Preenchido");
        if(!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) throw Error("Email Inválido");
    }

    const handleSubmit = (event:FormEvent<HTMLFormElement>) => {
        try{
            setLoading(true);
            event.preventDefault();
            validateForm();
            const submit = JSON.stringify({
                "email": email,
            })
            event.preventDefault();
            console.log(submit)
        } catch(e){
            if (e instanceof Error) {
                setLoading(false);
                swal("Oops!", e.message, "error");
            }
        }
    }

    const pageContent = () => {
        return (
            <ContainerLogin>
                <Card>
                    <ContainerHeader className="container-header text-center">Bem-vindo</ContainerHeader>
                    <Img src={Logo} alt="logo" />
                    <FormSignIn className="w-100" onSubmit={handleSubmit}>
                        <h1 className="h6 fw-normal text-center">Digite o seu Email</h1>
                        <div className="form-floating">
                            <InputEmail type="email" className="form-control" id="floatingInput" value={email} onChange={handleEmailInput}/>
                            <label>Email</label>
                        </div>
                        <Button className="btn btn-lg btn-primary" type="submit">Recuperar Senha</Button>
                        <a href="/"><p className="text-muted text-center">Voltar ao Login </p></a>
                    </FormSignIn>
                </Card>
          </ContainerLogin>
        )
    }

    return(
        loading ? <LoadingPage/> : pageContent()
    )
}