import React from "react"
import styled from 'styled-components'


const RoundedInput = styled.input`
    width: 1.8em;
    height: 1.8em;
    background-color: white;
    border-radius: 50%;
    vertical-align: middle;
    border: 1px solid #ddd;
    appearance: none;
    -webkit-appearance: none;
    outline: none;
    cursor: pointer;

    &:checked {
        background-color: green;
    }
`;

export const CircleCheckBox = ({checked} : {checked: boolean}) => {

    return (
        <RoundedInput type="checkbox" defaultChecked={checked} disabled={true}/>
    )
}