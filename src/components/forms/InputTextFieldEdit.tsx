import React, { ChangeEvent, useEffect, useState } from "react";
import styled from 'styled-components'
import { UseFormRegister, FieldValues, UseFormSetValue } from "react-hook-form";
import { maskCpf } from "../../masks/maskCpf";
import { maskPhone } from "../../masks/maskPhone";
import { maskCep } from "../../masks/maskCep";
import { maskCnpj } from "../../masks/maskCnpj";

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

export const InputTextFieldEdit = ({register, hasChanged, label, name, disabled, editFrom, type, formSetValue, ...props} : {type?:string, register:UseFormRegister<FieldValues>, hasChanged: (name: string) => void, label:string, name:string, disabled?:boolean, editFrom: any, formSetValue:UseFormSetValue<FieldValues>}) => {

    const [value, setValue] = useState('');
    const [colored, setColor] = useState('');


    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if(type === "number"){
            formSetValue(name, (parseInt(event.target.value) < 1) ? "1" : event.target.value)
            setValue((parseInt(event.target.value) < 1) ? "1" : event.target.value)
            hasChanged(name)
            onchange(event);
            return;
        }
        switch(type){
            case "CPF":
                setValue(maskCpf(event.target.value))
                formSetValue(name, event.target.value)
                break;
            case "phone":
                setValue(maskPhone(event.target.value))
                formSetValue(name, event.target.value)
                break;
            case "CEP":
                setValue(maskCep(event.target.value))
                formSetValue(name, event.target.value)
                break;
            case "CNPJ":
                setValue(maskCnpj(event.target.value))
                formSetValue(name, event.target.value)
                break;
            default:
                setValue(event.target.value)
                formSetValue(name, event.target.value)
                break;
        }
        hasChanged(name)
        onchange(event);
    }

    useEffect(() => {
        let value = (editFrom !== undefined) ? editFrom[name] : undefined
        setValue(value)
        formSetValue(name, value)
        setColor('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editFrom]);

    const onchange = (event: ChangeEvent<HTMLInputElement>) => setColor((event.target.value !== "") ? ' colored' : '');


    return (
        <DivFormContainer className="form-floating">
            <Input {...register(name)}  type={(type === "number") ? type : "text"} disabled={disabled} className={"form-control" + colored} value={(value !== undefined) ? value : ''} onChange={handleChange} autoComplete="new-password" {...props}/> 
            <Label>{label}</Label>
        </DivFormContainer>
    )
}