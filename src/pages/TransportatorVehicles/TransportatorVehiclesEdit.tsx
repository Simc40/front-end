import React, { ChangeEvent, useContext, useEffect, useState } from "react"
import { InputSection } from "../../components/forms/InputSection";
import { Section } from "../../components/forms/Section";
import { SubmitButton } from "../../components/Button/SubmitButton";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../contexts/Auth/AuthContext";
import swal from 'sweetalert';
import { InputSelectFieldEditSelector } from "../../components/forms/InputSelectFieldEditSelector";
import { InputTextFieldEdit } from "../../components/forms/InputTextFieldEdit";
import { getFormatDate } from "../../hooks/getDate";
import { transportatorsApi } from "../../apis/TransportatorsApi";
import LoadingPage from "../LoadingPage/LoadingPage";
import { Vehicle } from "../../types/Vehicle";


export const TransportatorVehiclesEdit = ({vehicles, uid_transportadora} : {vehicles:Vehicle[] | undefined, uid_transportadora?:string}) => {
    let validFormValues:string[] = [];

    const auth = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        auth.setPath("Home → Gerenciamento → Transportadoras → Veículos → Editar Veículos")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { register, handleSubmit, setValue } = useForm();
    const [vehicle, setVehicle] = useState<Vehicle>();

    const onOptionSelected = (event:ChangeEvent<HTMLSelectElement>) => {
        const getVehicle = (uid:string) => {
            return Array.from(Object.values(vehicles!).filter((vehicle:Vehicle) => vehicle.uid === uid))[0];
        }
        setVehicle(getVehicle(event.target.value));
        validFormValues = [];
    }

    const hasChanged = (name:string) => {
        validFormValues.push(name)
    }

    const onSubmit = (values:any) => {
        if(uid_transportadora === undefined) return swal("Oops!", "Nenhuma transportadora foi selecionada!", "error");
        if (vehicle === undefined) return swal("Oops!", "Nenhum Veículo foi Selecionado!", "error");
        Object.keys(values).forEach((name:string) => {if(!validFormValues.includes(name)) delete values[name]})
        if(Object.keys(values).length === 0) return swal("Oops!", "Nenhuma modificação foi realizada!", "error");
        values.date = getFormatDate();
        values.uid_transportadora = uid_transportadora;
        console.log(values)
        const result:{[uid:string] : Vehicle}  = {[vehicle.uid] : values}

        setIsLoading(true)

        transportatorsApi().editVehicle(result)
        .then(async () => {
            setIsLoading(false)
            return swal({
                icon: 'success',
                title: 'Mudanças realizadas com sucesso',
            }).then(() => {
                window.location.reload()
            })
        }).catch((error) => {
            setIsLoading(false)
            console.log(error);
            swal("Oops!", "Ocorreu um erro Inesperado, contate o suporte!", "error");
        })
    }

    const VehicleSelection = (vehicles === undefined) ? undefined : Array.from(Object.values(vehicles).map((vehicle: Vehicle) => [vehicle.uid, vehicle.marca + ' - ' + vehicle.placa]));

    const pageContent = () => {
        return (
            <form onSubmit={handleSubmit(onSubmit as any)}>
                <Section text="Selecionar Veículo">
                    <InputSection>
                        <InputSelectFieldEditSelector array={VehicleSelection} label="Veículo" onOptionSelected={onOptionSelected} />
                    </InputSection>
                </Section>

                <Section text="Dados do Veículo">
                    <InputSection>
                        <InputTextFieldEdit formSetValue={setValue} editFrom={vehicle} label="Marca" name="marca" register={register} hasChanged={hasChanged} />
                        <InputTextFieldEdit formSetValue={setValue} editFrom={vehicle} label="Modelo" name="modelo" register={register} hasChanged={hasChanged} />
                    </InputSection>
                    <InputSection>
                        <InputTextFieldEdit formSetValue={setValue} editFrom={vehicle} label="Placa" name="placa" register={register} hasChanged={hasChanged} />
                    </InputSection>
                </Section>

                <Section text="Características do Veículo">
                    <InputSection>
                        <InputTextFieldEdit type="number" formSetValue={setValue} editFrom={vehicle} label="Peso (Kg)" name="peso" register={register} hasChanged={hasChanged} />
                        <InputTextFieldEdit type="number" formSetValue={setValue} editFrom={vehicle} label="Número de Eixos (und)" name="numero_eixos" register={register} hasChanged={hasChanged} />
                    </InputSection>
                    <InputSection>
                        <InputTextFieldEdit type="number" formSetValue={setValue} editFrom={vehicle} label="Capacidade de Carga (Kg)" name="capacidade_carga" register={register} hasChanged={hasChanged} />
                    </InputSection>
                </Section>

                <SubmitButton text="Atualizar"/>
            </form>
        )
    }

    return(
        isLoading ? <LoadingPage/> : pageContent()
    )
} 