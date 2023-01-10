import React, { useState } from "react";
import styled from 'styled-components'
import { UseFormRegister, FieldValues, UseFormSetValue } from "react-hook-form";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import ptBR from 'date-fns/locale/pt-BR';
import { getDate } from "../../hooks/getDate";

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
    &:hover{
        cursor: pointer;
    }
`;

const Label = styled.label`
    font-weight: 500;
    padding: 0.7rem 0.75rem;;
`;

const DatePickerContainer = styled.div`
    .react-datepicker-wrapper{
        visibility: collapse;
    }
`;

export const InputDateField = ({register, setFormValue,  label, name, ...props} : {setFormValue:UseFormSetValue<FieldValues> , register:UseFormRegister<FieldValues>, label:string, name:string}) => {

    const [colored, setColor] = useState('');
    const [value, setValue] = useState('');
    const [startDate, setStartDate] = useState(new Date());

    const onNotChange = () => {
        return;
    }

    const onChange = (date:Date) => {
        setStartDate(date); 
        setValue(getDate(date));
        setColor(' colored');
        setFormValue(name, getDate(date));
    }

    const onClick = () => {
        document.getElementById((name + "-datePicker"))?.click();
    }

    return (
        <DivFormContainer className="form-floating">
            <Input {...register(name)} id={name + "-input"} type="text" className={"form-control" + colored} value={value} onChange={onNotChange} onClick={onClick} {...props}/>
            <DatePickerContainer><DatePicker id={name + "-datePicker"} locale={ptBR} selected={startDate} onChange={onChange} /></DatePickerContainer>
            <Label>{label}</Label>
        </DivFormContainer>
    )
}