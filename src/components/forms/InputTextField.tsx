import React, { ChangeEvent, useState } from "react";
import styled from 'styled-components'
import { UseFormRegister, FieldValues } from "react-hook-form";
import { maskPhone } from "../../masks/maskPhone";
import { maskCnpj } from "../../masks/maskCnpj";
import { maskCep } from "../../masks/maskCep";
import { maskCpf } from "../../masks/maskCpf";
import { maskCnh } from "../../masks/maskCNH";


const DivFormContainer = styled.div`
    @media screen and (max-width: 480px){
        max-width: 100%;
    }

    max-width: 48.5%;
    position: relative;
    flex: 1 1 0%;
    margin: 7.5px 0px;

    input.colored{
        background: rgb(232, 240, 254);
    }
`;

const Input = styled.input`
    padding-top: 0.7rem;
    padding-bottom: 0px;
    line-height: 1.25;
`;

const Label = styled.label`
    font-weight: 500;
    padding: 0.7rem 0.75rem;;
`;

export const InputTextField = ({register, label, name, disabled, type, ...props} : {register:UseFormRegister<FieldValues>, label:string, name:string, disabled?:boolean, type?:string}) => {

    const [colored, setColor] = useState('');
    const [value, setValue] = useState('');

    const onchange = (event: ChangeEvent<HTMLInputElement>) => {
        setColor((event.target.value !== "") ? ' colored' : '');
        if(type === "number"){
            setValue((parseInt(event.target.value) < 1) ? "1" : event.target.value)
            return;
        }
        switch(type){
            case "CPF":
                setValue(maskCpf(event.target.value))
                break;
            case "phone":
                setValue(maskPhone(event.target.value))
                break;
            case "CEP":
                setValue(maskCep(event.target.value))
                break;
            case "CNPJ":
                setValue(maskCnpj(event.target.value))
                break;
            case "CNH":
                setValue(maskCnh(event.target.value))
                break;
            default:
                setValue(event.target.value)
                break;
        }
        
    }

    return (
        <DivFormContainer className="form-floating">
            <Input {...register(name)} type={(type === "number") ? type : "text"} disabled={disabled} className={"form-control" + colored} value={value} onChange={onchange} autoComplete="new-password" {...props}/>
            <Label>{label}</Label>
        </DivFormContainer>
    )
}