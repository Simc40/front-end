import React, { useEffect, useState } from "react";
import styled from 'styled-components'
import { UseFormRegister, FieldValues, UseFormSetValue } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ptBR from 'date-fns/locale/pt-BR';
import { dateFromString, getDate } from "../../hooks/getDate";

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

const DatePickerContainer = styled.div`
    .react-datepicker-wrapper{
        visibility: collapse;
    }
`;

export const InputDateFieldEdit = ({register, hasChanged, label, name, disabled, editFrom, type, formSetValue, ...props} : {type?:string, register:UseFormRegister<FieldValues>, hasChanged: (name: string) => void, label:string, name:string, disabled?:boolean, editFrom: any, formSetValue:UseFormSetValue<FieldValues>}) => {

    const [value, setValue] = useState('');
    const [colored, setColor] = useState('');
    const [startDate, setStartDate] = useState(new Date());

    const onNotChange = () => {
        return;
    }

    const onClick = () => {
        document.getElementById((name + "-datePicker"))?.click();
    }

    const handleChange = (date: Date) => {
        setStartDate(date); 
        formSetValue(name, getDate(date))
        setValue(getDate(date))
        hasChanged(name)
        setColor(' colored');
    }

    useEffect(() => {
        let value = (editFrom !== undefined) ? editFrom[name] : undefined
        setValue(value)
        formSetValue(name, value)
        setColor('')
        setStartDate((value === undefined) ? new Date() : dateFromString(value));

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editFrom]);

    return (
        <DivFormContainer className="form-floating">
            <Input {...register(name)}  type={(type === undefined) ? "text": type} disabled={disabled} className={"form-control" + colored} value={(value !== undefined) ? value : ''} onChange={onNotChange} onClick={onClick} {...props}/> 
            <DatePickerContainer><DatePicker id={name + "-datePicker"} locale={ptBR} selected={startDate} onChange={handleChange} /></DatePickerContainer>
            <Label>{label}</Label>
        </DivFormContainer>
    )
}