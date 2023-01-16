import styled from "styled-components";

export const DoubleColumnSection = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 20px;
    max-height: 80vh;
`;

export const ColumnSection = styled.div`
    width: 50%;

    &.left {
        padding-right: 10px;
        overflow-y: scroll;
    }

    &.right {
        padding-left: 10px;
    }
`;
