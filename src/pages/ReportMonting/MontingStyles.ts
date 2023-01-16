import styled from "styled-components";

export const Board = styled.div`
    @media screen and (max-width: 550px) {
        display: flex;
        flex-direction: row-reverse;
        width: 100%;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 20px;
        row-gap: 10px;
        column-gap: 2%;
    }

    display: flex;
    width: 100%;
    margin-top: 20px;
    justify-content: space-between;
    gap: 1%;
`;

export const DivProgressbar = styled.div`
    background: #a8cf45;
    width: 0%;
    height: 100%;
`;

export const DivProgressbarText = styled.div`
    position: absolute;
    width: 83.5%;
    text-align: center;
    font-weight: bold;
`;

export const Panel = styled.div`
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    column-gap: 1%;
    row-gap: 20px;

    @media screen and (max-width: 1150px) {
        flex-wrap: wrap;
    }
`;

export const Column = styled.div`
    width: 50%;

    @media screen and (max-width: 1150px) {
        width: 100%;
    }
`;

export const DoubleColumn = styled.div`
    @media screen and (max-width: 1150px) {
        width: 100%;
    }

    width: 50%;
    display: flex;
    flex-direction: row;
    gap: 2%;

    .left {
        width: 50%;
    }

    .middle {
        width: 50%;
    }
`;

export const Card = styled.div`
    box-shadow: 0px -1px 3px #282c33;
    border-radius: calc(0.375rem - 1px);
`;

export const CardHeader = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    background: #57a695;
    font-weight: bold;
    height: 45px;
    color: white;
`;

export const CardBody = styled.div`
    background: white;

    &.chartBody {
        height: calc(30vh - 55px);
        margin-top: 5px;
        text-align: -webkit-center;
    }
`;

export const Icon = styled.span`
    @media screen and (max-width: 550px) {
        margin-left: 5px;
    }

    margin-left: 15px;
`;

export const Title = styled.div`
    @media screen and (max-width: 550px) {
        margin-right: 5px;
        text-align: center;
    }

    margin-left: 10px;
    font-size: 0.9rem;
`;

export const TableLeft = styled.table`
    width: 95%;
    margin-left: 2.5%;
    margin-top: 15px;
    margin-bottom: 0;
    text-overflow: ellipsis;
    text-align: center;
    vertical-align: middle;
    font-size: calc(calc(55vh - 45px) / 30);

    th {
        background: rgb(232, 232, 232);
        padding: 2px 0;
        text-align: center;
    }

    td {
        width: 50%;
        padding: 0;
        text-align: center;
    }
`;

export const TableMiddle = styled.table`
    width: 100%;
    height: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    vertical-align: middle;
    font-size: calc(calc(55vh - 45px) / 33);
    border-bottom-right-radius: calc(0.8rem - 1px);
    border-bottom-left-radius: calc(0.8rem - 1px);

    th {
        @media screen and (max-width: 550px) {
            padding: 0;
        }

        vertical-align: middle;
        background: rgb(232, 232, 232);
        text-align: center;
    }

    td {
        @media screen and (max-width: 550px) {
            padding: 0;
        }
        text-align: center;
    }

    tr {
        height: calc(calc(55vh - 45px) / 11);
    }
`;
