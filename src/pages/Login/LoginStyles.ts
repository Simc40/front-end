import styled from 'styled-components'


export const ContainerLogin = styled.div`
    width: 100%;
    max-width: 1120px;
    height: 100vh;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const Card = styled.div`
    height: 95vh;
    border-radius: 15px;
    background-color: white;
    border: 2px solid #E6E6E6;
    box-shadow: 0 0.3px 0 0.3px #424242;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;

    @media screen and (max-width: 480px){
        width: 90%;
    }

    @media screen and (min-width: 481px) and (max-width: 768px){
        max-width: 300px;
    }

    @media screen and (min-width: 769px) and (max-width: 1024px){
        max-width: 300px;
    }

    @media screen and (min-width: 1025px) and (max-width: 1200px){
        max-width: 300px;
    }

    @media screen and (min-width: 1201px){
        width: 32%;
    }        
`;

export const ContainerHeader = styled.div`
    width: 100%;
    height: 20vh;
    padding: 15vh 5% 0 5%;
    font-size: 1.5em;
    font-weight: 500;
    margin:0;
`;

export const Img = styled.img`
    height: 20vh;
    width: 80%;
    object-fit: contain;
    padding: 9% 5%;
`;

export const FormSignIn = styled.form`
    padding: 0 15% 10vh 15%;
    height: 55vh;
    text-align: center;

    p{
        width: 100%;
        margin-top: 2vh;
    }

    .form-floating:focus-within {
        z-index: 2;
    }
`;

export const InputEmail = styled.input`
    margin-bottom: -1px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
`;

export const InputPassword = styled.input`
    margin-bottom: 10px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
`;

export const Button = styled.button`
    width: 90%;
    margin-top: 2vh;
    --bs-btn-bg: #a8cf45!important;
    --bs-btn-border-color: #a8cf45!important;
    --bs-btn-disabled-bg: #a8cf45!important;
    --bs-btn-disabled-border-color: #a8cf45!important;
    --bs-btn-hover-bg: #57a695!important;
    --bs-btn-hover-border-color: #57a695!important;
    --bs-btn-active-bg: #57a695!important;
    --bs-btn-active-border-color: #57a695!important;
`;
