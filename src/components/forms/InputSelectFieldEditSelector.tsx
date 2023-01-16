import React, { ChangeEventHandler } from "react";
import styled from "styled-components";

const DivFormContainer = styled.div`
    @media screen and (max-width: 480px) {
        max-width: 100%;
    }

    max-width: 48.5%;
    position: relative;
    flex: 1 1 0%;
    margin: 7.5px 0px;
`;

const Input = styled.select`
    padding-top: 0.7rem;
    padding-bottom: 0px;
    line-height: 1.25;
`;

const Label = styled.label`
    font-weight: 500;
    padding: 0.7rem 0.75rem; ;
`;

export const InputSelectFieldEditSelector = ({
    value,
    label,
    array,
    onOptionSelected,
    style,
    ...props
}: {
    style?: React.CSSProperties;
    value?: string;
    label: string;
    array: string[][] | (string | undefined)[][] | undefined;
    onOptionSelected: ChangeEventHandler<HTMLSelectElement>;
}) => {
    return (
        <DivFormContainer className="form-floating" style={style}>
            <Input
                className="form-control"
                value={value}
                defaultValue=""
                onChange={onOptionSelected}
                {...props}
            >
                <option value="" disabled>
                    Selecionar {label}
                </option>
                {array !== undefined
                    ? Array.from(array).map((item, i) => (
                          <option key={i} value={item[0]}>
                              {item[1]}
                          </option>
                      ))
                    : undefined}
            </Input>
            <Label>{label}</Label>
        </DivFormContainer>
    );
};
