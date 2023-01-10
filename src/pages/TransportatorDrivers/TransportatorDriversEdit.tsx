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
import { Driver } from "../../types/Driver";
import { InputPictureFieldEdit } from "../../components/forms/InputPictureFieldEdit";
import Avatar from '../../assets/imgs/male_avatar.png'


export const TransportatorDriversEdit = ({drivers, uid_transportadora} : {drivers:Driver[] | undefined, uid_transportadora?:string}) => {
    let validFormValues:string[] = [];

    const auth = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        auth.setPath("Home → Gerenciamento → Transportadoras → Motoristas → Editar Motoristas")
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { register, handleSubmit, setValue } = useForm();
    const [driver, setDriver] = useState<Driver>();

    const onOptionSelected = (event:ChangeEvent<HTMLSelectElement>) => {
        const getDriver = (uid:string) => {
            return Array.from(Object.values(drivers!).filter((drivers:Driver) => drivers.uid === uid))[0];
        }
        setDriver(getDriver(event.target.value));
        validFormValues = [];
    }

    const hasChanged = (name:string) => {
        validFormValues.push(name)
    }

    const onSubmit = (values:any) => {
        if(uid_transportadora === undefined) return swal("Oops!", "Nenhuma transportadora foi selecionada!", "error");
        if (driver === undefined) return swal("Oops!", "Nenhum Motorista foi Selecionado!", "error");
        Object.keys(values).forEach((name:string) => {if(!validFormValues.includes(name)) delete values[name]})
        if(Object.keys(values).length === 0) return swal("Oops!", "Nenhuma modificação foi realizada!", "error");
        values.date = getFormatDate();
        values.uid_transportadora = uid_transportadora;
        console.log(values)
        const result:{[uid:string] : Driver}  = {[driver.uid] : values}

        setIsLoading(true)
        // console.log(result);

        transportatorsApi().editDriver(result)
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

    const driverSelection = (drivers === undefined) ? undefined : Array.from(Object.values(drivers).map((driver: Driver) => [driver.uid, driver.nome_motorista]));

    const pageContent = () => {
        return (
            <form onSubmit={handleSubmit(onSubmit as any)}>
                <Section text="Selecionar Motorista">
                    <InputSection>
                        <InputSelectFieldEditSelector array={driverSelection} label="Motorista" onOptionSelected={onOptionSelected} />
                    </InputSection>
                </Section>

                <Section text="Dados do Motorista">
                    <InputSection>
                        <InputTextFieldEdit formSetValue={setValue} editFrom={driver} label="Nome Completo" name="nome_motorista" register={register} hasChanged={hasChanged} />
                        <InputTextFieldEdit formSetValue={setValue} editFrom={driver} label="CNH" name="cnh" register={register} hasChanged={hasChanged} />
                    </InputSection>
                    <InputSection>
                        <InputTextFieldEdit formSetValue={setValue} editFrom={driver} label="Email" name="email" register={register} hasChanged={hasChanged} />
                        <InputTextFieldEdit formSetValue={setValue} editFrom={driver} label="Telefone" name="telefone" register={register} hasChanged={hasChanged} />
                    </InputSection>
                </Section>

                <Section text="Selecionar Imagem" alignCenter={true}>
                    <InputPictureFieldEdit formSetValue={setValue} editFrom={driver} defaultSrc={Avatar} name="image" hasChanged={hasChanged}/>
                </Section>

                <SubmitButton text="Atualizar"/>
            </form>
        )
    }

    return(
        isLoading ? <LoadingPage/> : pageContent()
    )
} 