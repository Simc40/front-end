import React, {ChangeEvent, FormEvent, useContext ,useState} from "react"
import { LoadingPage } from "../LoadingPage/LoadingPage"
import Logo from '../../assets/imgs/logo.png'
import swal from 'sweetalert';
import { AuthContext } from "../../contexts/Auth/AuthContext";
import { useNavigate } from "react-router";
import { ContainerLogin, Card, ContainerHeader, Img, FormSignIn, InputEmail, InputPassword, Button } from './LoginStyles'

export const Login = () => {

    const http507 = "Usuário não registrado!";
    const http500 = "Servidor Indisponível";
    const http401 = "O usuário ou a senha estão incorretos";
    const http403 = "Acesso negado, solicite ao seu Administrador acesso ao sistema!";

    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('julioclopes32@gmail.com');
    const [password, setPassword] = useState('12345678');
    const [loading, setLoading] = useState(false);
    

    const validateForm = () =>{
        if(email === "") throw Error("O Email não foi Preenchido");
        if(password === "") throw Error("A Senha não foi Preenchida");
        if(!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) throw Error("Email Inválido");
    }

    const handleSubmit = async (event:FormEvent<HTMLFormElement>) => {
        try{
            setLoading(true);
            event.preventDefault();
            validateForm();
            auth.signin(email, password)
            .then((statusCode) => {
                if (statusCode === 507) {
                    swal("Oops!", http507, "error");
                    setLoading(false);
                }else if (statusCode === 500) {
                    swal("Oops!", http500, "error");
                    setLoading(false);
                }else if (statusCode === 401) {
                    swal("Oops!", http401, "error");
                    setLoading(false);
                }else if (statusCode === 403) {
                    swal("Oops!", http403, "error");
                    setLoading(false);
                }else if (statusCode === 200) {
                    setLoading(false);
                    navigate("/home");
                }else if (statusCode === 202) {
                    setLoading(false);
                    navigate("/selecionar_cliente");
                }
            }).catch((error) => {
                console.log(error)
                setLoading(false);
                swal("Oops!", "O Servidor está indisponível", "error");
            })
        }catch(e){
            if (e instanceof Error) {
                setLoading(false);
                swal("Oops!", e.message, "error");
            }
        }
    }

    const handlePasswordInput = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    }

    const handleEmailInput = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
    }

    const pageContent = () => {
        return (
            <ContainerLogin>
                <Card>
                    <ContainerHeader className="container-header text-center">Bem-vindo</ContainerHeader>
                    <Img src={Logo} alt="logo" />
                    <FormSignIn className="w-100" onSubmit={handleSubmit}>
                        <h1 className="h6 fw-normal text-center">Faça o Login</h1>
                        <div className="form-floating">
                            <InputEmail type="email" className="form-control" id="floatingInput" placeholder="Email" value={email} onChange={handleEmailInput}/>
                            <label>Email</label>
                        </div>
                        <div className="form-floating">
                            <InputPassword type="password" className="form-control" id="floatingPassword" placeholder="Senha" value={password} onChange={handlePasswordInput}/>
                            <label>Senha</label>
                        </div>
        
                        <Button className="btn btn-lg btn-primary" type="submit">Login</Button>
                        <a href="/recover_password"><p className="text-muted text-center"> &copy; Esqueceu a senha? </p></a>
                    </FormSignIn>
                </Card>
          </ContainerLogin>
        )
    }

    return(
        loading ? <LoadingPage/> : pageContent()
    )
}