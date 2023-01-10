import React, { ChangeEventHandler } from "react"
import styled from 'styled-components'

const DivSubPageSelect = styled.div`
    width: 20%;
    margin-top: 1px;
    margin-right: 1px;
    position: relative;
    margin-left: auto;

    @media screen and (max-width: 550px){
        width: 45%;
    }

    @media screen and (min-width: 551px) and (max-width: 800px){
        width: 25%;
    }
`;

const SelectSubPageSelect = styled.select`
    padding-top: 0.9rem!important;
    padding-bottom: 0!important;
    font-weight: bold;
    border-radius: 5px 5px 0 0;
    background-color: #e8e8e8;
    box-shadow: 0px 0px 1px 1px #888;
    height: calc(2.8rem + 2px)!important;
    line-height: 1.25;

    &:focus {
        background: #e8e8e8;
    }

    &:hover{
        cursor: pointer;
    }

    option {
        font-weight: bold;
    }
`;

const Label = styled.label`
    top: -5px!important;
`;

export const SubPageSelect = ({label, array, onOptionSelected}: {onOptionSelected:ChangeEventHandler<HTMLSelectElement>, label:string, array?:[string[], string[]] | string[][]}) => {
    
    return (
        <DivSubPageSelect className="form-floating">
            <SelectSubPageSelect className="form-control" onChange={onOptionSelected}>
                <option value="select">Selecionar {label}</option>
                {(array !== undefined) ? Array.from(array).map((item, i) => <option key={i} value={item[0]}>{item[1]}</option>) : undefined}
            </SelectSubPageSelect>
            <Label>{label}</Label>
        </DivSubPageSelect>
    )
}