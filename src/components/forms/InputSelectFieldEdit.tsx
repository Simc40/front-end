import React, { ChangeEvent, useEffect, useState } from "react";
import styled from 'styled-components'
import { UseFormRegister, FieldValues, UseFormSetValue } from "react-hook-form";


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

export const InputSelectFieldEdit = ({register, onOptionSelected, label, name, array, formSetValue, editFrom, hasChanged} : {onOptionSelected?:(event: ChangeEvent<HTMLSelectElement> | undefined) => void, hasChanged: (name: string) => void, editFrom: any, formSetValue:UseFormSetValue<FieldValues>, register:UseFormRegister<FieldValues>,name: string, label:string, array:string[][] | (string | undefined)[][] | undefined}) => {
    
    const [colored, setColor] = useState('');


    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        formSetValue(name, event.target.value)
        hasChanged(name)
        setColor((event.target.value !== "") ? ' colored' : '')
        
    }

    useEffect(() => {
        let value = (editFrom !== undefined) ? editFrom[name] : undefined
        // setValue(value)
        formSetValue(name, value)
        setColor('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editFrom]);
    
    return (
        <DivFormContainer className="form-floating">
            <Input {...register(name)} className={"form-control" + colored} name={name} defaultValue={""} onChange={(event) => {handleChange(event); if(onOptionSelected !== undefined) onOptionSelected(event)}}>
                <option value="" disabled>Selecionar {label}</option>
                {(array !== undefined) ? Array.from(array).map((item, i) => <option key={i} value={item[0]}>{item[1]}</option>) : undefined}
            </Input>
            <Label>{label}</Label>
        </DivFormContainer>
    )
}