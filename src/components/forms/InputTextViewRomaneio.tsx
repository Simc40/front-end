import React, { useEffect, useState } from "react";
import styled from 'styled-components'
import { UseFormRegister, FieldValues, UseFormSetValue } from "react-hook-form";


const DivFormContainer = styled.div`
    @media screen and (max-width: 1200px){
        max-width: 100%;
    }

    max-width: 48.5%;
    min-width: 200px;
    position: relative;
    display: flex;
    margin: 7.5px 0px;
    align-items: center;
`;

const Input = styled.input`
    text-align: center;
    font-weight: 500;
    border: 1px solid;
`;

const Label = styled.label`
    width: 40%;
    text-align: center;
    font-size: 10px;
    place-self: center;
    margin-right: 10px;
    
    @media screen and (min-width: 1150px){
        font-size: 15px;
        white-space: nowrap;
        width: auto;
    }
`;

export const InputTextViewRomaneio = ({register, label, name, metric, value, setFormValue, ...props} : {value: number, setFormValue:UseFormSetValue<FieldValues>, register:UseFormRegister<FieldValues>, label:string, name:string, metric: string}) => {
    
    const [fieldValue, setFieldValue] = useState("");

    useEffect(() => {
        setFormValue(name, value.toString())
        setFieldValue(value + " " + metric)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);
    
    return (
        <DivFormContainer>
            {!label.includes("<br/>") ? <Label>{label}</Label> : <Label>Capacidade de carga<br/>do Veículo</Label>}
            <Input {...register(name)} disabled={true} className="form-control" value={fieldValue} {...props}/>
        </DivFormContainer>
    )
}