import React, { useContext, useEffect } from "react"
import { Section } from "../../components/forms/Section";
import { AlertYellow } from "../../components/Alert/AlertYellow";
import styled from 'styled-components'
import Img1 from '../../assets/imgs/tutorial/tutorial-step1.png'
import Img2 from '../../assets/imgs/tutorial/tutorial-step2.png'
import Img3 from '../../assets/imgs/tutorial/tutorial-step3.png'
import Img4 from '../../assets/imgs/tutorial/tutorial-step4.png'
import Img6 from '../../assets/imgs/tutorial/tutorial-step6.png'
import Img7 from '../../assets/imgs/tutorial/tutorial-step7.png'
import { AuthContext } from "../../contexts/Auth/AuthContext";


const Paragraph = styled.div`
    background: #e8e8e8;
    border-radius: 10px;
    padding: 10px;
    margin-top: 25px;
    margin-bottom: 15px;
    font-size: 0.9rem;
`;

const Img = styled.img`
    max-width: 90%
`;

export const ClientsSincronizeDatabase = () => {

    const auth = useContext(AuthContext);

    useEffect(() => {
        auth.setPath("Home → Clientes → Sincronizar Banco de Dados")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const pageContent = () => {
        return (
            <Section text="Sincronizar Banco de dados">
                <Paragraph className="tutorial" style={{display: 'block'}}>Acesse o console do firebase no seguinte link: </Paragraph>
                <div className="inline-form" style={{'maxWidth': '50%'}}>
                    <div className="tutorial-input form-floating">
                        <input type="text" className="form-control" id="floating-firebase-link" readOnly={true} value="https://firebase.google.com/" disabled={true}/>
                        <label htmlFor="floating-firebase-link">Link: </label>
                    </div>
                </div>
                <Paragraph className="tutorial">Após acessar o console na conta do sistema,<br/>clique em Realtime Database no menu lateral do lado esquerdo da tela </Paragraph>
                <Img src={Img1} alt=""/>
                <Paragraph className="tutorial">Você verá a seguinte tela:<br/>Vá até o menu e clique em 'Criar banco de dados'</Paragraph>
                <Img src={Img2} alt=""/>
                <Paragraph className="tutorial">Uma tela irá se abrir, com o título 'Configurar banco de dados'<br/>Insira o nome do cliente colocando o caractere '-' entre espaços<br/> Exemplo: Se o cliente é "Ouro Construtora" a referência deve ser: "simc-iot-ouro-construtora"</Paragraph>
                <AlertYellow children={<>Use sempre letras minusculas, substitua os espaços no nome por -  ,  Tenha certeza que utilizou traço: - e não underline: _</>}/>
                <div className="double-image">
                    <Img src={Img3} alt=""/>
                    <Img src={Img4} alt=""/>
                </div>
                <Paragraph className="tutorial">Pronto, o banco de dados já foi criado, agora temos que atualizar as regras de acesso!<br/>Selecione o banco do novo cliente, e vá até o menu superior, e clique em 'Regras'</Paragraph>
                <Paragraph className="tutorial">Cole o seguinte texto: </Paragraph>
                <div className="inline-form" style={{'maxWidth': '50%'}}>
                    <div className="tutorial-input form-floating">
                        <textarea className="form-control" id="floating-firebase-rules" rows={6} style={{'height': 'fit-content'}} readOnly={true} value={`{\n\t"rules": {\n\t\t".read": "true",\n\t\t".write": "auth != null"\n\t}\n}`}
                        ></textarea>
                        <label htmlFor="floating-firebase-rules">Novas Regras: </label>
                    </div>
                </div>
                <Paragraph className="tutorial">Clique em Publicar para realizar as mudanças! </Paragraph>
                <Img src={Img6} alt=""/>
                <Paragraph className="tutorial">Agora estamos na etapa final!<br/> Vá até o menu superior, e clique em 'Dados', esse é link do database que deve ser colocado no cadastro de cliente :D<br/> Nesse exemplo será: 'https://simc-iot-nome-cliente.firebaseio.com' </Paragraph>
                <Img src={Img7} alt=""/>
            </Section>
        )
    }

    return(
        pageContent()
    )
} 