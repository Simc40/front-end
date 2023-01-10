import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { Section } from "../../components/forms/Section";
import { SubmitButton } from "../../components/Button/SubmitButton";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import swal from "sweetalert";
import { GridColDef } from "@mui/x-data-grid";
import { InputSection } from "../../components/forms/InputSection";
import { Piece, PiecesApiGetInterface } from "../../types/Piece";
import { Construction } from "../../types/Construction";
import { RomaneioTable } from "../../components/Tables/RomaneioTable";
import { CheckboxInput } from "../../components/Button/CheckboxInput";
import { InputTextViewRomaneio } from "../../components/forms/InputTextViewRomaneio";
import styled from "styled-components";
import { InputSelectField } from "../../components/forms/InputSelectField";
import { InputDateField } from "../../components/forms/InputDateField";
import { Transportator } from "../../types/Transportator";
import { Driver } from "../../types/Driver";
import { Vehicle } from "../../types/Vehicle";
import { getFormatDate } from "../../hooks/getDate";
import { RomaneioCarga } from "../../types/RomaneioCarga";
import { firstLetterUpperCase } from "../../hooks/firstLetterUpperCase";
import LoadingPage from "../LoadingPage/LoadingPage";
import { romaneiosApi } from "../../apis/RomaneiosApi";

const LabelSection = styled.div`
    justify-content: space-between;
    flex-direction: row;
    flex: 1;
    display: flex;
    gap: 3%;
`;

export const RomaneioRegister = ({
    transportators,
    pieces,
}: {
    transportators: Transportator[];
    pieces: PiecesApiGetInterface;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [pecasRomaneio, setPecasRomaneio] = useState<Piece[]>([]);
    const [rows, setRows] = useState<Piece[]>();

    const [vehicleCapacity, setVehicleCapacity] = useState(0);
    const [weight, setWeight] = useState(0);
    const [volume, setVolume] = useState(0);

    const [transportator, setTransportator] = useState<Transportator>();
    const [drivers, setDrivers] = useState<
        string[][] | (string | undefined)[][] | undefined
    >([]);
    const [vehicles, setVehicles] = useState<
        string[][] | (string | undefined)[][] | undefined
    >([]);

    const auth = useContext(AuthContext);
    const { handleSubmit, register, setValue, reset } = useForm();

    useEffect(() => {
        auth.setPath("Home → Gerenciamento → Logística → Romaneio");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const columns: GridColDef[] = [
        { field: "tag", headerName: "RFID", flex: 1, minWidth: 300 },
        {
            field: "nome_peca",
            headerName: "Nome",
            align: "center",
            headerAlign: "center",
            flex: 2,
            minWidth: 200,
        },
        {
            field: "tipo",
            headerName: "Tipo",
            align: "center",
            headerAlign: "center",
            flex: 1,
            minWidth: 150,
            valueGetter: (params) => {
                return params.row.element !== undefined
                    ? params.row.element.geometry.nome_tipo_peca
                    : "";
            },
        },
        {
            field: "pretty_etapa_atual",
            headerName: "Status",
            align: "center",
            headerAlign: "center",
            flex: 1,
            minWidth: 200,
        },
        {
            field: "peso",
            headerName: "Peso",
            align: "center",
            headerAlign: "center",
            flex: 1,
            minWidth: 150,
            valueGetter: (params) => {
                return params.row.element !== undefined
                    ? params.row.element.peso + "Kg"
                    : "";
            },
        },
        {
            field: "volume",
            headerName: "Volume",
            align: "center",
            headerAlign: "center",
            flex: 1,
            minWidth: 150,
            valueGetter: (params) => {
                return params.row.element !== undefined
                    ? params.row.element.volume + "m³"
                    : "";
            },
        },
        {
            field: "secao",
            headerName: "Seção",
            align: "center",
            headerAlign: "center",
            flex: 1,
            minWidth: 150,
            valueGetter: (params) => {
                return params.row.element !== undefined
                    ? params.row.element.b +
                          "cm x " +
                          params.row.element.h +
                          "cm"
                    : "";
            },
        },
        {
            field: "comprimento",
            headerName: "Comprimento",
            align: "center",
            headerAlign: "center",
            flex: 1,
            minWidth: 150,
            valueGetter: (params) => {
                return params.row.element !== undefined
                    ? params.row.element.c + "m"
                    : "";
            },
        },
        {
            field: "check",
            headerName: "Check",
            disableColumnMenu: true,
            flex: 1,
            align: "center",
            headerAlign: "center",
            minWidth: 100,
            renderCell: (params) => (
                <CheckboxInput
                    checked={params.row.check}
                    onChange={() => handleConfirmChange(params.row)}
                />
            ),
        },
    ];

    function handleConfirmChange(params: any) {
        params.check = !params.check;
        const checkedPecas = Array.from(rows!).filter(
            (row: Piece) => row.check === true
        );
        setPecasRomaneio(checkedPecas);
        let w: number = 0;
        let v: number = 0;
        checkedPecas.forEach((peca: Piece) => {
            w += parseInt(peca.element!.peso);
            v += parseInt(peca.element!.volume);
        });
        setWeight(w);
        setVolume(v);
        return params;
    }

    const onSubmit = (result: RomaneioCarga) => {
        try {
            validateFields(result);
            if (pecasRomaneio.length === 0)
                return swal("Oops!", "Nenhuma peça foi Selecionada", "error");
            result.date = getFormatDate();
            result.pecas = Object.assign(
                {},
                ...pecasRomaneio.map((x) => ({ [x.tag]: x.elemento }))
            );
        } catch (error) {
            if (error instanceof Error) {
                console.log(error);
                return swal("Oops!", error.message, "error");
            }
        }

        // setIsLoading(true)

        romaneiosApi()
            .getRomaneioCounter()
            .then((counter) => {
                const romaneioCounter = parseInt(counter[0]) + 1;
                result.romaneio_carga = romaneioCounter.toString();
                return result;
            })
            .then((result) => romaneiosApi().registerCarga(result))
            .then(async () => {
                setIsLoading(false);
                return swal({
                    icon: "success",
                    title: "Mudanças realizadas com sucesso",
                }).then(() => {
                    window.location.reload();
                });
            })
            .catch((error) => {
                setIsLoading(false);
                console.log(error);
                swal(
                    "Oops!",
                    "Ocorreu um erro Inesperado, contate o suporte!",
                    "error"
                );
            });
    };

    const validateFields = (data: RomaneioCarga) => {
        Object.entries(data).forEach((field: [string, any]) => {
            if (field[1] === "")
                throw Error(
                    "O campo " +
                        firstLetterUpperCase(field[0]) +
                        " não foi Preenchido"
                );
        });
    };

    const onOptionSelected = (event: ChangeEvent<HTMLSelectElement>) => {
        const piecesOnEvent: any = pieces[event.target.value];
        setPecasRomaneio([]);
        setWeight(0);
        setVolume(0);
        setRows(
            Object.values(piecesOnEvent)
                .map((pieces: any) => {
                    return Object.values(pieces);
                })
                .flatMap((piece: any) => piece)
                .filter((piece: any) => piece.romaneio === undefined)
                .map((row: any, i: number) => {
                    return { index: i, check: false, ...row };
                })
        );
    };

    const OnTransportatorSelected = (event: ChangeEvent<HTMLSelectElement>) => {
        setVehicleCapacity(0);
        const getTransportator = (uid: string) => {
            return Array.from(
                Object.values(transportators).filter(
                    (transportator: Transportator) => transportator.uid === uid
                )
            )[0];
        };
        const selectedTransportator = getTransportator(event.target.value);
        setTransportator(selectedTransportator);
        setDrivers(
            selectedTransportator === undefined ||
                selectedTransportator.motoristas === undefined
                ? []
                : Array.from(
                      Object.values(selectedTransportator.motoristas).map(
                          (driver: Driver) => [
                              driver.uid,
                              driver.nome_motorista,
                          ]
                      )
                  )
        );
        setVehicles(
            selectedTransportator === undefined ||
                selectedTransportator.veiculos === undefined
                ? []
                : Array.from(
                      Object.values(selectedTransportator.veiculos).map(
                          (vehicle: Vehicle) => [
                              vehicle.uid,
                              vehicle.marca + " - " + vehicle.placa,
                          ]
                      )
                  )
        );
        reset({
            veiculo: "",
            motorista: "",
        });
    };

    const OnSelectedVehicle = (event: ChangeEvent<HTMLSelectElement>) => {
        setVehicleCapacity(
            parseInt(
                transportator!.veiculos[event.target.value].capacidade_carga
            )
        );
    };

    const constructionSelection =
        pieces !== undefined
            ? Array.from(
                  new Set(
                      Object.values(pieces)
                          .flatMap((element: any) => Object.values(element))
                          .flatMap((rfid: any) => Object.values(rfid))
                          .map((rfid: any) => rfid.construction)
                  )
              ).map((construction: Construction) => {
                  return [construction.uid, construction.nome_obra];
              })
            : [];
    const transportatorSelection =
        transportators === undefined
            ? undefined
            : Array.from(
                  Object.values(transportators).map(
                      (transportator: Transportator) => [
                          transportator.uid,
                          transportator.nome_empresa,
                      ]
                  )
              );

    const pageContent = () => {
        return (
            <>
                <form onSubmit={handleSubmit(onSubmit as any)}>
                    <Section text="Informações de Romaneio">
                        <InputSection>
                            <InputSelectField
                                register={register}
                                array={transportatorSelection}
                                label="Transportadora"
                                name="transportadora"
                                onOptionSelected={OnTransportatorSelected}
                            />
                            <InputSelectField
                                register={register}
                                array={vehicles}
                                label="Veículo"
                                name="veiculo"
                                onOptionSelected={OnSelectedVehicle}
                            />
                            <InputSelectField
                                register={register}
                                array={drivers}
                                label="Motorista"
                                name="motorista"
                            />
                            <InputDateField
                                register={register}
                                setFormValue={setValue}
                                label="Data de Previsão"
                                name="data_prev"
                            />
                            <InputSelectField
                                register={register}
                                array={constructionSelection}
                                label="Obra de Destino"
                                name="obra"
                                onOptionSelected={onOptionSelected}
                            />
                        </InputSection>
                    </Section>

                    <Section text="Selecionar Peças">
                        <InputSection>
                            <LabelSection>
                                <p>
                                    (Clique duas vezes na célula da coluna Check
                                    <br /> para adicionar a peça no Romaneio.)
                                </p>
                                <InputSection>
                                    <InputTextViewRomaneio
                                        register={register}
                                        value={vehicleCapacity}
                                        setFormValue={setValue}
                                        label="Capacidade de carga<br/>do Veículo"
                                        name="capacidade_carga"
                                        metric="Kg"
                                    />
                                    <InputTextViewRomaneio
                                        register={register}
                                        value={weight}
                                        setFormValue={setValue}
                                        label="Peso"
                                        name="peso_carregamento"
                                        metric="Kg"
                                    />
                                    <InputTextViewRomaneio
                                        register={register}
                                        value={volume}
                                        setFormValue={setValue}
                                        label="Volume"
                                        name="volume_carregamento"
                                        metric="m³"
                                    />
                                </InputSection>
                            </LabelSection>
                        </InputSection>
                        <RomaneioTable
                            columnRows={columns}
                            tableRows={rows}
                            onCellClick={handleConfirmChange}
                        />
                    </Section>

                    <Section text="Peças Selecionadas">
                        <RomaneioTable
                            columnRows={columns}
                            tableRows={pecasRomaneio}
                            onCellClick={handleConfirmChange}
                        />
                    </Section>

                    <SubmitButton text="Registrar" />
                </form>
            </>
        );
    };

    return isLoading ? <LoadingPage /> : pageContent();
};
