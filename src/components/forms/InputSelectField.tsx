import React, { ChangeEventHandler, useState } from "react";
import styled from 'styled-components'
import { UseFormRegister, FieldValues } from "react-hook-form";


const DivFormContainer = styled.div`
    @media screen and (max-width: 480px){
        max-width: 100%;
    }
    
    max-width: 48.5%;
    position: relative;
    flex: 1 1 0%;
    margin: 7.5px 0px;

    select.colored{
        background: rgb(232, 240, 254);
    }
`;

const Input = styled.select`
    padding-top: 0.7rem;
    padding-bottom: 0px;
    line-height: 1.25;
`;

const Label = styled.label`
    font-weight: 500;
    padding: 0.7rem 0.75rem;;
`;

export const InputSelectField = ({register, label, name, array, onOptionSelected} : {onOptionSelected?:ChangeEventHandler<HTMLSelectElement>, register:UseFormRegister<FieldValues>,name: string, label:string, array:string[][] | (string | undefined)[][] | undefined}) => {

    const [colored, setColor] = useState('');

    const onInput = (event: any) => {
        console.log(event)
    } 

    return (
        <DivFormContainer className="form-floating">
            <Input {...register(name)} className={"form-control" + colored} name={name} defaultValue={""} onChange={(params) => {
                    if(onOptionSelected !== undefined) onOptionSelected(params);
                    if(params.target.value !== "") setColor(" colored") 
                    else setColor("")}
            }>
                <option value="" disabled onSelectCapture={onInput}>Selecionar {label}</option>
                {(array !== undefined) ? Array.from(array).map((item, i) => <option key={i} value={item[0]}>{item[1]}</option>) : undefined}
            </Input>
            <Label>{label}</Label>
        </DivFormContainer>
    )
}