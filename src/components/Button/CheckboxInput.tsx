import { Checkbox } from "@mui/material"
import React, { ChangeEvent } from "react"

export const CheckboxInput = ({checked, onChange, disabled} : {disabled?: boolean, checked: boolean, onChange?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void | undefined}) => {

    return (
        <Checkbox disabled={disabled} checked={checked} onChange={(params) => {if(onChange !== undefined) onChange(params, !checked)} }/>
    )
}